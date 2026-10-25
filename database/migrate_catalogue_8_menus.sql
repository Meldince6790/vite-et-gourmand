-- =============================================================================
-- MIGRATION — Réduction du catalogue à 8 menus (base déjà peuplée)
-- =============================================================================
-- À exécuter UNIQUEMENT après validation manuelle (DBeaver / revue).
-- NE PAS monter dans docker-entrypoint-initdb.d.
-- NE PAS exécuter automatiquement via apply-enrich-catalogue.sh.
--
-- Effets (si préconditions OK) :
--   1. Refuse si une commande référence un menu à retirer (FK commande.menu_id).
--   2. Supprime menu_plat puis menu pour les 7 titres retirés.
--   3. Supprime les plats devenus orphelins (plus aucune menu_plat) parmi une
--      liste blanche explicite — ne touche pas aux plats encore utilisés.
--
-- Ne modifie PAS : utilisateur, commande, avis, horaire, MongoDB.
-- Identifie les menus / plats par TITRE (pas par menu_id numérique).
-- =============================================================================

SET NAMES utf8mb4;

-- Prévisualisation recommandée avant exécution :
--   database/preview_catalogue_8_menus.sql

START TRANSACTION;

-- ---------------------------------------------------------------------------
-- 0) Garde-fou : commandes liées aux menus à retirer
-- ---------------------------------------------------------------------------
SET @cmd_bloquees := (
  SELECT COUNT(*)
  FROM commande c
  INNER JOIN menu m ON m.menu_id = c.menu_id
  WHERE m.titre IN (
    'Menu Printemps Vert',
    'Menu Automne Champêtre',
    'Menu Réunion Express',
    'Menu Séminaire Premium',
    'Menu Mariage Traditionnel',
    'Menu Fête Végétarienne',
    'Menu Végan Bureau'
  )
);

-- Refuse si des commandes historiques pointent vers un menu à retirer (FK).
-- SIGNAL SQLSTATE 45000 annule la transaction en cours.
SET @guard_sql := IF(
  @cmd_bloquees > 0,
  'SIGNAL SQLSTATE ''45000'' SET MESSAGE_TEXT = ''REFUS migration 8 menus: des commandes referent encore un menu a retirer''',
  'SELECT ''Precondition commandes OK'' AS statut'
);
PREPARE stmt_guard FROM @guard_sql;
EXECUTE stmt_guard;
DEALLOCATE PREPARE stmt_guard;

-- ---------------------------------------------------------------------------
-- 1) Associations menu_plat des menus retirés
-- ---------------------------------------------------------------------------
DELETE mp FROM menu_plat mp
INNER JOIN menu m ON m.menu_id = mp.menu_id
WHERE m.titre IN (
  'Menu Printemps Vert',
  'Menu Automne Champêtre',
  'Menu Réunion Express',
  'Menu Séminaire Premium',
  'Menu Mariage Traditionnel',
  'Menu Fête Végétarienne',
  'Menu Végan Bureau'
);

-- ---------------------------------------------------------------------------
-- 2) Menus retirés (par titre)
-- ---------------------------------------------------------------------------
DELETE FROM menu
WHERE titre IN (
  'Menu Printemps Vert',
  'Menu Automne Champêtre',
  'Menu Réunion Express',
  'Menu Séminaire Premium',
  'Menu Mariage Traditionnel',
  'Menu Fête Végétarienne',
  'Menu Végan Bureau'
);

-- ---------------------------------------------------------------------------
-- 3) Plats orphelins (liste blanche) — uniquement s'ils n'ont plus de menu_plat
-- ---------------------------------------------------------------------------
-- Anciens orphelins déjà hors catalogue + plats exclusifs aux 7 menus retirés.
DELETE pa FROM plat_allergene pa
INNER JOIN plat p ON p.plat_id = pa.plat_id
WHERE p.titre_plat IN (
  'Tarte fine tomate basilic',
  'Brochettes de légumes grillés',
  'Velouté de potimarron',
  'Pavé de cabillaud herbes',
  'Magret de canard sauce miel',
  'Assortiment de fromages affinés',
  'Panna cotta vanille fruits',
  'Carpaccio de betterave noix',
  'Lasagnes végétariennes',
  'Buddha bowl quinoa légumes',
  'Falafels sauce tahini',
  'Tiramisu végan café',
  'Salade César revisitée'
)
AND NOT EXISTS (
  SELECT 1 FROM menu_plat mp WHERE mp.plat_id = p.plat_id
);

DELETE FROM plat
WHERE titre_plat IN (
  'Tarte fine tomate basilic',
  'Brochettes de légumes grillés',
  'Velouté de potimarron',
  'Pavé de cabillaud herbes',
  'Magret de canard sauce miel',
  'Assortiment de fromages affinés',
  'Panna cotta vanille fruits',
  'Carpaccio de betterave noix',
  'Lasagnes végétariennes',
  'Buddha bowl quinoa légumes',
  'Falafels sauce tahini',
  'Tiramisu végan café',
  'Salade César revisitée'
)
AND NOT EXISTS (
  SELECT 1 FROM menu_plat mp WHERE mp.plat_id = plat.plat_id
);

-- ---------------------------------------------------------------------------
-- 4) Contrôles post-migration — refus + ROLLBACK implicite si écart
-- ---------------------------------------------------------------------------
SET @menus_total := (SELECT COUNT(*) FROM menu);
SET @plats_total := (SELECT COUNT(*) FROM plat);
SET @cmds_total := (SELECT COUNT(*) FROM commande);
SET @menus_cibles := (
  SELECT COUNT(*) FROM menu
  WHERE titre IN (
    'Menu Entreprise Classique',
    'Menu Végétarien Gourmand',
    'Menu Mariage Végan',
    'Menu Cocktail Dinatoire',
    'Menu Buffet Traditionnel',
    'Menu Gastronomique Signature',
    'Menu Estival Méditerranéen',
    'Menu Brunch Festif'
  )
);
SET @cmds_historiques := (
  SELECT COUNT(*) FROM commande c
  INNER JOIN menu m ON m.menu_id = c.menu_id
  WHERE c.numero_commande IN ('CMD-2026-001', 'CMD-2026-002', 'CMD-2026-003')
    AND m.titre IN (
      'Menu Entreprise Classique',
      'Menu Végétarien Gourmand',
      'Menu Mariage Végan'
    )
);

SELECT 'menus_apres' AS indicateur, @menus_total AS valeur
UNION ALL SELECT 'plats_apres', @plats_total
UNION ALL SELECT 'commandes_totales', @cmds_total
UNION ALL SELECT 'menus_cibles_restants', @menus_cibles
UNION ALL SELECT 'commandes_historiques_ok', @cmds_historiques;

-- Attendu sur cette base locale déjà enrichie : 8 menus, 24 plats, 3 commandes.
SET @post_ok := (
  @menus_total = 8
  AND @plats_total = 24
  AND @cmds_total = 3
  AND @menus_cibles = 8
  AND @cmds_historiques = 3
);

-- COMMIT uniquement si postconditions OK ; sinon ROLLBACK explicite puis SIGNAL
-- (aucun COMMIT n'est possible sur le chemin d'échec).
SET @end_sql := IF(@post_ok, 'COMMIT', 'ROLLBACK');
PREPARE stmt_end FROM @end_sql;
EXECUTE stmt_end;
DEALLOCATE PREPARE stmt_end;

SET @post_sql := IF(
  @post_ok,
  'SELECT ''Postconditions OK (8 menus / 24 plats / 3 commandes) — COMMIT effectue'' AS statut',
  'SIGNAL SQLSTATE ''45000'' SET MESSAGE_TEXT = ''REFUS: postconditions 8/24 ou commandes historiques non satisfaites — ROLLBACK effectue'''
);
PREPARE stmt_post FROM @post_sql;
EXECUTE stmt_post;
DEALLOCATE PREPARE stmt_post;
