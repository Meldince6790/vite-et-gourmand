# Vite & Gourmand

Dépôt GitHub : [https://github.com/Meldince6790/vite-et-gourmand](https://github.com/Meldince6790/vite-et-gourmand)

Application déployée en ligne : *non publiée à ce stade* (environnement de pré-production local via Docker Compose).

---

## Présentation

**Vite & Gourmand** est une application web de gestion pour une entreprise de traiteur (projet ECF Développeur Web et Web Mobile).

Elle permet :

- aux **visiteurs** de consulter les menus, les avis validés, les horaires, les mentions légales / CGV et d’utiliser le formulaire de contact ;
- aux **clients** de s’inscrire, commander, suivre / modifier / annuler leurs commandes (selon les règles métier) et de déposer un avis ;
- aux **employés** de gérer le catalogue, les commandes, les horaires et de modérer les avis ;
- aux **administrateurs** de gérer les comptes employés et de consulter les statistiques (MongoDB).

L’architecture sépare l’interface React, l’API Express et deux bases de données (MariaDB métier, MongoDB statistiques).

---

## Technologies

| Couche | Technologies |
|--------|----------------|
| Frontend | React, Vite, React Router, Chart.js, nginx (image Docker de production) |
| Backend | Node.js, Express, JWT, bcrypt, mysql2, mongoose, Resend, express-rate-limit |
| Données métier | MariaDB 10.11 |
| Statistiques | MongoDB 7 |
| Conteneurisation | Docker Compose (pré-production) |
| Services externes | OpenRouteService (frais de livraison), Resend (e-mails optionnels) |

---

## Fonctionnalités principales

- Authentification JWT et contrôle d’accès par rôles (Client, Employé, Administrateur)
- Catalogue de menus (filtres thème / régime / prix / personnes) et détail enrichi (plats, allergènes)
- Gestion des plats, thèmes, régimes, allergènes (espace employé)
- Cycle de vie des commandes (création, modification, annulation, statuts employés)
- Calcul serveur des montants (remise éventuelle, frais de livraison)
- Estimation et facturation de livraison via OpenRouteService (gratuit à Bordeaux ; hors Bordeaux : `5 + 0,59 × km`)
- Avis clients (dépôt après commande terminée, modération ; affichage public des avis **Validé** uniquement)
- Horaires dynamiques en pied de page
- E-mails transactionnels (bienvenue, contact, confirmation / annulation de commande) — mode `log` ou Resend
- Statistiques administrateur (agrégats MongoDB synchronisés avec les commandes)
- Conteneurisation complète prête pour une pré-production locale

---

## Architecture

```text
                    Navigateur
                         |
            http://localhost:5173
                         |
              +----------v----------+
              |  Frontend (nginx)   |
              |  build Vite / dist  |
              +----------+----------+
                         |
            http://localhost:3000
                         |
              +----------v----------+
              | Backend Express     |
              | NODE_ENV=production |
              | GET /health         |
              +-----+---------+-----+
                    |         |
           réseau Docker      |
          vite-gourmand       |
               / \            |
              /   \           |
     +-------v-+  +----v-----+
     | MariaDB |  | MongoDB  |
     | métier  |  | stats    |
     | (auth)  |  | (auth)   |
     +---------+  +----------+
```

| Service Compose | Rôle | Accès depuis l’hôte |
|-----------------|------|---------------------|
| `frontend` | SPA React servie par nginx (fallback `index.html`) | **5173** → 80 |
| `backend` | API REST Node.js | **3000** → 3000 |
| `mysql` | MariaDB + init SQL + validation de schéma | **3307** → 3306 *(outils locaux, ex. DBeaver)* |
| `mongo` | MongoDB avec authentification | **non publié** (réseau Docker uniquement) |

Les services backend et frontend tournent en configuration **production** (pas de bind mount de code, pas de serveur Vite de développement dans l’image frontend).

---

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine + Compose v2)
- Un fichier `.env` à la racine (obligatoire — voir ci-dessous)
- Optionnel hors Docker : Node.js 24.x, client MariaDB / MongoDB

---

## Démarrage rapide (pré-production Docker) — recommandé

### 1. Variables d’environnement

```bash
cp .env.example .env
```

Renseigner **obligatoirement** les secrets et identifiants (Compose refuse de démarrer s’ils manquent) :

- `JWT_SECRET`, `JWT_EXPIRES`
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `MYSQL_ROOT_PASSWORD`
- `MONGO_ROOT_USERNAME`, `MONGO_ROOT_PASSWORD`, `MONGO_APP_USERNAME`, `MONGO_APP_PASSWORD`
- `MONGO_URI` (utilisateur applicatif + `authSource`, hôte Docker `mongo`)
- `CORS_ORIGIN`, `FRONTEND_URL`, `VITE_API_URL`
- `EMAIL_PROVIDER`, `EMAIL_FROM`, `CONTACT_TO`
- `ORS_API_KEY` (recommandé pour tester la livraison)

Les mots de passe et l’authentification Mongo/MariaDB ne s’appliquent qu’au **premier** démarrage d’un volume vide. Après modification des credentials :

```bash
docker compose down
docker volume rm vite-et-gourmand_mysql_data vite-et-gourmand_mongo_data
docker compose up -d --build
```

### 2. Lancement

```bash
docker compose up --build
```

Ou en arrière-plan :

```bash
docker compose up --build -d
```

### 3. Accès

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Interface (nginx) |
| http://localhost:3000 | API |
| http://localhost:3000/health | Sonde de disponibilité (`{"status":"ok"}`) |
| `localhost:3307` | MariaDB (débogage / client SQL) |
| MongoDB | Uniquement via `docker compose exec mongo …` |

### 4. Arrêt

```bash
docker compose down
```

Suppression des volumes (réinitialise les bases) :

```bash
docker compose down -v
```

### Comportement Docker (état actuel)

- **Frontend** : multi-stage `npm run build` puis nginx ; `VITE_API_URL` injectée au **build** de l’image
- **Backend** : image slim, `NODE_ENV=production`, utilisateur non-root, arrêt propre SIGTERM/SIGINT, healthcheck HTTP
- **MariaDB** : utilisateur applicatif, mot de passe root obligatoire, import de `database/vite_gourmand.sql`, script `02-validate-schema.sh`
- **MongoDB** : utilisateur root + utilisateur applicatif `readWrite`, URI authentifiée pour le backend
- **Réseau** : bridge `vite-gourmand`
- **Restart** : `unless-stopped` sur les services

---

## Variables d’environnement

Fichier de référence : [`.env.example`](.env.example) (à copier en `.env`, **jamais committer** le `.env` réel).

| Variable | Rôle |
|----------|------|
| `VITE_API_URL` | URL de l’API vue par le navigateur (embarquée dans le bundle frontend) |
| `CORS_ORIGIN` / `FRONTEND_URL` | Origine SPA autorisée / URL front |
| `PORT` | Port HTTP du backend (défaut 3000) |
| `DB_*` / `MYSQL_ROOT_PASSWORD` | Connexion MariaDB |
| `MONGO_*` / `MONGO_URI` | Auth Mongo et URI applicative |
| `JWT_SECRET` / `JWT_EXPIRES` | Signature et durée des jetons |
| `EMAIL_PROVIDER` | `log` (console) ou `resend` |
| `EMAIL_FROM` / `CONTACT_TO` / `RESEND_API_KEY` | Paramétrage e-mails |
| `ORS_API_KEY` / `ORS_*` / `CATERER_*` | Calcul des frais de livraison |

Sous Docker Compose, le backend utilise les hôtes internes `mysql` et `mongo` (injectés / URI), indépendamment de `DB_HOST=localhost` éventuellement présent pour un usage hors conteneur.

---

## Installation hors Docker (optionnelle)

Utile pour le développement ciblé d’un seul service. Les bases doivent alors tourner séparément (ou via Compose).

### Backend

```bash
cd backend
npm install
```

Créer un `.env` (racine du dépôt ou dossier backend selon votre usage de `dotenv`) avec au minimum `DB_*`, `MONGO_URI`, `JWT_*`, `CORS_ORIGIN`, puis :

```bash
npm start
```

Tests automatisés :

```bash
npm test
```

### Frontend (mode développement Vite)

```bash
cd frontend
npm install
npm run dev
```

Build de production local :

```bash
npm run build
npm run preview
```

---

## Comptes de démonstration

Présents après import de `database/vite_gourmand.sql` (premier démarrage du volume MariaDB).

| Rôle | E-mail | Usage |
|------|--------|--------|
| Administrateur | `admin@vite-gourmand.fr` | Employés, statistiques |
| Employé | `employe@vite-gourmand.fr` | Catalogue, commandes, avis, horaires |
| Client | `client@vite-gourmand.fr` | Commandes, avis |

Les mots de passe correspondent aux hashes bcrypt du fichier SQL de démonstration. Ils respectent les règles de complexité de l’application (majuscule, minuscule, chiffre, caractère spécial).  
*Si vous ne disposez pas du mot de passe en clair fourni avec le jeu de données, recréez un compte via l’inscription client ou réinitialisez le hash en base pour les besoins de test.*

---

## Sécurité (pré-production)

Mesures en place dans le dépôt actuel :

- Authentification **JWT** et middleware de rôles côté API
- Mots de passe hashés avec **bcrypt** ; règles de complexité à l’inscription
- Requêtes SQL **paramétrées** (mysql2)
- Filtrage des avis publics (**Validé** uniquement) ; accès complet réservé au staff authentifié
- Messages d’erreur API : limitation de la fuite de détails techniques / SQL
- Rate limiting sur `POST /auth/login` et `POST /contact`
- Secrets et origines lus depuis `.env` (pas de secret de production codé en dur dans Compose)
- MongoDB authentifié ; MariaDB avec utilisateur applicatif et root protégés
- MongoDB **non exposé** sur l’hôte ; MariaDB publié sur 3307 uniquement pour l’administration locale
- Backend non-root, `NODE_ENV=production`, endpoint `/health`, fermeture propre des connexions
- Frontend servi en fichiers statiques (plus de serveur Vite de développement dans l’image)

Limites restantes avant une mise en ligne publique : HTTPS / domaine, durcissement éventuel (fermeture du port 3307), CI/CD, sauvegardes automatisées, clé ORS et Resend de production.

---

## Structure du projet

```text
vite-et-gourmand/
├── backend/
│   ├── Dockerfile                 # Image Node production (non-root)
│   ├── package.json
│   ├── scripts/                   # ex. resync statistiques MongoDB
│   └── src/
│       ├── app.js
│       ├── config/                # MariaDB, MongoDB
│       ├── controllers/
│       ├── domain/
│       ├── middlewares/           # auth, rôles, rate-limit, auth optionnelle
│       ├── models/
│       ├── repositories/
│       ├── routes/
│       ├── services/              # métier, e-mails, ORS, statistiques
│       └── utils/
├── frontend/
│   ├── Dockerfile                 # Build Vite + nginx
│   ├── nginx.conf                 # SPA fallback
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── data/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       └── utils/
├── database/
│   ├── vite_gourmand.sql          # Schéma + données de démo (init Compose)
│   ├── 02-validate-schema.sh      # Contrôle des tables après init
│   ├── mongo-init-app-user.sh     # Création utilisateur Mongo applicatif
│   └── alter_*.sql / update_*.sql # Scripts d’évolution (hors init auto)
├── docs/                          # Conception, livrables, maquettes, diagrammes
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Documentation complémentaire

Dossier [`docs/`](docs/) :

| Contenu | Emplacement |
|---------|-------------|
| Analyse fonctionnelle, règles métiers, cas d’utilisation | `docs/conception/` |
| Diagrammes UML (classes, séquences, cas d’utilisation) | `docs/diagrammes/` |
| Maquettes et wireframes | `docs/maquettes/`, `docs/wireframes/` |
| Documentation technique, manuel utilisateur, charte graphique | `docs/livrables/` |
| Pré-production (Docker Compose) | `docs/livrables/preproduction.md` |
| Gestion de projet | `docs/gestion-projet/` |

---

## Organisation Git

- `main` : version stable
- `developpement` : branche d’intégration
- Branches `feature/*` : évolutions isolées lorsque le workflow le permet

Le détail de l’organisation des sprints figure dans `docs/gestion-projet/gestion-projet.md`.

---

## Auteur

Projet réalisé dans le cadre d’un ECF de développement d’application web (titre professionnel Développeur Web et Web Mobile).
