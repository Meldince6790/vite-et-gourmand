-- HISTORIQUE — déjà intégré dans database/vite_gourmand.sql
-- Ne pas réappliquer sur une base initialisée via le seed Compose.
-- Conservé pour tracer l’évolution du schéma.

ALTER TABLE commande
  ADD COLUMN distance_km DECIMAL(8,2) NULL DEFAULT NULL
  AFTER adresse_livraison;
