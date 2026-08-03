ALTER TABLE commande
  ADD COLUMN informations_complementaires VARCHAR(500) NULL DEFAULT NULL
  AFTER adresse_livraison;
