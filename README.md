# Liens du projet

Dépôt GitHub : https://github.com/Meldince6790/vite-et-gourmand

Application déployée :
À compléter

# Vite & Gourmand

Application web de gestion pour une entreprise de traiteur.

Le projet **Vite & Gourmand** permet aux visiteurs de consulter les menus proposés, aux clients de passer des commandes, aux employés de gérer l'activité quotidienne et aux administrateurs de suivre les performances grâce aux statistiques.

---

# Présentation du projet

L'objectif de cette application est de proposer une solution complète permettant :

- la présentation des menus disponibles ;
- la gestion des plats ;
- la gestion des commandes clients ;
- la gestion des utilisateurs selon leurs rôles ;
- le suivi statistique de l'activité ;
- la consultation du chiffre d'affaires généré.

L'application respecte une architecture séparant :

- l'interface utilisateur ;
- l'API métier ;
- les bases de données.

---

# Technologies utilisées

## Frontend

- React
- Vite
- React Router
- Chart.js

Le frontend permet une interface dynamique basée sur des composants réutilisables.

---

## Backend

- Node.js
- Express.js

Le backend expose une API REST permettant la communication entre l'application cliente et les bases de données.

---

## Bases de données

### MySQL / MariaDB

Utilisé pour stocker les données métier :

- utilisateurs ;
- rôles ;
- menus ;
- plats ;
- commandes ;
- allergènes ;
- thèmes ;
- régimes alimentaires ;
- horaires.

### MongoDB

Utilisé pour la partie statistique :

- nombre de commandes par menu ;
- analyse des performances des menus ;
- calcul du chiffre d'affaires.

La connexion MongoDB est configurée via la variable d'environnement `MONGO_URI`.

---

# Architecture de l'application

```
                Frontend React
                     |
                     |
                 API REST
                     |
              Backend Express
              /             \
             /               \
        MySQL/MariaDB       MongoDB
       Données métier     Statistiques
```

---

# Installation locale

## Prérequis

Installer :

- Node.js (version recommandée : 24.x ou supérieure compatible)
- npm
- XAMPP (MariaDB)
- MongoDB

---

# Installation de la base de données

## MySQL / MariaDB

1. Démarrer MySQL depuis XAMPP.

2. Créer la base :

```sql
CREATE DATABASE vite_gourmand;
```

3. Importer le fichier SQL disponible dans :

```
database/vite_gourmand.sql
```

Ce fichier contient :

- la création des tables ;
- les contraintes nécessaires ;
- les données nécessaires au fonctionnement de l'application.

---

## MongoDB

Créer une base MongoDB destinée au stockage des statistiques générées par l'application.

La connexion est configurée dans le fichier d'environnement du backend grâce à la variable :

```env
MONGO_URI=votre_configuration_mongodb
```

---

# Installation du backend

Se placer dans le dossier backend :

```bash
cd backend
```

Installer les dépendances :

```bash
npm install
```

Créer un fichier `.env` :

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=vite_gourmand
DB_PORT=3306

JWT_SECRET=votre_secret
JWT_EXPIRES=24h

MONGO_URI=votre_configuration_mongodb
```

Lancer le serveur :

```bash
npm start
```

L'API sera disponible sur :

```
http://localhost:3000
```

---

# Installation du frontend

Se placer dans le dossier frontend :

```bash
cd frontend
```

Installer les dépendances :

```bash
npm install
```

Lancer l'application :

```bash
npm run dev
```

L'application sera accessible depuis :

```
http://localhost:5173
```

---

# Comptes de démonstration

Des comptes de démonstration permettant de tester les différents parcours utilisateurs sont disponibles après import de la base de données de présentation.

Les profils disponibles sont :

## Client

Permet de tester :

- connexion ;
- consultation des menus ;
- passage de commande.

```
Email :
Mot de passe :
```

---

## Employé

Permet de tester :

- gestion des menus ;
- gestion des plats ;
- gestion des commandes.

```
Email :
Mot de passe :
```

---

## Administrateur

Permet de tester :

- gestion des employés ;
- consultation des statistiques ;
- consultation du chiffre d'affaires.

```
Email :
Mot de passe :
```

---

# Sécurité

Plusieurs mécanismes de sécurité ont été mis en place.

## Authentification

- Authentification par JWT.
- Vérification du token lors des actions protégées.
- Durée de validité limitée.

## Gestion des rôles

Les accès sont contrôlés selon le rôle :

- Client ;
- Employé ;
- Administrateur.

Les fonctionnalités sensibles sont protégées côté serveur.

## Protection des données

- Les mots de passe ne sont pas stockés en clair.
- Les requêtes SQL utilisent des paramètres afin de limiter les risques d'injection.
- Les données reçues par l'API sont contrôlées avant traitement.
- Les erreurs retournées par l'API ne doivent pas exposer d'informations sensibles.

---

# Organisation Git

Le projet utilise Git afin de conserver un historique des modifications et faciliter le suivi du développement.

La branche principale utilisée est :

- `main` : contient la version stable de l'application.

Les évolutions du projet ont été intégrées progressivement grâce à des commits réguliers permettant de suivre :

- l'ajout des fonctionnalités ;
- les corrections techniques ;
- les modifications de structure ;
- l'ajout des éléments de documentation.

Le workflow complet avec une branche de développement et des branches dédiées aux fonctionnalités n'a pas été appliqué sur cette version du projet en raison des contraintes de temps liées à la réalisation de l'ECF.

---

# Structure du projet

```
Vite-Gourmand/

├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── middlewares/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
│
├── database/
│   └── vite_gourmand.sql
│
└── docs/
```

---

# Documentation complémentaire

Les documents de conception et de documentation du projet sont regroupés dans le dossier `docs`.

Ils comprennent notamment :

- Analyse fonctionnelle ;
- Règles métiers ;
- Cas d'utilisation ;
- Diagramme de classes ;
- Documentation technique ;
- Manuel utilisateur ;
- Charte graphique ;
- Gestion de projet.

---

# Auteur

Projet réalisé dans le cadre d'un ECF de développement d'application web.
