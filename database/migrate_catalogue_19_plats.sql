-- =============================================================================
-- MIGRATION — Catalogue 8 menus / 19 plats (scénario C mutualisé)
-- =============================================================================
-- Base attendue avant : 8 menus / 24 plats (post migrate_catalogue_8_menus).
-- NE PAS monter dans docker-entrypoint-initdb.d.
-- NE PAS exécuter sans prévisualisation (preview_catalogue_19_plats.sql)
-- ni sauvegarde récente.
--
-- Effets si préconditions OK :
--   - Menu Cocktail : retire suprême + moelleux ; ajoute poulet + Paris-Brest
--   - Menu Brunch   : retire mimosa + pancakes + granola ;
--                     ajoute quiche + tartare + clafoutis (fruits déjà lié)
--   - Supprime les 5 plats orphelins ciblés
--   - Ne touche PAS aux commandes / utilisateurs / avis / horaires / MongoDB
--
-- Identification par TITRE (pas par IDs numériques fragiles).
-- COMMIT uniquement si postconditions 8/19/26 + commandes historiques OK.
-- =============================================================================

SET NAMES utf8mb4;
START TRANSACTION;

-- ---------------------------------------------------------------------------
-- 0) Garde-fou commandes historiques
-- ---------------------------------------------------------------------------
SET @cmds_ok := (
  SELECT COUNT(*) FROM commande c
  INNER JOIN menu m ON m.menu_id = c.menu_id
  WHERE c.numero_commande IN ('CMD-2026-001', 'CMD-2026-002', 'CMD-2026-003')
    AND (
      (c.numero_commande = 'CMD-2026-001' AND m.titre = 'Menu Entreprise Classique' AND c.statut = 'Terminée')
      OR (c.numero_commande = 'CMD-2026-002' AND m.titre = 'Menu Végétarien Gourmand' AND c.statut = 'En préparation')
      OR (c.numero_commande = 'CMD-2026-003' AND m.titre = 'Menu Mariage Végan' AND c.statut = 'Annulée')
    )
);

SET @menus8 := (
  SELECT COUNT(*) FROM menu
  WHERE titre IN (
    'Menu Entreprise Classique', 'Menu Végétarien Gourmand', 'Menu Mariage Végan',
    'Menu Cocktail Dinatoire', 'Menu Buffet Traditionnel', 'Menu Gastronomique Signature',
    'Menu Estival Méditerranéen', 'Menu Brunch Festif'
  )
);

SET @guard_sql := IF(
  @cmds_ok = 3 AND @menus8 = 8,
  'SELECT ''Precondition commandes + 8 menus OK'' AS statut',
  'SIGNAL SQLSTATE ''45000'' SET MESSAGE_TEXT = ''REFUS migration 19 plats: commandes historiques ou menus cibles absents'''
);
PREPARE stmt_guard FROM @guard_sql;
EXECUTE stmt_guard;
DEALLOCATE PREPARE stmt_guard;

SET @m_cocktail := (SELECT menu_id FROM menu WHERE titre = 'Menu Cocktail Dinatoire' LIMIT 1);
SET @m_brunch := (SELECT menu_id FROM menu WHERE titre = 'Menu Brunch Festif' LIMIT 1);

SET @p_poulet := (SELECT plat_id FROM plat WHERE titre_plat = 'Filet de poulet sauce forestière' LIMIT 1);
SET @p_paris := (SELECT plat_id FROM plat WHERE titre_plat = 'Paris-Brest praliné' LIMIT 1);
SET @p_quiche := (SELECT plat_id FROM plat WHERE titre_plat = 'Quiche aux légumes du jardin' LIMIT 1);
SET @p_tartare := (SELECT plat_id FROM plat WHERE titre_plat = 'Tartare de légumes méditerranéens' LIMIT 1);
SET @p_clafoutis := (SELECT plat_id FROM plat WHERE titre_plat = 'Clafoutis aux cerises' LIMIT 1);
SET @p_fruits := (SELECT plat_id FROM plat WHERE titre_plat = 'Salade de fruits frais' LIMIT 1);
SET @p_saumon := (SELECT plat_id FROM plat WHERE titre_plat = 'Mini bouchées saumon aneth' LIMIT 1);

SET @p_supreme := (SELECT plat_id FROM plat WHERE titre_plat = 'Suprême de volaille citron' LIMIT 1);
SET @p_moelleux := (SELECT plat_id FROM plat WHERE titre_plat = 'Moelleux au chocolat' LIMIT 1);
SET @p_mimosa := (SELECT plat_id FROM plat WHERE titre_plat = 'Œufs mimosa revisités' LIMIT 1);
SET @p_pancakes := (SELECT plat_id FROM plat WHERE titre_plat = 'Pancakes fruits rouges' LIMIT 1);
SET @p_granola := (SELECT plat_id FROM plat WHERE titre_plat = 'Granola maison yaourt végétal' LIMIT 1);

SET @refs_sql := IF(
  @m_cocktail IS NOT NULL AND @m_brunch IS NOT NULL
  AND @p_poulet IS NOT NULL AND @p_paris IS NOT NULL AND @p_quiche IS NOT NULL
  AND @p_tartare IS NOT NULL AND @p_clafoutis IS NOT NULL AND @p_fruits IS NOT NULL
  AND @p_saumon IS NOT NULL,
  'SELECT ''References plats/menus OK'' AS statut',
  'SIGNAL SQLSTATE ''45000'' SET MESSAGE_TEXT = ''REFUS migration 19 plats: plat ou menu requis manquant'''
);
PREPARE stmt_refs FROM @refs_sql;
EXECUTE stmt_refs;
DEALLOCATE PREPARE stmt_refs;

-- ---------------------------------------------------------------------------
-- 1) Cocktail Dinatoire — composition cible
-- ---------------------------------------------------------------------------
DELETE FROM menu_plat
WHERE menu_id = @m_cocktail
  AND plat_id IN (@p_supreme, @p_moelleux);

INSERT INTO menu_plat (menu_id, plat_id)
SELECT @m_cocktail, @p_poulet FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM menu_plat WHERE menu_id = @m_cocktail AND plat_id = @p_poulet
);

INSERT INTO menu_plat (menu_id, plat_id)
SELECT @m_cocktail, @p_paris FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM menu_plat WHERE menu_id = @m_cocktail AND plat_id = @p_paris
);

-- Garantir saumon + quiche (déjà présents normalement)
INSERT INTO menu_plat (menu_id, plat_id)
SELECT @m_cocktail, @p_saumon FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM menu_plat WHERE menu_id = @m_cocktail AND plat_id = @p_saumon
);

INSERT INTO menu_plat (menu_id, plat_id)
SELECT @m_cocktail, @p_quiche FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM menu_plat WHERE menu_id = @m_cocktail AND plat_id = @p_quiche
);

-- ---------------------------------------------------------------------------
-- 2) Brunch Festif — composition cible (végétarien)
-- ---------------------------------------------------------------------------
DELETE FROM menu_plat
WHERE menu_id = @m_brunch
  AND plat_id IN (@p_mimosa, @p_pancakes, @p_granola);

INSERT INTO menu_plat (menu_id, plat_id)
SELECT @m_brunch, @p_quiche FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM menu_plat WHERE menu_id = @m_brunch AND plat_id = @p_quiche
);

INSERT INTO menu_plat (menu_id, plat_id)
SELECT @m_brunch, @p_tartare FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM menu_plat WHERE menu_id = @m_brunch AND plat_id = @p_tartare
);

INSERT INTO menu_plat (menu_id, plat_id)
SELECT @m_brunch, @p_fruits FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM menu_plat WHERE menu_id = @m_brunch AND plat_id = @p_fruits
);

INSERT INTO menu_plat (menu_id, plat_id)
SELECT @m_brunch, @p_clafoutis FROM DUAL
WHERE NOT EXISTS (
  SELECT 1 FROM menu_plat WHERE menu_id = @m_brunch AND plat_id = @p_clafoutis
);

-- ---------------------------------------------------------------------------
-- 3) Suppression des 5 plats s'ils n'ont plus aucun menu_plat
-- ---------------------------------------------------------------------------
DELETE pa FROM plat_allergene pa
INNER JOIN plat p ON p.plat_id = pa.plat_id
WHERE p.titre_plat IN (
  'Suprême de volaille citron',
  'Moelleux au chocolat',
  'Œufs mimosa revisités',
  'Pancakes fruits rouges',
  'Granola maison yaourt végétal'
)
AND NOT EXISTS (SELECT 1 FROM menu_plat mp WHERE mp.plat_id = p.plat_id);

DELETE FROM plat
WHERE titre_plat IN (
  'Suprême de volaille citron',
  'Moelleux au chocolat',
  'Œufs mimosa revisités',
  'Pancakes fruits rouges',
  'Granola maison yaourt végétal'
)
AND NOT EXISTS (SELECT 1 FROM menu_plat mp WHERE mp.plat_id = plat.plat_id);

-- ---------------------------------------------------------------------------
-- 4) Postconditions
-- ---------------------------------------------------------------------------
SET @menus_total := (SELECT COUNT(*) FROM menu);
SET @plats_total := (SELECT COUNT(*) FROM plat);
SET @links_total := (SELECT COUNT(*) FROM menu_plat);
SET @orphans := (
  SELECT COUNT(*) FROM plat p
  WHERE NOT EXISTS (SELECT 1 FROM menu_plat mp WHERE mp.plat_id = p.plat_id)
);
SET @fk_bad := (
  SELECT COUNT(*) FROM menu_plat mp
  LEFT JOIN menu m ON m.menu_id = mp.menu_id
  LEFT JOIN plat p ON p.plat_id = mp.plat_id
  WHERE m.menu_id IS NULL OR p.plat_id IS NULL
);
SET @cmds_after := (
  SELECT COUNT(*) FROM commande c
  INNER JOIN menu m ON m.menu_id = c.menu_id
  WHERE c.numero_commande IN ('CMD-2026-001', 'CMD-2026-002', 'CMD-2026-003')
    AND (
      (c.numero_commande = 'CMD-2026-001' AND m.titre = 'Menu Entreprise Classique' AND c.statut = 'Terminée')
      OR (c.numero_commande = 'CMD-2026-002' AND m.titre = 'Menu Végétarien Gourmand' AND c.statut = 'En préparation')
      OR (c.numero_commande = 'CMD-2026-003' AND m.titre = 'Menu Mariage Végan' AND c.statut = 'Annulée')
    )
);

-- Compositions exactes (nombre de plats par menu cible)
SET @c1 := (SELECT COUNT(*) FROM menu_plat mp JOIN menu m ON m.menu_id = mp.menu_id WHERE m.titre = 'Menu Entreprise Classique');
SET @c2 := (SELECT COUNT(*) FROM menu_plat mp JOIN menu m ON m.menu_id = mp.menu_id WHERE m.titre = 'Menu Végétarien Gourmand');
SET @c3 := (SELECT COUNT(*) FROM menu_plat mp JOIN menu m ON m.menu_id = mp.menu_id WHERE m.titre = 'Menu Mariage Végan');
SET @c4 := (SELECT COUNT(*) FROM menu_plat mp JOIN menu m ON m.menu_id = mp.menu_id WHERE m.titre = 'Menu Cocktail Dinatoire');
SET @c5 := (SELECT COUNT(*) FROM menu_plat mp JOIN menu m ON m.menu_id = mp.menu_id WHERE m.titre = 'Menu Buffet Traditionnel');
SET @c6 := (SELECT COUNT(*) FROM menu_plat mp JOIN menu m ON m.menu_id = mp.menu_id WHERE m.titre = 'Menu Gastronomique Signature');
SET @c8 := (SELECT COUNT(*) FROM menu_plat mp JOIN menu m ON m.menu_id = mp.menu_id WHERE m.titre = 'Menu Estival Méditerranéen');
SET @c15 := (SELECT COUNT(*) FROM menu_plat mp JOIN menu m ON m.menu_id = mp.menu_id WHERE m.titre = 'Menu Brunch Festif');

-- Cocktail : 4 plats cibles présents
SET @cocktail_ok := (
  SELECT COUNT(*) FROM menu_plat mp
  JOIN menu m ON m.menu_id = mp.menu_id
  JOIN plat p ON p.plat_id = mp.plat_id
  WHERE m.titre = 'Menu Cocktail Dinatoire'
    AND p.titre_plat IN (
      'Mini bouchées saumon aneth',
      'Filet de poulet sauce forestière',
      'Quiche aux légumes du jardin',
      'Paris-Brest praliné'
    )
);

-- Brunch : 4 plats cibles, aucun interdit
SET @brunch_ok := (
  SELECT COUNT(*) FROM menu_plat mp
  JOIN menu m ON m.menu_id = mp.menu_id
  JOIN plat p ON p.plat_id = mp.plat_id
  WHERE m.titre = 'Menu Brunch Festif'
    AND p.titre_plat IN (
      'Quiche aux légumes du jardin',
      'Tartare de légumes méditerranéens',
      'Salade de fruits frais',
      'Clafoutis aux cerises'
    )
);

SET @brunch_interdit := (
  SELECT COUNT(*) FROM menu_plat mp
  JOIN menu m ON m.menu_id = mp.menu_id
  JOIN plat p ON p.plat_id = mp.plat_id
  WHERE m.titre = 'Menu Brunch Festif'
    AND p.titre_plat IN (
      'Mini bouchées saumon aneth',
      'Filet de poulet sauce forestière',
      'Filet de bœuf sauce poivre',
      'Blanquette de veau maison',
      'Paella du traiteur',
      'Salade périgourdine'
    )
);

SELECT 'menus_apres' AS indicateur, @menus_total AS valeur
UNION ALL SELECT 'plats_apres', @plats_total
UNION ALL SELECT 'liens_apres', @links_total
UNION ALL SELECT 'orphelins', @orphans
UNION ALL SELECT 'commandes_historiques_ok', @cmds_after
UNION ALL SELECT 'cocktail_plats_cibles', @cocktail_ok
UNION ALL SELECT 'brunch_plats_cibles', @brunch_ok;

SET @post_ok := (
  @menus_total = 8
  AND @plats_total = 19
  AND @links_total = 26
  AND @orphans = 0
  AND @fk_bad = 0
  AND @cmds_after = 3
  AND @c1 = 3 AND @c2 = 3 AND @c3 = 3 AND @c4 = 4
  AND @c5 = 3 AND @c6 = 3 AND @c8 = 3 AND @c15 = 4
  AND @cocktail_ok = 4
  AND @brunch_ok = 4
  AND @brunch_interdit = 0
);

SET @end_sql := IF(@post_ok, 'COMMIT', 'ROLLBACK');
PREPARE stmt_end FROM @end_sql;
EXECUTE stmt_end;
DEALLOCATE PREPARE stmt_end;

SET @post_sql := IF(
  @post_ok,
  'SELECT ''Postconditions OK (8/19/26) — COMMIT effectue'' AS statut',
  'SIGNAL SQLSTATE ''45000'' SET MESSAGE_TEXT = ''REFUS: postconditions 8/19/26 ou compositions — ROLLBACK effectue'''
);
PREPARE stmt_post FROM @post_sql;
EXECUTE stmt_post;
DEALLOCATE PREPARE stmt_post;
