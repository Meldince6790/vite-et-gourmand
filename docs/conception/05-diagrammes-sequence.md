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

## Points d'attention relevés lors de l’analyse

Les points suivants précisent des comportements du code utile à la lecture des diagrammes. Ils ne constituent pas des anomalies bloquantes :

- la page `Commander.jsx` estime les frais via `POST /livraison/estimation` puis le backend recalcule définitivement distance et tarif à la création (les valeurs client `distance_km` / `prix_livraison` sont ignorées) ;
- les statistiques MongoDB sont synchronisées avec le cycle de vie des commandes : incrément à la création, ajustement du chiffre d'affaires lorsque les montants évoluent, décrément à l'annulation ;
- il n'existe pas de workflow strict de transitions entre statuts : tout statut de la liste autorisée peut être appliqué sans enchaînement imposé ;
- l'`utilisateur_id` éventuellement fourni par le frontend est écrasé côté serveur par `req.user.utilisateur_id` issu du JWT (comportement de sécurité correct, mais à ne pas confondre avec une confiance accordée au body).
