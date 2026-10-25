-- =============================================================================
-- Enrichissement catalogue Vite & Gourmand (cible : 8 menus / 19 plats)
-- =============================================================================
-- Après seed (3 menus / 9 plats) → **8 menus / 19 plats / 26 menu_plat**.
--
-- Menus ajoutés (par titre) :
--   Cocktail Dinatoire, Buffet Traditionnel, Gastronomique Signature,
--   Estival Méditerranéen, Brunch Festif
--
-- Compositions (y compris seed) :
--   1 Entreprise     : Salade périgourdine ; Poulet forestière ; Tarte pommes
--   2 Végétarien     : Velouté légumes ; Risotto ; Salade fruits
--   3 Mariage Végan  : Tartare légumes ; Curry coco ; Mousse chocolat végétale
--   4 Cocktail       : Bouchées saumon ; Poulet forestière ; Quiche ; Paris-Brest
--   5 Buffet         : Soupe oignon ; Blanquette ; Tarte Tatin
--   6 Gastronomique  : Bouchées saumon ; Bœuf poivre ; Paris-Brest
--   8 Estival        : Gaspacho ; Paella ; Clafoutis cerises
--  15 Brunch         : Quiche ; Tartare ; Salade fruits ; Clafoutis
--
-- Base déjà peuplée (24 plats) : utiliser migrate_catalogue_19_plats.sql
-- (manuel, hors docker-entrypoint-initdb.d).
-- =============================================================================

SET NAMES utf8mb4;
START TRANSACTION;

INSERT INTO allergene (libelle)
SELECT 'Œufs'
WHERE NOT EXISTS (SELECT 1 FROM allergene WHERE libelle = 'Œufs');

INSERT INTO allergene (libelle)
SELECT 'Poisson'
WHERE NOT EXISTS (SELECT 1 FROM allergene WHERE libelle = 'Poisson');

SET @alg_gluten := (SELECT allergene_id FROM allergene WHERE libelle = 'Gluten' LIMIT 1);
SET @alg_lactose := (SELECT allergene_id FROM allergene WHERE libelle = 'Lactose' LIMIT 1);
SET @alg_coque := (SELECT allergene_id FROM allergene WHERE libelle = 'Fruits à coque' LIMIT 1);
SET @alg_crustace := (SELECT allergene_id FROM allergene WHERE libelle = 'Crustacés' LIMIT 1);
SET @alg_oeufs := (SELECT allergene_id FROM allergene WHERE libelle = 'Œufs' LIMIT 1);
SET @alg_poisson := (SELECT allergene_id FROM allergene WHERE libelle = 'Poisson' LIMIT 1);

SET @reg_classique := (SELECT regime_id FROM regime WHERE libelle = 'Classique' LIMIT 1);
SET @reg_vege := (SELECT regime_id FROM regime WHERE libelle = 'Végétarien' LIMIT 1);

SET @thm_mariage := (SELECT theme_id FROM theme WHERE libelle = 'Mariage' LIMIT 1);
SET @thm_entreprise := (SELECT theme_id FROM theme WHERE libelle = 'Entreprise' LIMIT 1);
SET @thm_prive := (SELECT theme_id FROM theme WHERE libelle = 'Événement privé' LIMIT 1);

-- ---------------------------------------------------------------------------
-- 10 plats enrichis (seed en apporte 9 → total 19)
-- ---------------------------------------------------------------------------
INSERT INTO plat (titre_plat, photo)
SELECT 'Mini bouchées saumon aneth', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Mini bouchées saumon aneth');

INSERT INTO plat (titre_plat, photo)
SELECT 'Quiche aux légumes du jardin', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Quiche aux légumes du jardin');

INSERT INTO plat (titre_plat, photo)
SELECT 'Paris-Brest praliné', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Paris-Brest praliné');

INSERT INTO plat (titre_plat, photo)
SELECT 'Filet de bœuf sauce poivre', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Filet de bœuf sauce poivre');

INSERT INTO plat (titre_plat, photo)
SELECT 'Gaspacho andalou', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Gaspacho andalou');

INSERT INTO plat (titre_plat, photo)
SELECT 'Paella du traiteur', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Paella du traiteur');

INSERT INTO plat (titre_plat, photo)
SELECT 'Clafoutis aux cerises', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Clafoutis aux cerises');

INSERT INTO plat (titre_plat, photo)
SELECT 'Soupe à l''oignon gratinée', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Soupe à l''oignon gratinée');

INSERT INTO plat (titre_plat, photo)
SELECT 'Blanquette de veau maison', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Blanquette de veau maison');

INSERT INTO plat (titre_plat, photo)
SELECT 'Tarte Tatin', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Tarte Tatin');

-- Refs plats (seed + enrich)
SET @p_poulet := (SELECT plat_id FROM plat WHERE titre_plat = 'Filet de poulet sauce forestière' LIMIT 1);
SET @p_tartare := (SELECT plat_id FROM plat WHERE titre_plat = 'Tartare de légumes méditerranéens' LIMIT 1);
SET @p_fruits := (SELECT plat_id FROM plat WHERE titre_plat = 'Salade de fruits frais' LIMIT 1);
SET @p_saumon := (SELECT plat_id FROM plat WHERE titre_plat = 'Mini bouchées saumon aneth' LIMIT 1);
SET @p_quiche := (SELECT plat_id FROM plat WHERE titre_plat = 'Quiche aux légumes du jardin' LIMIT 1);
SET @p_paris := (SELECT plat_id FROM plat WHERE titre_plat = 'Paris-Brest praliné' LIMIT 1);
SET @p_boeuf := (SELECT plat_id FROM plat WHERE titre_plat = 'Filet de bœuf sauce poivre' LIMIT 1);
SET @p_gaspacho := (SELECT plat_id FROM plat WHERE titre_plat = 'Gaspacho andalou' LIMIT 1);
SET @p_paella := (SELECT plat_id FROM plat WHERE titre_plat = 'Paella du traiteur' LIMIT 1);
SET @p_clafoutis := (SELECT plat_id FROM plat WHERE titre_plat = 'Clafoutis aux cerises' LIMIT 1);
SET @p_oignon := (SELECT plat_id FROM plat WHERE titre_plat = 'Soupe à l''oignon gratinée' LIMIT 1);
SET @p_blanquette := (SELECT plat_id FROM plat WHERE titre_plat = 'Blanquette de veau maison' LIMIT 1);
SET @p_tatin := (SELECT plat_id FROM plat WHERE titre_plat = 'Tarte Tatin' LIMIT 1);

-- Allergènes enrichis
INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_saumon, @alg_poisson FROM DUAL
WHERE @p_saumon IS NOT NULL AND @alg_poisson IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_saumon AND allergene_id = @alg_poisson);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_saumon, @alg_gluten FROM DUAL
WHERE @p_saumon IS NOT NULL AND @alg_gluten IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_saumon AND allergene_id = @alg_gluten);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_quiche, @alg_gluten FROM DUAL
WHERE @p_quiche IS NOT NULL AND @alg_gluten IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_quiche AND allergene_id = @alg_gluten);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_quiche, @alg_lactose FROM DUAL
WHERE @p_quiche IS NOT NULL AND @alg_lactose IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_quiche AND allergene_id = @alg_lactose);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_quiche, @alg_oeufs FROM DUAL
WHERE @p_quiche IS NOT NULL AND @alg_oeufs IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_quiche AND allergene_id = @alg_oeufs);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_paris, @alg_gluten FROM DUAL
WHERE @p_paris IS NOT NULL AND @alg_gluten IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_paris AND allergene_id = @alg_gluten);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_paris, @alg_lactose FROM DUAL
WHERE @p_paris IS NOT NULL AND @alg_lactose IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_paris AND allergene_id = @alg_lactose);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_paris, @alg_coque FROM DUAL
WHERE @p_paris IS NOT NULL AND @alg_coque IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_paris AND allergene_id = @alg_coque);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_paella, @alg_crustace FROM DUAL
WHERE @p_paella IS NOT NULL AND @alg_crustace IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_paella AND allergene_id = @alg_crustace);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_clafoutis, @alg_gluten FROM DUAL
WHERE @p_clafoutis IS NOT NULL AND @alg_gluten IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_clafoutis AND allergene_id = @alg_gluten);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_clafoutis, @alg_oeufs FROM DUAL
WHERE @p_clafoutis IS NOT NULL AND @alg_oeufs IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_clafoutis AND allergene_id = @alg_oeufs);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_clafoutis, @alg_lactose FROM DUAL
WHERE @p_clafoutis IS NOT NULL AND @alg_lactose IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_clafoutis AND allergene_id = @alg_lactose);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_oignon, @alg_gluten FROM DUAL
WHERE @p_oignon IS NOT NULL AND @alg_gluten IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_oignon AND allergene_id = @alg_gluten);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_oignon, @alg_lactose FROM DUAL
WHERE @p_oignon IS NOT NULL AND @alg_lactose IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_oignon AND allergene_id = @alg_lactose);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_blanquette, @alg_lactose FROM DUAL
WHERE @p_blanquette IS NOT NULL AND @alg_lactose IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_blanquette AND allergene_id = @alg_lactose);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_tatin, @alg_gluten FROM DUAL
WHERE @p_tatin IS NOT NULL AND @alg_gluten IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_tatin AND allergene_id = @alg_gluten);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_tatin, @alg_lactose FROM DUAL
WHERE @p_tatin IS NOT NULL AND @alg_lactose IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_tatin AND allergene_id = @alg_lactose);

-- ---------------------------------------------------------------------------
-- 5 menus enrichis
-- ---------------------------------------------------------------------------
INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Cocktail Dinatoire', 15, 38,
       'Formules finger food et pièces cocktail pour séminaires et afterworks.',
       'Commande minimum de 15 personnes. Livraison plateau comprise sur Bordeaux.',
       60, @reg_classique, @thm_entreprise
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Cocktail Dinatoire');

INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Buffet Traditionnel', 20, 36,
       'Buffet chaud et froid aux saveurs françaises pour réceptions familiales.',
       'Réservation 5 jours à l''avance. Matériel de service en option.',
       45, @reg_classique, @thm_prive
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Buffet Traditionnel');

INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Gastronomique Signature', 30, 55,
       'Menu assis raffiné pour grandes cérémonies : entrée, plat signature et dessert.',
       'Réservation minimum 21 jours. Dégustation possible sur rendez-vous.',
       20, @reg_classique, @thm_mariage
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Gastronomique Signature');

INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Estival Méditerranéen', 12, 39,
       'Saveurs du Sud : gaspacho, paella du traiteur et clafoutis aux fruits.',
       'Idéal pour jardins et terrasses. Réservation 4 jours à l''avance.',
       40, @reg_classique, @thm_prive
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Estival Méditerranéen');

INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Brunch Festif', 15, 31,
       'Brunch végétarien : quiche, tartare de légumes, fruits et clafoutis.',
       'Service le week-end uniquement. Commande 3 jours à l''avance.',
       40, @reg_vege, @thm_prive
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Brunch Festif');

-- Associations
SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Cocktail Dinatoire' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_saumon FROM DUAL WHERE @m IS NOT NULL AND @p_saumon IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_saumon);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_poulet FROM DUAL WHERE @m IS NOT NULL AND @p_poulet IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_poulet);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_quiche FROM DUAL WHERE @m IS NOT NULL AND @p_quiche IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_quiche);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_paris FROM DUAL WHERE @m IS NOT NULL AND @p_paris IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_paris);

SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Buffet Traditionnel' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_oignon FROM DUAL WHERE @m IS NOT NULL AND @p_oignon IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_oignon);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_blanquette FROM DUAL WHERE @m IS NOT NULL AND @p_blanquette IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_blanquette);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_tatin FROM DUAL WHERE @m IS NOT NULL AND @p_tatin IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_tatin);

SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Gastronomique Signature' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_saumon FROM DUAL WHERE @m IS NOT NULL AND @p_saumon IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_saumon);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_boeuf FROM DUAL WHERE @m IS NOT NULL AND @p_boeuf IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_boeuf);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_paris FROM DUAL WHERE @m IS NOT NULL AND @p_paris IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_paris);

SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Estival Méditerranéen' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_gaspacho FROM DUAL WHERE @m IS NOT NULL AND @p_gaspacho IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_gaspacho);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_paella FROM DUAL WHERE @m IS NOT NULL AND @p_paella IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_paella);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_clafoutis FROM DUAL WHERE @m IS NOT NULL AND @p_clafoutis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_clafoutis);

SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Brunch Festif' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_quiche FROM DUAL WHERE @m IS NOT NULL AND @p_quiche IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_quiche);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_tartare FROM DUAL WHERE @m IS NOT NULL AND @p_tartare IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_tartare);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_fruits FROM DUAL WHERE @m IS NOT NULL AND @p_fruits IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_fruits);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_clafoutis FROM DUAL WHERE @m IS NOT NULL AND @p_clafoutis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_clafoutis);

COMMIT;

SELECT 'menus_total' AS indicateur, COUNT(*) AS valeur FROM menu
UNION ALL SELECT 'plats_total', COUNT(*) FROM plat
UNION ALL SELECT 'liens_menu_plat', COUNT(*) FROM menu_plat;
