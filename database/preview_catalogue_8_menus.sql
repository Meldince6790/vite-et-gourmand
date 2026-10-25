-- =============================================================================
-- PRÉVISUALISATION (lecture seule) — catalogue cible 8 menus
-- =============================================================================
-- À exécuter dans DBeaver sur la base locale / préprod AVANT toute migration.
-- Aucun INSERT / UPDATE / DELETE.
-- =============================================================================

-- A) Huit menus à conserver
SELECT m.menu_id, m.titre, r.libelle AS regime, t.libelle AS theme,
       m.prix_par_personne, m.quantite_restante
FROM menu m
JOIN regime r ON r.regime_id = m.regime_id
JOIN theme t ON t.theme_id = m.theme_id
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
ORDER BY m.titre;

-- B) Sept menus ciblés pour retrait
SELECT m.menu_id, m.titre, r.libelle AS regime, t.libelle AS theme
FROM menu m
JOIN regime r ON r.regime_id = m.regime_id
JOIN theme t ON t.theme_id = m.theme_id
WHERE m.titre IN (
  'Menu Printemps Vert',
  'Menu Automne Champêtre',
  'Menu Réunion Express',
  'Menu Séminaire Premium',
  'Menu Mariage Traditionnel',
  'Menu Fête Végétarienne',
  'Menu Végan Bureau'
)
ORDER BY m.titre;

-- C) Commandes référencant les menus à retirer (doit être 0 pour autoriser la migration)
SELECT c.commande_id, c.numero_commande, c.statut, m.menu_id, m.titre
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
ORDER BY c.commande_id;

-- D) Commandes historiques (aperçu global — à préserver)
SELECT commande_id, numero_commande, statut, menu_id
FROM commande
ORDER BY commande_id;

-- E) Associations menu_plat des menus à retirer
SELECT m.titre AS menu, p.plat_id, p.titre_plat
FROM menu_plat mp
JOIN menu m ON m.menu_id = mp.menu_id
JOIN plat p ON p.plat_id = mp.plat_id
WHERE m.titre IN (
  'Menu Printemps Vert',
  'Menu Automne Champêtre',
  'Menu Réunion Express',
  'Menu Séminaire Premium',
  'Menu Mariage Traditionnel',
  'Menu Fête Végétarienne',
  'Menu Végan Bureau'
)
ORDER BY m.titre, p.titre_plat;

-- F) Plats qui deviendraient orphelins si les 7 menus étaient retirés
--    (plus aucun lien menu_plat hors menus à retirer)
SELECT p.plat_id, p.titre_plat
FROM plat p
WHERE NOT EXISTS (
  SELECT 1
  FROM menu_plat mp
  JOIN menu m ON m.menu_id = mp.menu_id
  WHERE mp.plat_id = p.plat_id
    AND m.titre NOT IN (
      'Menu Printemps Vert',
      'Menu Automne Champêtre',
      'Menu Réunion Express',
      'Menu Séminaire Premium',
      'Menu Mariage Traditionnel',
      'Menu Fête Végétarienne',
      'Menu Végan Bureau'
    )
)
ORDER BY p.titre_plat;

-- G) Composition actuelle des 8 menus conservés
SELECT m.titre AS menu, p.titre_plat
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
ORDER BY m.titre, p.titre_plat;

-- H) Effectifs actuels vs cibles
SELECT 'menus_actuels' AS indicateur, COUNT(*) AS valeur FROM menu
UNION ALL
SELECT 'plats_actuels', COUNT(*) FROM plat
UNION ALL
SELECT 'menus_cibles_presents', COUNT(*) FROM menu
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
UNION ALL
SELECT 'menus_a_retirer_presents', COUNT(*) FROM menu
WHERE titre IN (
  'Menu Printemps Vert',
  'Menu Automne Champêtre',
  'Menu Réunion Express',
  'Menu Séminaire Premium',
  'Menu Mariage Traditionnel',
  'Menu Fête Végétarienne',
  'Menu Végan Bureau'
);

-- Cible après migration + enrich éventuel : 8 menus, 24 plats.
