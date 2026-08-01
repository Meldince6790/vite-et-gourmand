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

# Installation avec Docker (développement)

Cette configuration lance l'environnement de développement complet avec Docker Compose :

- frontend (Vite, port hôte **5173**) ;
- backend (Express, port hôte **3000**) ;
- MariaDB (port hôte **3307**, débogage local) ;
- MongoDB (port hôte **27017**, débogage local).

## Prérequis Docker

- Docker Desktop (ou Docker Engine + Compose v2)

## Configuration

Les valeurs par défaut du `docker-compose.yml` suffisent pour un démarrage local.

Pour personnaliser les secrets ou identifiants :

1. Copier le fichier d'exemple :

```bash
cp .env.example .env
```

2. Adapter si besoin les valeurs de `.env` (mots de passe, `JWT_SECRET`).  
   Ne pas committer le fichier `.env` (ignoré par Git à la racine).

Sous Docker Compose, les noms d'hôte internes `mysql` et `mongo` sont injectés automatiquement pour le backend.  
`VITE_API_URL` et `CORS_ORIGIN` restent basés sur `localhost` car le navigateur accède aux ports publiés sur la machine hôte.

## Lancement

À la racine du projet :

```bash
docker compose up --build
```

Ou en arrière-plan :

```bash
docker compose up --build -d
```

Applications :

- Frontend : http://localhost:5173
- Backend / API : http://localhost:3000

Ports bases de données (débogage uniquement) :

- MariaDB : `localhost:3307` → conteneur `3306` (évite le conflit avec XAMPP sur 3306)
- MongoDB : `localhost:27017`

Le fichier `database/vite_gourmand.sql` est importé automatiquement au **premier** démarrage du volume MySQL.

## Arrêt

```bash
docker compose down
```

Pour supprimer aussi les volumes (réinitialise les bases) :

```bash
docker compose down -v
```

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

Le projet utilise Git afin de conserver un historique des modifications, faciliter le suivi du développement et sécuriser l'évolution de l'application.

L'organisation du dépôt repose désormais sur un workflow basé sur plusieurs branches.

## Branches principales

- `main` : contient la version stable de l'application. Cette branche correspond aux versions validées et prêtes à être présentées ou déployées.

- `developpement` : branche d'intégration regroupant les nouvelles fonctionnalités avant leur validation finale et leur fusion dans `main`.

## Branches de fonctionnalités

Chaque évolution importante du projet est développée sur une branche dédiée créée depuis `developpement` :

```bash
feature/nom-de-la-fonctionnalite
```

Exemples :

```bash
feature/gestion-commandes
feature/statistiques
feature/authentification
feature/amelioration-interface
```

Ces branches permettent d'isoler le développement de chaque fonctionnalité, de limiter les risques de régression et de faciliter les tests avant intégration.

## Processus d'intégration

Le cycle de développement suivi est le suivant :

1. Création d'une branche `feature/*` depuis `developpement`.
2. Développement et tests de la fonctionnalité.
3. Fusion de la branche de fonctionnalité dans `developpement` après validation.
4. Tests globaux de l'application.
5. Fusion de `developpement` dans `main` lorsque la version est considérée comme stable.

## Cette organisation permet de conserver une version stable de l'application tout en facilitant l'ajout de nouvelles fonctionnalités, les corrections techniques et la maintenance du projet.

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
