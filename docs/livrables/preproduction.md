# Pré-production — Vite & Gourmand

Document décrivant l’environnement de pré-production tel qu’il est configuré dans le dépôt (Docker Compose, Dockerfiles, `.env.example`).  
Il est cohérent avec le `README.md` et `docs/livrables/documentation-technique.md`.

---

## 1. Objectif de l'environnement de pré-production

### Rôle

La pré-production permet d’exécuter l’application complète dans des conditions proches d’un déploiement réel : images de production, secrets externalisés, bases authentifiées, sondes de santé et redémarrage automatique des conteneurs.

Elle s’exécute localement via Docker Compose. Aucune URL publique ni certificat TLS n’est configuré dans le dépôt à ce stade.

### Objectifs recherchés

- Valider le fonctionnement de la stack (frontend, API, MariaDB, MongoDB) sans mode développement embarqué dans les images.
- Vérifier l’injection des variables d’environnement et le refus de démarrage lorsque les secrets critiques manquent.
- Contrôler l’ordre de démarrage (bases saines avant le backend).
- Disposer d’un socle reproductible pour un futur déploiement (VPS ou autre).

### Différences avec un environnement de développement

| Aspect | Développement typique | Pré-production actuelle (dépôt) |
|--------|----------------------|----------------------------------|
| Frontend | Serveur Vite (`npm run dev`), hot-reload | Build Vite → fichiers `dist/` servis par **nginx** |
| Backend | Souvent bind mount + rechargement | Image figée, `NODE_ENV=production`, pas de bind mount applicatif |
| Dépendances Node | Toutes (y compris `devDependencies`) | Backend : `npm ci --omit=dev` |
| Processus | Souvent root / npm wrapper | Backend : utilisateur Linux **`node`**, `CMD ["node", "src/app.js"]` |
| Bases | Parfois sans auth / ports ouverts | MariaDB : utilisateur applicatif + root ; MongoDB : authentifiée |
| Secrets | Défauts locaux fréquents | Variables critiques **obligatoires** via `.env` |

---

## 2. Architecture de déploiement

### Services

| Composant | Technologie | Rôle dans Compose |
|-----------|-------------|-------------------|
| Frontend | React + Vite | Interface utilisateur (bundle de production) |
| Serveur web | nginx 1.27 (Alpine) | Sert `dist/` et gère le routage SPA |
| Backend | Node.js 24 + Express | API REST métier |
| MariaDB | Image `mariadb:10.11` | Données relationnelles |
| MongoDB | Image `mongo:7` | Agrégats statistiques |

### Échanges

1. Le navigateur charge l’application sur le port hôte **5173** (nginx, port conteneur 80).
2. Le navigateur appelle l’API sur **3000** (`VITE_API_URL`, valeur embarquée au build frontend).
3. Le backend joint MariaDB sur l’hôte Docker `mysql:3306` et MongoDB via `MONGO_URI` (hôte `mongo`).
4. Les quatre services communiquent sur le réseau bridge **`vite-gourmand`**.

### Schéma

```text
                    Navigateur
                         |
              http://localhost:5173
                         |
              +----------v-----------+
              | frontend (nginx)     |
              | dist / React Router  |
              +----------+-----------+
                         |
              http://localhost:3000
                         |
              +----------v-----------+
              | backend (Express)    |
              | GET /health          |
              +-----+---------+------+
                    |         |
         réseau vite-gourmand |
               /              \
              /                \
     +------v-------+    +-----v------+
     | mysql        |    | mongo      |
     | MariaDB      |    | auth       |
     | volume data  |    | volume data|
     +--------------+    +------------+
```

---

## 3. Conteneurisation Docker

Fichier d’orchestration : `docker-compose.yml` à la racine.

### Frontend (`frontend/Dockerfile`)

1. Stage **build** (`node:24-bookworm`) : `npm ci`, copie du code, `npm run build`.
2. Génération du dossier **`dist/`** (artefacts Vite de production).
3. Stage **runtime** : `nginx:1.27-alpine` ; copie de `dist/` vers `/usr/share/nginx/html`.
4. Configuration `frontend/nginx.conf` :
   - `try_files $uri $uri/ /index.html` pour le fallback **React Router** ;
   - cache long sur `/assets/`.
5. **`VITE_API_URL`** : build-arg obligatoire ; sans valeur, le build échoue. Compose la lit depuis `.env` (`${VITE_API_URL:?…}`).

Ports : hôte **5173** → conteneur **80**.  
`restart: unless-stopped`. Dépend de `backend`.

### Backend (`backend/Dockerfile`)

| Élément | Valeur réelle |
|---------|----------------|
| Image de base | `node:24-bookworm-slim` |
| Installation | `npm ci --omit=dev` puis nettoyage du cache npm |
| Environnement | `NODE_ENV=production` (Dockerfile + Compose) |
| Utilisateur | `USER node` (non-root) après `COPY --chown=node:node` |
| Démarrage | `CMD ["node", "src/app.js"]` (signaux SIGTERM/SIGINT transmis au process Node) |

Ports : hôte **3000** → **3000**.  
Healthcheck Compose : requête HTTP interne vers `/health`.  
Pas de volume de code source monté.

### Bases de données

#### MariaDB (`mysql`)

- Image `mariadb:10.11`.
- Variables : `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD` (issues de `.env`, obligatoires côté service mysql).
- Init : `database/vite_gourmand.sql` puis `database/02-validate-schema.sh`.
- Volume nommé **`mysql_data`** → `/var/lib/mysql`.
- Port hôte **3307** → 3306 (accès outils locaux, ex. DBeaver).
- Healthcheck : `healthcheck.sh --connect --innodb_initialized`.

#### MongoDB (`mongo`)

- Image `mongo:7`.
- Auth root + utilisateur applicatif créé par `database/mongo-init-app-user.sh`.
- Volume nommé **`mongo_data`** → `/data/db`.
- **Aucun port publié** sur l’hôte (accès réseau Docker uniquement).
- Healthcheck : `mongosh` authentifié (`admin`) avec `ping`.

---

## 4. Variables d'environnement

### Pourquoi

Séparer la configuration du code : secrets, origines CORS, URL d’API du navigateur, identifiants des bases, clés des services externes (e-mails, OpenRouteService).

### Injection

| Mécanisme | Usage |
|-----------|--------|
| Fichier `.env` à la racine | Lu automatiquement par Docker Compose (modèle : `.env.example`) |
| `environment:` / `args:` dans Compose | Injection dans les conteneurs / build frontend |
| `dotenv` dans le backend | Chargement éventuel d’un `.env` selon le contexte d’exécution |

Les variables marquées `${VAR:?…}` dans Compose **bloquent le démarrage** si elles sont absentes.

Les credentials MariaDB / Mongo ne sont appliqués qu’à la **première** initialisation d’un volume vide.

### Variables critiques

| Variable | Rôle |
|----------|------|
| `JWT_SECRET` | Signature des jetons d’authentification |
| `JWT_EXPIRES` | Durée de validité des JWT |
| `VITE_API_URL` | URL de l’API embarquée dans le bundle frontend (build-time) |
| `FRONTEND_URL` | URL de référence du front (environnement backend) |
| `CORS_ORIGIN` | Origine autorisée par l’API |
| `DB_USER` / `DB_PASSWORD` / `DB_NAME` | Compte applicatif MariaDB |
| `MYSQL_ROOT_PASSWORD` | Mot de passe root MariaDB (init) |
| `MONGO_URI` | URI MongoDB authentifiée utilisée par le backend |
| `MONGO_ROOT_*` / `MONGO_APP_*` | Comptes Mongo (init + utilisateur applicatif) |
| `EMAIL_PROVIDER` / `EMAIL_FROM` / `CONTACT_TO` | Configuration e-mails (`log` ou `resend`) |
| `RESEND_API_KEY` | Clé Resend (si `EMAIL_PROVIDER=resend`) |
| `ORS_API_KEY` | Clé OpenRouteService (frais de livraison) |

Autres variables présentes : `PORT`, `ORS_BASE_URL`, `ORS_TIMEOUT_MS`, `CATERER_ADDRESS`, `CATERER_LATITUDE`, `CATERER_LONGITUDE`.

Sous Compose, le backend utilise `DB_HOST=mysql` et une `MONGO_URI` pointant vers l’hôte `mongo`, indépendamment d’un éventuel `DB_HOST=localhost` destiné à un usage hors conteneur.

---

## 5. Sécurisation de l'environnement

Mesures **effectivement** en place dans cet environnement :

| Domaine | Mise en œuvre |
|---------|----------------|
| MariaDB | Utilisateur applicatif (`MYSQL_USER` / `DB_USER`) + `MYSQL_ROOT_PASSWORD` obligatoires |
| MongoDB | Authentification root ; utilisateur applicatif `readWrite` ; URI avec `authSource` ; port non publié |
| Secrets | Externalisés dans `.env` ; pas de secret de production codé en dur dans les Dockerfiles |
| Processus backend | Utilisateur Linux **`node`** (non-root) |
| CORS | Origine unique via `CORS_ORIGIN` |
| Authentification API | JWT (`JWT_SECRET` / `JWT_EXPIRES`) |
| Mots de passe comptes | Hash **bcrypt** (application) |
| Abuse HTTP | Rate limiting sur `POST /auth/login` et `POST /contact` |
| Erreurs API | Filtrage des messages techniques (`safeErrorMessage`) |
| Avis | Endpoints publics limités aux avis **Validé** (staff JWT pour le reste) |

Le port MariaDB **3307** reste publié pour l’administration locale ; MongoDB n’est pas exposé hors du réseau Compose.

---

## 6. Vérification de l'état des services

### Endpoint `/health`

- Route : `GET /health`
- Réponse : `{"status":"ok"}` (HTTP 200)
- Sans accès base de données ni effet métier
- Utilisée par le healthcheck du service `backend`

### Healthchecks Docker

| Service | Contrôle |
|---------|----------|
| `mysql` | Connexion InnoDB initialisée |
| `mongo` | `db.adminCommand('ping')` avec authentification admin |
| `backend` | `fetch('http://127.0.0.1:3000/health')` |

### Dépendances et démarrage contrôlé

```text
mysql (healthy) ──┐
                  ├──► backend ──► frontend
mongo (healthy) ──┘
```

Le backend ne démarre qu’après `condition: service_healthy` sur MariaDB et MongoDB.  
Le frontend dépend de `backend` (démarrage après création du service backend).

Politique de redémarrage commune : `restart: unless-stopped`.

Arrêt propre du backend : handlers **SIGTERM** / **SIGINT** (fermeture HTTP, pool MariaDB, déconnexion MongoDB) dans `backend/src/app.js`.

---

## 7. Validation de la pré-production

Vérifications réalisables sur la stack actuelle :

| Contrôle | Méthode indicative | Résultat attendu |
|----------|--------------------|------------------|
| Démarrage complet | `docker compose up --build -d` | Quatre services Up ; mysql / mongo / backend healthy |
| Frontend | Navigateur ou `GET http://localhost:5173/` | HTTP 200, HTML de production |
| SPA (rafraîchissement) | `GET /menus`, `/login`, etc. | HTTP 200 (`index.html` via nginx) |
| Backend / API | `GET http://localhost:3000/` ou `/menus` | Réponse API |
| Health | `GET http://localhost:3000/health` | `{"status":"ok"}` |
| MariaDB | Client sur `localhost:3307` ou `docker compose exec mysql …` | Connexion avec l’utilisateur applicatif ; schéma initialisé |
| MongoDB | `docker compose exec mongo mongosh …` (auth) | `ping` OK ; backend journalise la connexion Mongo au démarrage |

Prérequis : fichier `.env` renseigné à partir de `.env.example`.

---

## 8. Limites avant mise en production réelle

Éléments **non présents** dans le dépôt et restant à mettre en place pour une exposition Internet :

| Élément | État actuel |
|---------|-------------|
| HTTPS / certificat TLS | Non configuré |
| Nom de domaine public | Non configuré (accès `localhost`) |
| CI/CD | Non présent dans le dépôt |
| Sauvegardes automatiques des volumes | Non automatisées |
| Supervision / monitoring externalisé | Non mis en place (healthchecks Compose uniquement) |
| Publication publique | Application en ligne non déployée |

Ces points relèvent d’une étape de déploiement ultérieure, distincte de la pré-production locale décrite ici.

---

## 9. Conclusion

L’environnement défini par le `docker-compose.yml` et les Dockerfiles du projet constitue une **pré-production fonctionnelle** : frontend servi en fichiers statiques par nginx, API Express en mode production, bases MariaDB et MongoDB persistantes et authentifiées, secrets externalisés, sondes de santé et démarrage ordonné des services.

Il fournit une base concrète et reproductible pour un futur déploiement réel, une fois ajoutés notamment le HTTPS, un nom de domaine et les pratiques d’exploitation (sauvegardes, supervision, chaîne CI/CD).
