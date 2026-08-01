# Diagrammes de séquence

## Objectif

Les diagrammes de séquence décrivent les interactions temporelles entre les acteurs, l'interface React, l'API Express et les bases de données pour les principaux parcours métier de **Vite & Gourmand**.

Ils s'appuient sur l'implémentation actuelle du dépôt (pages, services frontend, routes, middlewares, contrôleurs, services et modèles) et non sur une cible idéalisée.

Les sources PlantUML peuvent être rendues en SVG pour intégration dans les livrables.

---

## 1. Connexion utilisateur

Ce diagramme représente le parcours de connexion : soumission du formulaire, authentification côté API, vérification du mot de passe et du statut `actif`, émission d'un JWT, stockage local de la session, puis redirection selon le rôle.

- Source PlantUML : [sequence-login.puml](../diagrammes/sequence-login.puml)
- Rendu SVG attendu : [sequence-login.svg](../diagrammes/sequence-login.svg)

---

## 2. Création d'une commande

Ce diagramme décrit la création d'une commande par un client authentifié : appel `POST /commandes`, contrôle JWT et rôle client, remplacement de `utilisateur_id` par la valeur issue du jeton, validations métier, écriture MySQL (commande + stock), puis mise à jour optionnelle des statistiques MongoDB.

- Source PlantUML : [sequence-creation-commande.puml](../diagrammes/sequence-creation-commande.puml)
- Rendu SVG attendu : [sequence-creation-commande.svg](../diagrammes/sequence-creation-commande.svg)

---

## 3. Mise à jour du statut d'une commande

Ce diagramme illustre le traitement d'une commande par un employé ou un administrateur : sélection d'un statut, `PATCH /commandes/{id}/statut`, contrôles d'authentification et de rôle, validation du statut autorisé, mise à jour MySQL, puis rafraîchissement de la liste des commandes.

- Source PlantUML : [sequence-maj-statut-commande.puml](../diagrammes/sequence-maj-statut-commande.puml)
- Rendu SVG attendu : [sequence-maj-statut-commande.svg](../diagrammes/sequence-maj-statut-commande.svg)

---

## Incohérences relevées lors de l’analyse

Les points suivants ont été constatés dans le code ou la documentation au moment de l'élaboration des diagrammes. Ils sont documentés ici **sans correction** dans le cadre de ce livrable :

- la page `Commander.jsx` n'envoie pas de distance de livraison (`distance_km`), alors que le backend peut calculer des frais de livraison à partir de cette valeur ;
- les statistiques MongoDB ne sont pas mises à jour lorsqu'une commande est ultérieurement annulée (ou lorsque son montant évolue), alors qu'elles sont incrémentées à la création ;
- il n'existe pas de workflow strict de transitions entre statuts : tout statut de la liste autorisée peut être appliqué sans enchaînement imposé ;
- l'`utilisateur_id` éventuellement fourni par le frontend est écrasé côté serveur par `req.user.utilisateur_id` issu du JWT (comportement de sécurité correct, mais à ne pas confondre avec une confiance accordée au body) ;
- le document des règles métier (`02-regles-metiers.md`) indique encore certaines règles de commande comme « À développer », alors que les parcours correspondants sont déjà implémentés dans le code.
