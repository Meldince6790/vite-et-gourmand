-- =============================================================================
-- PRÉVISUALISATION (lecture seule) — passage 24 → 19 plats (scénario C)
-- =============================================================================
-- Exécuter dans DBeaver AVANT migrate_catalogue_19_plats.sql.
-- Aucun INSERT / UPDATE / DELETE.
-- =============================================================================

-- A) Effectifs actuels
SELECT 'menus' AS indicateur, COUNT(*) AS valeur FROM menu
UNION ALL SELECT 'plats', COUNT(*) FROM plat
UNION ALL SELECT 'menu_plat', COUNT(*) FROM menu_plat
UNION ALL SELECT 'commandes', COUNT(*) FROM commande
UNION ALL SELECT 'plats_orphelins', (
  SELECT COUNT(*) FROM plat p
  WHERE NOT EXISTS (SELECT 1 FROM menu_plat mp WHERE mp.plat_id = p.plat_id)
);

-- B) Commandes historiques (doivent rester intactes)
SELECT c.commande_id, c.numero_commande, c.statut, c.menu_id, m.titre
FROM commande c
JOIN menu m ON m.menu_id = c.menu_id
ORDER BY c.commande_id;

-- C) Compositions actuelles des 8 menus
SELECT m.menu_id, m.titre, p.plat_id, p.titre_plat
FROM menu m
JOIN menu_plat mp ON mp.menu_id = m.menu_id
JOIN plat p ON p.plat_id = mp.plat_id
WHERE m.titre IN (
  'Menu Entreprise Classique',
  'Menu Végétarien Gourmand',
  'Menu Mariage Végan',
  'Menu Cocktail Dinatoire',
  'Menu Buffet Traditionnel',
  'Menu Gastronomique Signature',
  'Menu Estival Méditerranéen',
  'Menu Brunch Festif'
)
ORDER BY m.menu_id, p.plat_id;

-- D) Cocktail et Brunch — écart vs cible
SELECT 'Cocktail actuel' AS contexte, p.titre_plat
FROM menu m
JOIN menu_plat mp ON mp.menu_id = m.menu_id
JOIN plat p ON p.plat_id = mp.plat_id
WHERE m.titre = 'Menu Cocktail Dinatoire'
ORDER BY p.titre_plat;

SELECT 'Brunch actuel' AS contexte, p.titre_plat
FROM menu m
JOIN menu_plat mp ON mp.menu_id = m.menu_id
JOIN plat p ON p.plat_id = mp.plat_id
WHERE m.titre = 'Menu Brunch Festif'
ORDER BY p.titre_plat;

-- E) Cinq plats ciblés pour retrait — dépendances
SELECT p.plat_id, p.titre_plat,
       (SELECT COUNT(*) FROM menu_plat mp WHERE mp.plat_id = p.plat_id) AS nb_menus,
       (SELECT COUNT(*) FROM plat_allergene pa WHERE pa.plat_id = p.plat_id) AS nb_allergenes
FROM plat p
WHERE p.titre_plat IN (
  'Suprême de volaille citron',
  'Moelleux au chocolat',
  'Œufs mimosa revisités',
  'Pancakes fruits rouges',
  'Granola maison yaourt végétal'
)
ORDER BY p.titre_plat;

-- F) Menus qui référencent encore ces cinq plats
SELECT m.titre AS menu, p.titre_plat
FROM menu_plat mp
JOIN menu m ON m.menu_id = mp.menu_id
JOIN plat p ON p.plat_id = mp.plat_id
WHERE p.titre_plat IN (
  'Suprême de volaille citron',
  'Moelleux au chocolat',
  'Œufs mimosa revisités',
  'Pancakes fruits rouges',
  'Granola maison yaourt végétal'
)
ORDER BY m.titre, p.titre_plat;

-- G) Cible attendue après migration : 8 / 19 / 26
SELECT 8 AS menus_cibles, 19 AS plats_cibles, 26 AS liens_cibles;
