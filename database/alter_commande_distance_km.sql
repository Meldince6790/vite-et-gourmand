ALTER TABLE commande
  ADD COLUMN distance_km DECIMAL(8,2) NULL DEFAULT NULL
  AFTER adresse_livraison;
