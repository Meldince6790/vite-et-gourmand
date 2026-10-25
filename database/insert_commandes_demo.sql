-- =============================================================================
-- INSERT — 3 commandes de démonstration (CMD-2026-004 / 005 / 006)
-- =============================================================================
-- À exécuter UNIQUEMENT après autorisation explicite et backup MariaDB.
-- Prévisualisation : database/preview_commandes_demo.sql
-- NE PAS monter dans docker-entrypoint-initdb.d.
--
-- Effets (si préconditions OK) :
--   1. Insère 3 commandes (menus 4, 8, 15) pour le client existant utilisateur_id=3.
--   2. Décrémente quantite_restante des menus concernés (miroir createCommande).
--   3. Préserve les 3 commandes historiques CMD-2026-001/002/003.
--
-- Livraison : adresses 33000 Bordeaux. Aligné sur routing.service.js —
--   isInBordeaux → distance_km=0 et prix_livraison=0 (valeur retenue facturation,
--   pas une distance routière mesurée). Hors Bordeaux, l'API calculerait 5+0.59*km.
--
-- Idempotence :
--   - INSERT uniquement si numero_commande absent.
--   - Décrément stock uniquement si l'INSERT correspondant vient d'avoir lieu.
--
-- MongoDB : non touché ici. Après COMMIT réussi :
--   cd backend && npm run stats:resync
--   (recalcule depuis MariaDB, statut <> 'Annulée', sans doublons)
-- =============================================================================

SET NAMES utf8mb4;

START TRANSACTION;

-- ---------------------------------------------------------------------------
-- 0) Snapshot commandes historiques (doivent rester identiques après)
-- ---------------------------------------------------------------------------
SET @hist_ok := (
  SELECT COUNT(*) FROM commande c
  WHERE
    (c.numero_commande = 'CMD-2026-001' AND c.menu_id = 1 AND c.statut = 'Terminée'
      AND c.utilisateur_id = 3 AND c.nombre_personne = 25 AND c.prix_menu = 787)
    OR (c.numero_commande = 'CMD-2026-002' AND c.menu_id = 2 AND c.statut = 'En préparation'
      AND c.utilisateur_id = 3 AND c.nombre_personne = 15 AND c.prix_menu = 480)
    OR (c.numero_commande = 'CMD-2026-003' AND c.menu_id = 3 AND c.statut = 'Annulée'
      AND c.utilisateur_id = 3 AND c.nombre_personne = 30 AND c.prix_menu = 1350)
);

SET @menus_ok := (SELECT COUNT(*) FROM menu WHERE menu_id IN (4, 8, 15));
SET @client_ok := (
  SELECT COUNT(*) FROM utilisateur
  WHERE utilisateur_id = 3 AND role_id = 1 AND actif = 1
);

SET @stock4 := (SELECT quantite_restante FROM menu WHERE menu_id = 4);
SET @stock8 := (SELECT quantite_restante FROM menu WHERE menu_id = 8);
SET @stock15 := (SELECT quantite_restante FROM menu WHERE menu_id = 15);

SET @exist_004 := (SELECT COUNT(*) FROM commande WHERE numero_commande = 'CMD-2026-004');
SET @exist_005 := (SELECT COUNT(*) FROM commande WHERE numero_commande = 'CMD-2026-005');
SET @exist_006 := (SELECT COUNT(*) FROM commande WHERE numero_commande = 'CMD-2026-006');

-- Stock requis seulement pour les références encore absentes
SET @need4 := IF(@exist_004 = 0, 20, 0);
SET @need8 := IF(@exist_005 = 0, 18, 0);
SET @need15 := IF(@exist_006 = 0, 25, 0);

SET @pre_ok := (
  @hist_ok = 3
  AND @menus_ok = 3
  AND @client_ok = 1
  AND @stock4 >= @need4
  AND @stock8 >= @need8
  AND @stock15 >= @need15
);

SET @guard_sql := IF(
  @pre_ok = 1,
  'SELECT ''Preconditions OK (historiques + menus + client + stocks)'' AS statut',
  'SIGNAL SQLSTATE ''45000'' SET MESSAGE_TEXT = ''REFUS insert demo: preconditions non satisfaites (historiques/menus/client/stock)'''
);
PREPARE stmt_guard FROM @guard_sql;
EXECUTE stmt_guard;
DEALLOCATE PREPARE stmt_guard;

-- ---------------------------------------------------------------------------
-- 1) INSERT idempotents (calculs alignés Commande.calculerPrixMenu / Livraison)
--    prix_menu : prix_par_personne * n * (0.9 si n >= min+5)
--    prix_livraison : 0 si km=0 sinon 5 + 0.59*km
-- ---------------------------------------------------------------------------

-- CMD-2026-004 — Cocktail Dinatoire (menu 4)
-- 20 pers, min 15 → remise ; Bordeaux → distance_km=0 / livraison=0 (routing.isInBordeaux)
-- Acceptée
SET @before_004 := (SELECT COUNT(*) FROM commande WHERE numero_commande = 'CMD-2026-004');
INSERT INTO commande (
  numero_commande, date_commande, date_prestation, heure_livraison,
  adresse_livraison, distance_km, informations_complementaires,
  prix_menu, nombre_personne, prix_livraison, statut,
  pret_materiel, restitution_materiel, utilisateur_id, menu_id,
  mode_contact_annulation, motif_annulation, date_annulation
)
SELECT
  'CMD-2026-004', '2026-09-02', '2026-09-20', '12:30',
  '12 rue Sainte-Catherine, 33000 Bordeaux', 0.00, 'Démonstration — cocktail dînatoire',
  684.00, 20, 0.00, 'Acceptée',
  0, 0, 3, 4,
  NULL, NULL, NULL
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM commande WHERE numero_commande = 'CMD-2026-004'
);
SET @inserted_004 := (
  SELECT COUNT(*) FROM commande WHERE numero_commande = 'CMD-2026-004'
) - @before_004;

UPDATE menu
SET quantite_restante = quantite_restante - 20
WHERE menu_id = 4
  AND @inserted_004 = 1
  AND quantite_restante >= 20;
SET @stock_upd_004 := IF(@inserted_004 = 0 OR ROW_COUNT() = 1, 1, 0);

-- CMD-2026-005 — Estival Méditerranéen (menu 8)
-- 18 pers, min 12 → remise ; Bordeaux → distance_km=0 / livraison=0 ; En préparation
SET @before_005 := (SELECT COUNT(*) FROM commande WHERE numero_commande = 'CMD-2026-005');
INSERT INTO commande (
  numero_commande, date_commande, date_prestation, heure_livraison,
  adresse_livraison, distance_km, informations_complementaires,
  prix_menu, nombre_personne, prix_livraison, statut,
  pret_materiel, restitution_materiel, utilisateur_id, menu_id,
  mode_contact_annulation, motif_annulation, date_annulation
)
SELECT
  'CMD-2026-005', '2026-09-08', '2026-09-28', '19:00',
  '45 cours de l''Intendance, 33000 Bordeaux', 0.00, 'Démonstration — estival méditerranéen',
  631.80, 18, 0.00, 'En préparation',
  0, 0, 3, 8,
  NULL, NULL, NULL
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM commande WHERE numero_commande = 'CMD-2026-005'
);
SET @inserted_005 := (
  SELECT COUNT(*) FROM commande WHERE numero_commande = 'CMD-2026-005'
) - @before_005;

UPDATE menu
SET quantite_restante = quantite_restante - 18
WHERE menu_id = 8
  AND @inserted_005 = 1
  AND quantite_restante >= 18;
SET @stock_upd_005 := IF(@inserted_005 = 0 OR ROW_COUNT() = 1, 1, 0);

-- CMD-2026-006 — Brunch Festif (menu 15)
-- 25 pers, min 15 → remise ; Bordeaux → distance_km=0 / livraison=0 ; Terminée
SET @before_006 := (SELECT COUNT(*) FROM commande WHERE numero_commande = 'CMD-2026-006');
INSERT INTO commande (
  numero_commande, date_commande, date_prestation, heure_livraison,
  adresse_livraison, distance_km, informations_complementaires,
  prix_menu, nombre_personne, prix_livraison, statut,
  pret_materiel, restitution_materiel, utilisateur_id, menu_id,
  mode_contact_annulation, motif_annulation, date_annulation
)
SELECT
  'CMD-2026-006', '2026-09-12', '2026-10-05', '11:00',
  '1 place de la Bourse, 33000 Bordeaux', 0.00, 'Démonstration — brunch festif',
  697.50, 25, 0.00, 'Terminée',
  1, 1, 3, 15,
  NULL, NULL, NULL
FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM commande WHERE numero_commande = 'CMD-2026-006'
);
SET @inserted_006 := (
  SELECT COUNT(*) FROM commande WHERE numero_commande = 'CMD-2026-006'
) - @before_006;

UPDATE menu
SET quantite_restante = quantite_restante - 25
WHERE menu_id = 15
  AND @inserted_006 = 1
  AND quantite_restante >= 25;
SET @stock_upd_006 := IF(@inserted_006 = 0 OR ROW_COUNT() = 1, 1, 0);

SET @stock_ops_ok := (
  @stock_upd_004 = 1 AND @stock_upd_005 = 1 AND @stock_upd_006 = 1
);

SET @stock_guard := IF(
  @stock_ops_ok = 1,
  'SELECT ''Stock updates OK (ou no-op si déjà présentes)'' AS statut',
  'SIGNAL SQLSTATE ''45000'' SET MESSAGE_TEXT = ''REFUS insert demo: echec decrement stock apres INSERT'''
);
PREPARE stmt_stock FROM @stock_guard;
EXECUTE stmt_stock;
DEALLOCATE PREPARE stmt_stock;

-- ---------------------------------------------------------------------------
-- 2) Postconditions
-- ---------------------------------------------------------------------------
SET @total := (SELECT COUNT(*) FROM commande);
SET @demo_ok := (
  SELECT COUNT(*) FROM commande c
  WHERE
    (c.numero_commande = 'CMD-2026-004' AND c.menu_id = 4 AND c.statut = 'Acceptée'
      AND c.utilisateur_id = 3 AND c.nombre_personne = 20 AND c.prix_menu = 684
      AND c.prix_livraison = 0 AND c.distance_km = 0)
    OR (c.numero_commande = 'CMD-2026-005' AND c.menu_id = 8 AND c.statut = 'En préparation'
      AND c.utilisateur_id = 3 AND c.nombre_personne = 18 AND c.prix_menu = 631.8
      AND c.prix_livraison = 0 AND c.distance_km = 0)
    OR (c.numero_commande = 'CMD-2026-006' AND c.menu_id = 15 AND c.statut = 'Terminée'
      AND c.utilisateur_id = 3 AND c.nombre_personne = 25 AND c.prix_menu = 697.5
      AND c.prix_livraison = 0 AND c.distance_km = 0
      AND c.pret_materiel = 1 AND c.restitution_materiel = 1)
);

SET @hist_after := (
  SELECT COUNT(*) FROM commande c
  WHERE
    (c.numero_commande = 'CMD-2026-001' AND c.menu_id = 1 AND c.statut = 'Terminée'
      AND c.utilisateur_id = 3 AND c.nombre_personne = 25 AND c.prix_menu = 787)
    OR (c.numero_commande = 'CMD-2026-002' AND c.menu_id = 2 AND c.statut = 'En préparation'
      AND c.utilisateur_id = 3 AND c.nombre_personne = 15 AND c.prix_menu = 480)
    OR (c.numero_commande = 'CMD-2026-003' AND c.menu_id = 3 AND c.statut = 'Annulée'
      AND c.utilisateur_id = 3 AND c.nombre_personne = 30 AND c.prix_menu = 1350)
);

SET @post_ok := (@total = 6 AND @demo_ok = 3 AND @hist_after = 3);

SELECT 'Rapport insert demo' AS section;
SELECT @inserted_004 AS inserted_004,
       @inserted_005 AS inserted_005,
       @inserted_006 AS inserted_006,
       @total AS commandes_totales,
       @demo_ok AS demo_ok,
       @hist_after AS historiques_ok,
       @post_ok AS postconditions_ok;

SET @end_sql := IF(
  @post_ok = 1,
  'COMMIT',
  'ROLLBACK'
);
PREPARE stmt_end FROM @end_sql;
EXECUTE stmt_end;
DEALLOCATE PREPARE stmt_end;

SET @msg_sql := IF(
  @post_ok = 1,
  'SELECT ''Postconditions OK (6 commandes) — COMMIT effectue. Enchainer: cd backend && npm run stats:resync'' AS statut',
  'SIGNAL SQLSTATE ''45000'' SET MESSAGE_TEXT = ''REFUS: postconditions non satisfaites — ROLLBACK effectue'''
);
PREPARE stmt_msg FROM @msg_sql;
EXECUTE stmt_msg;
DEALLOCATE PREPARE stmt_msg;
