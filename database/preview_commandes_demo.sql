-- =============================================================================
-- PREVIEW (lecture seule) — 3 commandes de démonstration (004 / 005 / 006)
-- =============================================================================
-- Aucune écriture. À exécuter avant insert_commandes_demo.sql.
-- Ne pas afficher d'e-mail / téléphone / adresse personnelle client.
-- =============================================================================

SET NAMES utf8mb4;

SELECT '=== A. Commandes actuelles ===' AS section;
SELECT
  c.commande_id,
  c.numero_commande,
  c.statut,
  c.menu_id,
  m.titre AS menu,
  c.utilisateur_id,
  c.nombre_personne,
  c.prix_menu,
  c.prix_livraison,
  c.distance_km,
  c.date_commande,
  c.date_prestation
FROM commande c
INNER JOIN menu m ON m.menu_id = c.menu_id
ORDER BY c.commande_id;

SELECT '=== B. Commandes historiques (doivent rester intactes) ===' AS section;
SELECT
  c.numero_commande,
  c.statut,
  c.menu_id,
  m.titre,
  CASE
    WHEN c.numero_commande = 'CMD-2026-001'
         AND c.menu_id = 1 AND c.statut = 'Terminée' THEN 'OK'
    WHEN c.numero_commande = 'CMD-2026-002'
         AND c.menu_id = 2 AND c.statut = 'En préparation' THEN 'OK'
    WHEN c.numero_commande = 'CMD-2026-003'
         AND c.menu_id = 3 AND c.statut = 'Annulée' THEN 'OK'
    ELSE 'ECART'
  END AS controle
FROM commande c
INNER JOIN menu m ON m.menu_id = c.menu_id
WHERE c.numero_commande IN ('CMD-2026-001', 'CMD-2026-002', 'CMD-2026-003')
ORDER BY c.numero_commande;

SELECT '=== C. Clients réutilisables (role client, actifs — sans PII) ===' AS section;
SELECT
  utilisateur_id,
  role_id,
  actif,
  ville,
  pays
FROM utilisateur
WHERE role_id = 1 AND actif = 1
ORDER BY utilisateur_id;

SELECT '=== D. Menus cibles 4 / 8 / 15 ===' AS section;
SELECT
  menu_id,
  titre,
  prix_par_personne,
  nombre_personne_minimum,
  quantite_restante
FROM menu
WHERE menu_id IN (4, 8, 15)
ORDER BY menu_id;

SELECT '=== E. Disponibilité des références cibles ===' AS section;
SELECT
  ref.numero_commande,
  CASE WHEN c.commande_id IS NULL THEN 'disponible' ELSE 'deja presente' END AS disponibilite
FROM (
  SELECT 'CMD-2026-004' AS numero_commande
  UNION ALL SELECT 'CMD-2026-005'
  UNION ALL SELECT 'CMD-2026-006'
) ref
LEFT JOIN commande c ON c.numero_commande = ref.numero_commande
ORDER BY ref.numero_commande;

SELECT '=== F. Proposition (valeurs prévues — non insérées) ===' AS section;
SELECT * FROM (
  SELECT
    'CMD-2026-004' AS numero_commande,
    4 AS menu_id,
    'Menu Cocktail Dinatoire' AS menu,
    3 AS utilisateur_id,
    20 AS nombre_personne,
    684.00 AS prix_menu,
    0.00 AS prix_livraison,
    0.00 AS distance_km,
    'Acceptée' AS statut,
    '2026-09-02' AS date_commande,
    '2026-09-20' AS date_prestation,
    '12:30' AS heure_livraison,
    '12 rue Sainte-Catherine, 33000 Bordeaux' AS adresse_demo,
    'Remise -10% ; Bordeaux → km/livraison retenus à 0' AS note_calcul
  UNION ALL
  SELECT
    'CMD-2026-005',
    8,
    'Menu Estival Méditerranéen',
    3,
    18,
    631.80,
    0.00,
    0.00,
    'En préparation',
    '2026-09-08',
    '2026-09-28',
    '19:00',
    '45 cours de l''Intendance, 33000 Bordeaux',
    'Remise -10% ; Bordeaux → km/livraison retenus à 0'
  UNION ALL
  SELECT
    'CMD-2026-006',
    15,
    'Menu Brunch Festif',
    3,
    25,
    697.50,
    0.00,
    0.00,
    'Terminée',
    '2026-09-12',
    '2026-10-05',
    '11:00',
    '1 place de la Bourse, 33000 Bordeaux',
    'Remise -10% ; pret/restitution=1 ; Bordeaux → 0'
) proposal
ORDER BY numero_commande;

SELECT '=== G. Stocks menus après insertion (si stocks actuels inchangés) ===' AS section;
SELECT
  m.menu_id,
  m.titre,
  m.quantite_restante AS stock_actuel,
  CASE m.menu_id
    WHEN 4 THEN m.quantite_restante - 20
    WHEN 8 THEN m.quantite_restante - 18
    WHEN 15 THEN m.quantite_restante - 25
  END AS stock_attendu_apres,
  CASE m.menu_id
    WHEN 4 THEN 20
    WHEN 8 THEN 18
    WHEN 15 THEN 25
  END AS decrement
FROM menu m
WHERE m.menu_id IN (4, 8, 15)
ORDER BY m.menu_id;

SELECT '=== H. Comptages attendus ===' AS section;
SELECT
  (SELECT COUNT(*) FROM commande) AS commandes_actuelles,
  (SELECT COUNT(*) FROM commande) + (
    SELECT COUNT(*) FROM (
      SELECT 'CMD-2026-004' AS n
      UNION ALL SELECT 'CMD-2026-005'
      UNION ALL SELECT 'CMD-2026-006'
    ) x
    WHERE NOT EXISTS (
      SELECT 1 FROM commande c WHERE c.numero_commande = x.n
    )
  ) AS commandes_apres_si_insert,
  6 AS cible_totale,
  (SELECT COUNT(*) FROM commande WHERE statut <> 'Annulée') AS actives_maria_actuelles,
  (SELECT COUNT(*) FROM commande WHERE statut <> 'Annulée') + (
    SELECT COUNT(*) FROM (
      SELECT 'CMD-2026-004' AS n UNION ALL SELECT 'CMD-2026-005' UNION ALL SELECT 'CMD-2026-006'
    ) x
    WHERE NOT EXISTS (SELECT 1 FROM commande c WHERE c.numero_commande = x.n)
  ) AS actives_apres_si_insert,
  'Mongo = commandes statut <> Annulée via npm run stats:resync' AS note_mongo;

SELECT '=== I. Préconditions synthétiques ===' AS section;
SELECT
  (SELECT COUNT(*) FROM menu WHERE menu_id IN (4, 8, 15)) = 3 AS menus_cibles_ok,
  (SELECT COUNT(*) FROM utilisateur WHERE utilisateur_id = 3 AND role_id = 1 AND actif = 1) = 1 AS client_ok,
  (SELECT COUNT(*) FROM commande WHERE numero_commande IN (
    'CMD-2026-001', 'CMD-2026-002', 'CMD-2026-003'
  )) = 3 AS historiques_presentes,
  (SELECT COUNT(*) FROM commande WHERE numero_commande IN (
    'CMD-2026-004', 'CMD-2026-005', 'CMD-2026-006'
  )) = 0 AS refs_libres,
  (SELECT quantite_restante FROM menu WHERE menu_id = 4) >= 20 AS stock_4_ok,
  (SELECT quantite_restante FROM menu WHERE menu_id = 8) >= 18 AS stock_8_ok,
  (SELECT quantite_restante FROM menu WHERE menu_id = 15) >= 25 AS stock_15_ok;
