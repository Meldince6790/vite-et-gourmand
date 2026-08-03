-- Mise à jour ciblée : différencier le Menu Mariage Végan (menu_id = 3)
-- À exécuter manuellement sur une base Docker déjà initialisée.
-- Ne pas exécuter automatiquement.

-- 1. Renommer les plats orphelins en plats végans (IDs conservés)
UPDATE plat
SET titre_plat = 'Tartare de légumes méditerranéens'
WHERE plat_id = 3;

UPDATE plat
SET titre_plat = 'Curry de légumes au lait de coco'
WHERE plat_id = 5;

UPDATE plat
SET titre_plat = 'Mousse au chocolat végétale'
WHERE plat_id = 8;

-- Cohérence allergènes : retirer le lactose (produit animal) du dessert végan
DELETE FROM plat_allergene
WHERE plat_id = 8
  AND allergene_id = 2;

-- 2. Retirer les anciennes associations du menu 3 (anciennement plats 2, 6, 9)
DELETE FROM menu_plat
WHERE menu_id = 3
  AND plat_id IN (2, 6, 9);

-- 3. Associer les plats végans au menu 3 (sans doublon)
INSERT INTO menu_plat (menu_id, plat_id)
SELECT 3, 3
WHERE NOT EXISTS (
  SELECT 1 FROM menu_plat WHERE menu_id = 3 AND plat_id = 3
);

INSERT INTO menu_plat (menu_id, plat_id)
SELECT 3, 5
WHERE NOT EXISTS (
  SELECT 1 FROM menu_plat WHERE menu_id = 3 AND plat_id = 5
);

INSERT INTO menu_plat (menu_id, plat_id)
SELECT 3, 8
WHERE NOT EXISTS (
  SELECT 1 FROM menu_plat WHERE menu_id = 3 AND plat_id = 8
);
