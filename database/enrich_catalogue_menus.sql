-- =============================================================================
-- Enrichissement catalogue Vite & Gourmand (LOCAL / DÉMO)
-- =============================================================================
-- Idempotent : réexécutable sans doublons (clé = titre / titre_plat).
-- Ne touche PAS : utilisateur, commande, avis, horaire, MongoDB.
-- Ne modifie PAS les menus / plats déjà présents (uniquement INSERT si absent).
-- =============================================================================

SET NAMES utf8mb4;
START TRANSACTION;

-- ---------------------------------------------------------------------------
-- Allergènes complémentaires (données uniquement)
-- ---------------------------------------------------------------------------
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
SET @reg_vegan := (SELECT regime_id FROM regime WHERE libelle = 'Végan' LIMIT 1);

SET @thm_mariage := (SELECT theme_id FROM theme WHERE libelle = 'Mariage' LIMIT 1);
SET @thm_entreprise := (SELECT theme_id FROM theme WHERE libelle = 'Entreprise' LIMIT 1);
SET @thm_prive := (SELECT theme_id FROM theme WHERE libelle = 'Événement privé' LIMIT 1);

-- ---------------------------------------------------------------------------
-- Helper macro-like : plats nouveaux
-- ---------------------------------------------------------------------------
INSERT INTO plat (titre_plat, photo)
SELECT 'Velouté de potimarron', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Velouté de potimarron');

INSERT INTO plat (titre_plat, photo)
SELECT 'Mini bouchées saumon aneth', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Mini bouchées saumon aneth');

INSERT INTO plat (titre_plat, photo)
SELECT 'Suprême de volaille citron', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Suprême de volaille citron');

INSERT INTO plat (titre_plat, photo)
SELECT 'Pavé de cabillaud herbes', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Pavé de cabillaud herbes');

INSERT INTO plat (titre_plat, photo)
SELECT 'Magret de canard sauce miel', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Magret de canard sauce miel');

INSERT INTO plat (titre_plat, photo)
SELECT 'Quiche aux légumes du jardin', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Quiche aux légumes du jardin');

INSERT INTO plat (titre_plat, photo)
SELECT 'Tarte fine tomate basilic', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Tarte fine tomate basilic');

INSERT INTO plat (titre_plat, photo)
SELECT 'Assortiment de fromages affinés', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Assortiment de fromages affinés');

INSERT INTO plat (titre_plat, photo)
SELECT 'Moelleux au chocolat', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Moelleux au chocolat');

INSERT INTO plat (titre_plat, photo)
SELECT 'Panna cotta vanille fruits', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Panna cotta vanille fruits');

INSERT INTO plat (titre_plat, photo)
SELECT 'Carpaccio de betterave noix', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Carpaccio de betterave noix');

INSERT INTO plat (titre_plat, photo)
SELECT 'Lasagnes végétariennes', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Lasagnes végétariennes');

INSERT INTO plat (titre_plat, photo)
SELECT 'Buddha bowl quinoa légumes', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Buddha bowl quinoa légumes');

INSERT INTO plat (titre_plat, photo)
SELECT 'Falafels sauce tahini', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Falafels sauce tahini');

INSERT INTO plat (titre_plat, photo)
SELECT 'Tiramisu végan café', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Tiramisu végan café');

INSERT INTO plat (titre_plat, photo)
SELECT 'Brochettes de légumes grillés', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Brochettes de légumes grillés');

INSERT INTO plat (titre_plat, photo)
SELECT 'Salade César revisitée', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Salade César revisitée');

INSERT INTO plat (titre_plat, photo)
SELECT 'Filet de bœuf sauce poivre', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Filet de bœuf sauce poivre');

INSERT INTO plat (titre_plat, photo)
SELECT 'Paris-Brest praliné', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Paris-Brest praliné');

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

INSERT INTO plat (titre_plat, photo)
SELECT 'Œufs mimosa revisités', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Œufs mimosa revisités');

INSERT INTO plat (titre_plat, photo)
SELECT 'Pancakes fruits rouges', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Pancakes fruits rouges');

INSERT INTO plat (titre_plat, photo)
SELECT 'Granola maison yaourt végétal', NULL
WHERE NOT EXISTS (SELECT 1 FROM plat WHERE titre_plat = 'Granola maison yaourt végétal');

-- IDs plats (existants + nouveaux)
SET @p_salade_perig := (SELECT plat_id FROM plat WHERE titre_plat = 'Salade périgourdine' LIMIT 1);
SET @p_veloute_leg := (SELECT plat_id FROM plat WHERE titre_plat = 'Velouté de légumes de saison' LIMIT 1);
SET @p_tartare := (SELECT plat_id FROM plat WHERE titre_plat = 'Tartare de légumes méditerranéens' LIMIT 1);
SET @p_poulet := (SELECT plat_id FROM plat WHERE titre_plat = 'Filet de poulet sauce forestière' LIMIT 1);
SET @p_curry := (SELECT plat_id FROM plat WHERE titre_plat = 'Curry de légumes au lait de coco' LIMIT 1);
SET @p_risotto := (SELECT plat_id FROM plat WHERE titre_plat = 'Risotto aux légumes' LIMIT 1);
SET @p_tarte_pommes := (SELECT plat_id FROM plat WHERE titre_plat = 'Tarte aux pommes maison' LIMIT 1);
SET @p_mousse := (SELECT plat_id FROM plat WHERE titre_plat = 'Mousse au chocolat végétale' LIMIT 1);
SET @p_fruits := (SELECT plat_id FROM plat WHERE titre_plat = 'Salade de fruits frais' LIMIT 1);

SET @p_potimarron := (SELECT plat_id FROM plat WHERE titre_plat = 'Velouté de potimarron' LIMIT 1);
SET @p_saumon := (SELECT plat_id FROM plat WHERE titre_plat = 'Mini bouchées saumon aneth' LIMIT 1);
SET @p_volaille := (SELECT plat_id FROM plat WHERE titre_plat = 'Suprême de volaille citron' LIMIT 1);
SET @p_cabillaud := (SELECT plat_id FROM plat WHERE titre_plat = 'Pavé de cabillaud herbes' LIMIT 1);
SET @p_magret := (SELECT plat_id FROM plat WHERE titre_plat = 'Magret de canard sauce miel' LIMIT 1);
SET @p_quiche := (SELECT plat_id FROM plat WHERE titre_plat = 'Quiche aux légumes du jardin' LIMIT 1);
SET @p_tarte_tomate := (SELECT plat_id FROM plat WHERE titre_plat = 'Tarte fine tomate basilic' LIMIT 1);
SET @p_fromages := (SELECT plat_id FROM plat WHERE titre_plat = 'Assortiment de fromages affinés' LIMIT 1);
SET @p_moelleux := (SELECT plat_id FROM plat WHERE titre_plat = 'Moelleux au chocolat' LIMIT 1);
SET @p_panna := (SELECT plat_id FROM plat WHERE titre_plat = 'Panna cotta vanille fruits' LIMIT 1);
SET @p_betterave := (SELECT plat_id FROM plat WHERE titre_plat = 'Carpaccio de betterave noix' LIMIT 1);
SET @p_lasagnes := (SELECT plat_id FROM plat WHERE titre_plat = 'Lasagnes végétariennes' LIMIT 1);
SET @p_buddha := (SELECT plat_id FROM plat WHERE titre_plat = 'Buddha bowl quinoa légumes' LIMIT 1);
SET @p_falafel := (SELECT plat_id FROM plat WHERE titre_plat = 'Falafels sauce tahini' LIMIT 1);
SET @p_tiramisu := (SELECT plat_id FROM plat WHERE titre_plat = 'Tiramisu végan café' LIMIT 1);
SET @p_brochettes := (SELECT plat_id FROM plat WHERE titre_plat = 'Brochettes de légumes grillés' LIMIT 1);
SET @p_cesar := (SELECT plat_id FROM plat WHERE titre_plat = 'Salade César revisitée' LIMIT 1);
SET @p_boeuf := (SELECT plat_id FROM plat WHERE titre_plat = 'Filet de bœuf sauce poivre' LIMIT 1);
SET @p_paris := (SELECT plat_id FROM plat WHERE titre_plat = 'Paris-Brest praliné' LIMIT 1);
SET @p_gaspacho := (SELECT plat_id FROM plat WHERE titre_plat = 'Gaspacho andalou' LIMIT 1);
SET @p_paella := (SELECT plat_id FROM plat WHERE titre_plat = 'Paella du traiteur' LIMIT 1);
SET @p_clafoutis := (SELECT plat_id FROM plat WHERE titre_plat = 'Clafoutis aux cerises' LIMIT 1);
SET @p_oignon := (SELECT plat_id FROM plat WHERE titre_plat = 'Soupe à l''oignon gratinée' LIMIT 1);
SET @p_blanquette := (SELECT plat_id FROM plat WHERE titre_plat = 'Blanquette de veau maison' LIMIT 1);
SET @p_tatin := (SELECT plat_id FROM plat WHERE titre_plat = 'Tarte Tatin' LIMIT 1);
SET @p_mimosa := (SELECT plat_id FROM plat WHERE titre_plat = 'Œufs mimosa revisités' LIMIT 1);
SET @p_pancakes := (SELECT plat_id FROM plat WHERE titre_plat = 'Pancakes fruits rouges' LIMIT 1);
SET @p_granola := (SELECT plat_id FROM plat WHERE titre_plat = 'Granola maison yaourt végétal' LIMIT 1);

-- ---------------------------------------------------------------------------
-- Allergènes plats (idempotent)
-- ---------------------------------------------------------------------------
INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_potimarron, @alg_lactose FROM DUAL
WHERE @p_potimarron IS NOT NULL AND @alg_lactose IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_potimarron AND allergene_id = @alg_lactose);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_saumon, @alg_poisson FROM DUAL
WHERE @p_saumon IS NOT NULL AND @alg_poisson IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_saumon AND allergene_id = @alg_poisson);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_saumon, @alg_gluten FROM DUAL
WHERE @p_saumon IS NOT NULL AND @alg_gluten IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_saumon AND allergene_id = @alg_gluten);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_cabillaud, @alg_poisson FROM DUAL
WHERE @p_cabillaud IS NOT NULL AND @alg_poisson IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_cabillaud AND allergene_id = @alg_poisson);

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
SELECT @p_tarte_tomate, @alg_gluten FROM DUAL
WHERE @p_tarte_tomate IS NOT NULL AND @alg_gluten IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_tarte_tomate AND allergene_id = @alg_gluten);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_fromages, @alg_lactose FROM DUAL
WHERE @p_fromages IS NOT NULL AND @alg_lactose IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_fromages AND allergene_id = @alg_lactose);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_moelleux, @alg_gluten FROM DUAL
WHERE @p_moelleux IS NOT NULL AND @alg_gluten IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_moelleux AND allergene_id = @alg_gluten);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_moelleux, @alg_oeufs FROM DUAL
WHERE @p_moelleux IS NOT NULL AND @alg_oeufs IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_moelleux AND allergene_id = @alg_oeufs);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_moelleux, @alg_lactose FROM DUAL
WHERE @p_moelleux IS NOT NULL AND @alg_lactose IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_moelleux AND allergene_id = @alg_lactose);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_panna, @alg_lactose FROM DUAL
WHERE @p_panna IS NOT NULL AND @alg_lactose IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_panna AND allergene_id = @alg_lactose);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_betterave, @alg_coque FROM DUAL
WHERE @p_betterave IS NOT NULL AND @alg_coque IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_betterave AND allergene_id = @alg_coque);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_lasagnes, @alg_gluten FROM DUAL
WHERE @p_lasagnes IS NOT NULL AND @alg_gluten IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_lasagnes AND allergene_id = @alg_gluten);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_lasagnes, @alg_lactose FROM DUAL
WHERE @p_lasagnes IS NOT NULL AND @alg_lactose IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_lasagnes AND allergene_id = @alg_lactose);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_falafel, @alg_coque FROM DUAL
WHERE @p_falafel IS NOT NULL AND @alg_coque IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_falafel AND allergene_id = @alg_coque);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_tiramisu, @alg_gluten FROM DUAL
WHERE @p_tiramisu IS NOT NULL AND @alg_gluten IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_tiramisu AND allergene_id = @alg_gluten);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_cesar, @alg_gluten FROM DUAL
WHERE @p_cesar IS NOT NULL AND @alg_gluten IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_cesar AND allergene_id = @alg_gluten);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_cesar, @alg_lactose FROM DUAL
WHERE @p_cesar IS NOT NULL AND @alg_lactose IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_cesar AND allergene_id = @alg_lactose);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_cesar, @alg_oeufs FROM DUAL
WHERE @p_cesar IS NOT NULL AND @alg_oeufs IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_cesar AND allergene_id = @alg_oeufs);

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

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_mimosa, @alg_oeufs FROM DUAL
WHERE @p_mimosa IS NOT NULL AND @alg_oeufs IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_mimosa AND allergene_id = @alg_oeufs);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_pancakes, @alg_gluten FROM DUAL
WHERE @p_pancakes IS NOT NULL AND @alg_gluten IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_pancakes AND allergene_id = @alg_gluten);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_pancakes, @alg_oeufs FROM DUAL
WHERE @p_pancakes IS NOT NULL AND @alg_oeufs IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_pancakes AND allergene_id = @alg_oeufs);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_pancakes, @alg_lactose FROM DUAL
WHERE @p_pancakes IS NOT NULL AND @alg_lactose IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_pancakes AND allergene_id = @alg_lactose);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_granola, @alg_coque FROM DUAL
WHERE @p_granola IS NOT NULL AND @alg_coque IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_granola AND allergene_id = @alg_coque);

INSERT INTO plat_allergene (plat_id, allergene_id)
SELECT @p_granola, @alg_gluten FROM DUAL
WHERE @p_granola IS NOT NULL AND @alg_gluten IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM plat_allergene WHERE plat_id = @p_granola AND allergene_id = @alg_gluten);

-- ---------------------------------------------------------------------------
-- Menus (12 nouveaux) — titres ≤ 50 car., descriptions ≤ 255
-- ---------------------------------------------------------------------------

-- 1) Cocktail dinatoire entreprise
INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Cocktail Dinatoire', 15, 38,
       'Formules finger food et pièces cocktail pour séminaires et afterworks.',
       'Commande minimum de 15 personnes. Livraison plateau comprise sur Bordeaux.',
       60, @reg_classique, @thm_entreprise
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Cocktail Dinatoire');

-- 2) Buffet traditionnel
INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Buffet Traditionnel', 20, 36,
       'Buffet chaud et froid aux saveurs françaises pour réceptions familiales.',
       'Réservation 5 jours à l''avance. Matériel de service en option.',
       45, @reg_classique, @thm_prive
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Buffet Traditionnel');

-- 3) Gastronomique mariage
INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Gastronomique Signature', 30, 55,
       'Menu assis raffiné pour grandes cérémonies : entrée, plat signature et dessert.',
       'Réservation minimum 21 jours. Dégustation possible sur rendez-vous.',
       20, @reg_classique, @thm_mariage
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Gastronomique Signature');

-- 4) Printemps végétarien
INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Printemps Vert', 10, 34,
       'Carte végétarienne de saison : légumes primeurs, herbes fraîches et fromages.',
       'Disponible de mars à juin. Réservation 72 heures à l''avance.',
       35, @reg_vege, @thm_prive
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Printemps Vert');

-- 5) Estival méditerranéen
INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Estival Méditerranéen', 12, 39,
       'Saveurs du Sud : gaspacho, paella du traiteur et clafoutis aux fruits.',
       'Idéal pour jardins et terrasses. Réservation 4 jours à l''avance.',
       40, @reg_classique, @thm_prive
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Estival Méditerranéen');

-- 6) Automne champêtre
INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Automne Champêtre', 12, 41,
       'Potimarron, magret au miel et tarte Tatin pour les réceptions d''automne.',
       'Disponible de septembre à novembre. Commande minimum 12 personnes.',
       30, @reg_classique, @thm_prive
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Automne Champêtre');

-- 7) Réunion express
INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Réunion Express', 8, 28,
       'Formule légère et rapide pour réunions d''équipe et déjeuners de travail.',
       'Commande la veille avant 12h pour livraison le lendemain midi.',
       80, @reg_classique, @thm_entreprise
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Réunion Express');

-- 8) Séminaire premium
INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Séminaire Premium', 25, 48,
       'Prestation complète pour séminaires : entrée soignée, plat noble et dessert.',
       'Devis personnalisé au-delà de 80 convives. Réservation 10 jours.',
       25, @reg_classique, @thm_entreprise
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Séminaire Premium');

-- 9) Mariage traditionnel
INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Mariage Traditionnel', 40, 49,
       'Classiques du mariage : volaille citronnée, fromages et Paris-Brest.',
       'Réservation 30 jours minimum. Options enfants disponibles.',
       18, @reg_classique, @thm_mariage
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Mariage Traditionnel');

-- 10) Fête végétarienne
INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Fête Végétarienne', 20, 42,
       'Menu végétarien festif pour réceptions : betterave, lasagnes et desserts.',
       'Réservation 10 jours. Compatible avec service à l''assiette.',
       28, @reg_vege, @thm_mariage
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Fête Végétarienne');

-- 11) Végan bureau
INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Végan Bureau', 10, 33,
       'Formule 100 % végétale pour équipes : buddha bowl, falafels et tiramisu.',
       'Sans produit animal. Réservation 48 heures à l''avance.',
       50, @reg_vegan, @thm_entreprise
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Végan Bureau');

-- 12) Brunch festif
INSERT INTO menu (titre, nombre_personne_minimum, prix_par_personne, description, conditions, quantite_restante, regime_id, theme_id)
SELECT 'Menu Brunch Festif', 15, 31,
       'Brunch végétarien : œufs mimosa, pancakes et granola végétal.',
       'Service le week-end uniquement. Commande 3 jours à l''avance.',
       40, @reg_vege, @thm_prive
WHERE NOT EXISTS (SELECT 1 FROM menu WHERE titre = 'Menu Brunch Festif');

-- ---------------------------------------------------------------------------
-- Associations menu_plat
-- ---------------------------------------------------------------------------
-- Cocktail dinatoire
SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Cocktail Dinatoire' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_saumon FROM DUAL WHERE @m IS NOT NULL AND @p_saumon IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_saumon);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_volaille FROM DUAL WHERE @m IS NOT NULL AND @p_volaille IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_volaille);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_quiche FROM DUAL WHERE @m IS NOT NULL AND @p_quiche IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_quiche);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_moelleux FROM DUAL WHERE @m IS NOT NULL AND @p_moelleux IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_moelleux);

-- Buffet traditionnel
SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Buffet Traditionnel' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_oignon FROM DUAL WHERE @m IS NOT NULL AND @p_oignon IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_oignon);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_blanquette FROM DUAL WHERE @m IS NOT NULL AND @p_blanquette IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_blanquette);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_tatin FROM DUAL WHERE @m IS NOT NULL AND @p_tatin IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_tatin);

-- Gastronomique
SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Gastronomique Signature' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_saumon FROM DUAL WHERE @m IS NOT NULL AND @p_saumon IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_saumon);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_boeuf FROM DUAL WHERE @m IS NOT NULL AND @p_boeuf IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_boeuf);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_paris FROM DUAL WHERE @m IS NOT NULL AND @p_paris IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_paris);

-- Printemps vert (végétarien)
SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Printemps Vert' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_betterave FROM DUAL WHERE @m IS NOT NULL AND @p_betterave IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_betterave);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_risotto FROM DUAL WHERE @m IS NOT NULL AND @p_risotto IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_risotto);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_panna FROM DUAL WHERE @m IS NOT NULL AND @p_panna IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_panna);

-- Estival
SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Estival Méditerranéen' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_gaspacho FROM DUAL WHERE @m IS NOT NULL AND @p_gaspacho IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_gaspacho);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_paella FROM DUAL WHERE @m IS NOT NULL AND @p_paella IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_paella);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_clafoutis FROM DUAL WHERE @m IS NOT NULL AND @p_clafoutis IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_clafoutis);

-- Automne
SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Automne Champêtre' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_potimarron FROM DUAL WHERE @m IS NOT NULL AND @p_potimarron IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_potimarron);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_magret FROM DUAL WHERE @m IS NOT NULL AND @p_magret IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_magret);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_tatin FROM DUAL WHERE @m IS NOT NULL AND @p_tatin IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_tatin);

-- Réunion express
SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Réunion Express' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_cesar FROM DUAL WHERE @m IS NOT NULL AND @p_cesar IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_cesar);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_poulet FROM DUAL WHERE @m IS NOT NULL AND @p_poulet IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_poulet);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_fruits FROM DUAL WHERE @m IS NOT NULL AND @p_fruits IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_fruits);

-- Séminaire premium
SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Séminaire Premium' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_cabillaud FROM DUAL WHERE @m IS NOT NULL AND @p_cabillaud IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_cabillaud);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_boeuf FROM DUAL WHERE @m IS NOT NULL AND @p_boeuf IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_boeuf);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_fromages FROM DUAL WHERE @m IS NOT NULL AND @p_fromages IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_fromages);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_moelleux FROM DUAL WHERE @m IS NOT NULL AND @p_moelleux IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_moelleux);

-- Mariage traditionnel
SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Mariage Traditionnel' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_volaille FROM DUAL WHERE @m IS NOT NULL AND @p_volaille IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_volaille);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_fromages FROM DUAL WHERE @m IS NOT NULL AND @p_fromages IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_fromages);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_paris FROM DUAL WHERE @m IS NOT NULL AND @p_paris IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_paris);

-- Fête végétarienne
SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Fête Végétarienne' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_betterave FROM DUAL WHERE @m IS NOT NULL AND @p_betterave IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_betterave);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_lasagnes FROM DUAL WHERE @m IS NOT NULL AND @p_lasagnes IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_lasagnes);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_tarte_pommes FROM DUAL WHERE @m IS NOT NULL AND @p_tarte_pommes IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_tarte_pommes);

-- Végan bureau (100% végétal — réutilise plats seed + nouveaux végans)
SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Végan Bureau' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_tartare FROM DUAL WHERE @m IS NOT NULL AND @p_tartare IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_tartare);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_buddha FROM DUAL WHERE @m IS NOT NULL AND @p_buddha IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_buddha);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_falafel FROM DUAL WHERE @m IS NOT NULL AND @p_falafel IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_falafel);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_tiramisu FROM DUAL WHERE @m IS NOT NULL AND @p_tiramisu IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_tiramisu);

-- Brunch festif (végétarien)
SET @m := (SELECT menu_id FROM menu WHERE titre = 'Menu Brunch Festif' LIMIT 1);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_mimosa FROM DUAL WHERE @m IS NOT NULL AND @p_mimosa IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_mimosa);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_pancakes FROM DUAL WHERE @m IS NOT NULL AND @p_pancakes IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_pancakes);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_granola FROM DUAL WHERE @m IS NOT NULL AND @p_granola IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_granola);
INSERT INTO menu_plat (menu_id, plat_id) SELECT @m, @p_fruits FROM DUAL WHERE @m IS NOT NULL AND @p_fruits IS NOT NULL AND NOT EXISTS (SELECT 1 FROM menu_plat WHERE menu_id=@m AND plat_id=@p_fruits);

COMMIT;

-- Rapport synthétique
SELECT 'menus_total' AS indicateur, COUNT(*) AS valeur FROM menu
UNION ALL
SELECT 'plats_total', COUNT(*) FROM plat
UNION ALL
SELECT 'allergènes_total', COUNT(*) FROM allergene
UNION ALL
SELECT 'liens_menu_plat', COUNT(*) FROM menu_plat;
