# Documentation technique — Vite & Gourmand

Document destiné au dossier projet (titre professionnel Développeur Web et Web Mobile).  
Il décrit l’architecture et les réalisations **effectivement présentes** dans le dépôt, en cohérence avec le `README.md` et le `docker-compose.yml` actuels.

---

## 1. Présentation technique du projet

**Vite & Gourmand** est une application web de gestion pour une entreprise de traiteur.

Elle couvre le parcours complet :

- consultation publique du catalogue et des avis validés ;
- inscription et authentification des clients ;
- prise et suivi de commandes avec calcul serveur des montants et des frais de livraison ;
- espaces employés (catalogue, commandes, horaires, modération des avis) ;
- espace administrateur (comptes employés, statistiques et chiffre d’affaires) ;
- contact et e-mails transactionnels.

Sur le plan technique, la solution repose sur :

- un **frontend** React (build Vite) servi par **nginx** en pré-production ;
- une **API REST** Node.js / Express ;
- une base **MariaDB** pour les données métier relationnelles ;
- une base **MongoDB** pour les agrégats statistiques ;
- une orchestration **Docker Compose** configurée pour un environnement de pré-production local.

---

## 2. Architecture générale

```text
Navigateur
    │
    ▼
Frontend (React + Vite → dist / nginx)
    │  HTTP / JSON  (VITE_API_URL)
    ▼
Backend (Express, NODE_ENV=production)
    │
    ├──────────────► MariaDB  (données métier, transactions)
    └──────────────► MongoDB  (statistiques)
```

### Rôle de chaque couche

| Couche | Rôle |
|--------|------|
| **Frontend** | Interface utilisateur, navigation, appels API, contrôle d’accès UI (`ProtectedRoute`), visualisation des statistiques (Chart.js). |
| **Backend** | Exposition de l’API REST, règles métier, authentification / autorisation, calculs financiers et livraison, e-mails, synchronisation des statistiques. |
| **MariaDB** | Persistance des entités métier (utilisateurs, menus, plats, commandes, avis, horaires, etc.) avec contraintes d’intégrité et transactions. |
| **MongoDB** | Stockage des agrégats statistiques (commandes et chiffre d’affaires par menu et période), mis à jour lors du cycle de vie des commandes. |

Le navigateur n’accède jamais directement aux bases de données. Les secrets et URLs sensibles sont fournis par variables d’environnement (fichier `.env` à la racine pour Docker Compose).

---

## 3. Architecture backend

Point d’entrée : `backend/src/app.js` (`npm start` → `node src/app.js`).

Organisation des dossiers sous `backend/src/` :

| Dossier | Responsabilité |
|---------|----------------|
| **routes** | Définition des chemins HTTP et chaînage des middlewares (auth, rôles, rate-limit). |
| **controllers** | Réception de la requête, appel des services, formatage des réponses HTTP et gestion des erreurs exposées au client. |
| **services** | Logique métier (commandes, auth, avis, e-mails, routage ORS, statistiques, catalogues…). |
| **repositories** | Accès aux données pour les commandes (`CommandeRepository`) — requêtes SQL isolées. |
| **models** | Accès MariaDB (menus, plats, utilisateurs, avis, etc.) et modèle Mongoose `Statistique`. |
| **domain** | Objet métier `Commande` (calculs de prix, droits client, normalisation). |
| **middlewares** | JWT (`auth`), auth optionnelle (`optionalAuth`), rechargement compte actif (`activeUser`), rôles (`role`), rate limiting. |
| **config** | Pool MariaDB (`mysql2`) et connexion MongoDB (`mongoose`). |
| **utils** | Utilitaires transverses (`safeErrorMessage`). |

### Principales familles de routes

Montées depuis `backend/src/routes/index.js` :

| Préfixe | Domaine |
|---------|---------|
| `GET /` | Message de disponibilité de l’API |
| `GET /health` | Sonde de liveness (sans effet métier) |
| `/auth` | Connexion (`POST /login`, rate-limité) |
| `/utilisateurs` | Profil, inscription (rate-limité), gestion employés (admin) |
| `/menus`, `/plats`, `/allergenes`, `/themes`, `/regimes` | Catalogue |
| `/commandes` | Cycle de vie des commandes (création rate-limitée) |
| `/livraison` | Estimation des frais (`POST /estimation`, limité côté contrôleur) |
| `/avis` | Consultation / dépôt / modération |
| `/horaires` | Horaires d’ouverture |
| `/statistiques` | Indicateurs admin (rôle administrateur) |
| `/contact` | Formulaire de contact (rate-limité) |

Cette séparation routes → contrôleurs → services → modèles / repositories facilite les tests unitaires des règles métier sans dépendre du transport HTTP.

---

## 4. Architecture frontend

Stack : React, Vite, React Router, Chart.js / react-chartjs-2.

Organisation sous `frontend/src/` :

| Élément | Rôle |
|---------|------|
| **pages/** | Écrans métier (accueil, menus, détail, commande, espaces client / employé / admin, login, contact, mentions, CGV…). |
| **components/** | Éléments réutilisables (`Navbar`, `Footer`, `MenuCard`, `ProtectedRoute`, graphiques statistiques…). |
| **layouts/** | `MainLayout` : structure commune (titre « Vite & Gourmand » lien React Router vers `/`, navigation, pied de page). |
| **hooks/** | Accès simplifié au contexte d’authentification (`useAuth`). |
| **context/** | `AuthContext` : session utilisateur et jeton JWT (stockage `localStorage`). |
| **services/** | Clients HTTP vers l’API (menus, commandes, avis, livraison, statistiques, etc.). |
| **api/** | URL de base de l’API (`VITE_API_URL`). |
| **styles/** | Feuilles de styles globales et par zone. |
| **data/** | Correspondances d’images catalogue (`menuImages.js`, `platImages.js`) vers les assets de `public/images/`. |

### Organisation retenue

- Les **pages** orchestrent les écrans ; la logique d’appel API est centralisée dans les **services**.
- Les routes sensibles sont encapsulées par **`ProtectedRoute`** (contrôle UI sur `role_id`) ; la sécurité réelle reste garantie par l’API.
- En pré-production Docker, le frontend n’est plus servi par le serveur de développement Vite : l’image construit le dossier `dist/` puis **nginx** sert les fichiers statiques avec fallback SPA (`try_files` → `index.html`). Les assets hashés sous `/assets/` peuvent être mis en cache longtemps (`immutable`) ; `index.html` et les routes SPA sont servis sans cache longue durée afin d’éviter qu’un HTML périmé pointe vers un ancien bundle.

---

## 5. Base de données

### 5.1 MariaDB — données métier

**Rôle :** stocker les entités relationnelles, garantir l’intégrité référentielle et supporter les transactions (stock menu / commandes).

**Principales tables** (fichier `database/vite_gourmand.sql`) :

| Table | Contenu |
|-------|---------|
| `role` | Client, Employé, Administrateur |
| `utilisateur` | Comptes (e-mail unique, mot de passe hashé, profil, `actif`) |
| `menu` / `plat` / `menu_plat` | Catalogue et associations |
| `theme` / `regime` | Critères de filtrage des menus |
| `allergene` / `plat_allergene` | Allergènes liés aux plats |
| `commande` | Commandes (montants, adresse, `distance_km`, statut, annulation…) |
| `avis` | Avis clients et statut de modération |
| `horaire` | Jours et plages d’ouverture |

**Relations clés :**

- un utilisateur possède un rôle ;
- une commande relie un client et un menu ;
- un menu regroupe plusieurs plats (`menu_plat`) ;
- un plat peut avoir plusieurs allergènes ;
- un avis est rattaché à un utilisateur.

À l’init d’un **volume MariaDB vierge**, Docker Compose enchaîne :

1. `01-vite_gourmand.sql` — schéma + seed (3 menus, 9 plats, 3 commandes historiques) ;
2. `02-validate-schema.sh` — tables critiques présentes ;
3. `03-enrich_catalogue_menus.sql` — enrichissement idempotent → **8 menus, 19 plats, 26** liens `menu_plat` ;
4. `04-validate-catalogue.sh` — contrôle exact des effectifs (8 / 19 / 26, 0 plat orphelin).

Menus conservés (ids non renumérotés) : 1–6, 8, 15. Cocktail Dinatoire et Brunch Festif ont quatre plats ; les six autres en ont trois. Des recettes sont mutualisées via `menu_plat`.

Sur un volume **déjà existant**, ces scripts ne sont pas rejoués. Pour compléter un catalogue resté à 3 menus sans recréer le volume : `database/apply-enrich-catalogue.sh`. Pour une base déjà enrichie à un état intermédiaire (ex. 8 menus / 24 plats) : scripts manuels `preview_catalogue_*.sql` / `migrate_catalogue_*.sql` (ne pas les monter dans `docker-entrypoint-initdb.d`). **Ne pas** utiliser `docker compose down -v` comme étape de mise à jour ordinaire (suppression des volumes).

Le seed inclut **trois** commandes historiques (`CMD-2026-001` Terminée, `CMD-2026-002` En préparation, `CMD-2026-003` Annulée). D’éventuelles commandes supplémentaires ajoutées en local (ex. script `insert_commandes_demo.sql` pour `CMD-2026-004` à `006`) ne font **pas** partie de l’initialisation standard ni d’un futur déploiement AWS tant qu’elles n’y sont pas rejouées. Sur une base locale ainsi enrichie, un `stats:resync` peut produire par exemple un volume de 5 (hors annulée) et un CA de 1 484,50 € pour les seules commandes aux statuts CA — chiffres de **démonstration locale**, non de production.

**Images catalogue :** **8** WebP menus + **19** WebP plats + **1** placeholder SVG sous `frontend/public/images/`, inclus dans le build nginx (format cible courant : 1 200 × 750, WebP). Mapping frontend (`menuImages.js`, `platImages.js`) — pas de chemin stocké en MariaDB pour l’affichage public, pas d’upload depuis l’UI employé. La colonne `plat.photo` (BLOB) existe pour compatibilité schéma / API mais n’est pas renseignée par le seed ni par l’interface employé. Les trois anciennes photos génériques de menus ont été retirées.

Les scripts `alter_commande_*.sql` et `update_plats_menu_vegan.sql` sont **historiques** : leurs évolutions sont déjà présentes dans le seed actuel. Ne pas les réappliquer sur une base initialisée via `vite_gourmand.sql`.

### 5.2 MongoDB — statistiques

**Rôle :** conserver des agrégats analytiques sans alourdir les requêtes métier MariaDB.

**Collection** (modèle Mongoose `Statistique` → collection `statistiques`) :

| Champ | Description |
|-------|-------------|
| `menu_id` | Identifiant du menu (référence logique MariaDB) |
| `nom_menu` | Libellé du menu |
| `nombre_commandes` | Volume de commandes pour la période (hors **Annulée**) |
| `chiffre_affaires` | Cumul `prix_menu + prix_livraison` des commandes réputées réglées à la livraison |
| `periode` | Période d’agrégation (chaîne `YYYY-MM`) |

**Règle métier du chiffre d’affaires** (`Commande.STATUTS_CHIFFRE_AFFAIRES`) : le CA n’est comptabilisé que si le statut ∈ { **Livrée**, **En attente du retour de matériel**, **Terminée** }. Les commandes en attente, acceptées, en préparation ou en livraison n’alimentent pas le CA. Il n’existe pas de module de paiement bancaire : ces agrégats ne prouvent pas un encaissement réel.

**Synchronisation avec les commandes** (service statistiques, appelé depuis le service commandes) :

| Événement | Effet MongoDB |
|-----------|----------------|
| Création de commande | +1 sur `nombre_commandes` ; **CA inchangé** (`deltaCA = 0`) |
| Transition de statut | Ajustement du CA à l’entrée / sortie d’un statut « réglé » (évite le double comptage) |
| Modification tarifaire | Delta CA uniquement si la commande contribue déjà au CA |
| Annulation | −1 commande ; − CA seulement si le statut avant annulation contribuait au CA |

Mise à jour **best-effort** après commit MariaDB : un échec Mongo est journalisé sans annuler la commande. Réalignement possible via `npm run stats:resync` dans `backend/` (`scripts/resync-statistiques.js`), qui reconstruit volume et CA selon la même règle à partir de MariaDB.

La connexion utilise `MONGO_URI` (utilisateur applicatif authentifié en environnement Compose).

---

## 6. Authentification et gestion des rôles

### JWT

- Connexion : `POST /auth/login` compare le mot de passe avec **bcrypt**, vérifie le compte `actif`, puis signe un JWT (`JWT_SECRET`, `JWT_EXPIRES`).
- Payload typique : `utilisateur_id`, `role_id`, `email`.
- Le frontend envoie le jeton en en-tête `Authorization: Bearer …`.

### Middlewares

| Middleware | Rôle |
|------------|------|
| `auth.middleware.js` | Exige un Bearer JWT valide (algorithme `HS256`) ; recharge le compte en base via `activeUser` ; refuse un compte inactif ; renseigne `req.user` avec les données actuelles (`utilisateur_id`, `role_id`, `email`). |
| `optionalAuth.middleware.js` | Attache `req.user` si un JWT valide appartient à un compte **actif** ; sinon traite la requête comme anonyme (avis publics vs staff). |
| `activeUser.js` | Charge l’utilisateur par `utilisateur_id` et vérifie `actif`. |
| `role.middleware.js` | Autorise uniquement les `role_id` passés en argument. |
| `rateLimit.middleware.js` | Limiteurs login, contact, inscription et création de commande. |

### Permissions

| Rôle | `role_id` | Accès principaux |
|------|-----------|------------------|
| Client | 1 | Commandes personnelles, estimation livraison, dépôt d’avis, profil |
| Employé | 2 | CRUD catalogue, traitement des commandes, horaires, modération des avis |
| Administrateur | 3 | Droits employés + gestion des comptes employés + statistiques |

L’inscription publique force le rôle **Client** (`role_id` du body ignoré). La création d’employé est réservée à l’administrateur.

Le contrôle UI (`ProtectedRoute`) complète l’expérience, mais **ne remplace pas** les middlewares serveur.

---

## 7. Gestion des commandes

### Création

1. Client authentifié (`role_id` 1).
2. Validation métier (menu, dates, adresse, effectif, stock…).
3. Calcul serveur exclusif des montants (le client ne fixe pas les prix).
4. Transaction MariaDB : insertion commande + mise à jour du stock menu (`CommandeRepository` + modèle menu).
5. Après commit : e-mail de confirmation (best effort ; en local souvent en mode `log`) + mise à jour statistique MongoDB.

Le domaine `Commande` centralise notamment :

- le calcul du prix menu (remise 10 % si effectif ≥ minimum menu + 5) ;
- le total (prix menu + livraison) ;
- les droits de modification / annulation côté client (statut « En attente » uniquement).

### Statuts

Statuts gérés : En attente, Acceptée, En préparation, En cours de livraison, Livrée, En attente du retour de matériel, Terminée, Annulée.

- **Client** : modification / annulation seulement si « En attente ».
- **Employé / Admin** : changement de statut, annulation avec motif et mode de contact.

Les annulations restaurent le stock dans une transaction et déclenchent la décrémentation statistique MongoDB ainsi qu’un e-mail d’annulation.

### Suppression définitive

`DELETE /commandes/:id` (employé / administrateur) n’est autorisé que si la commande est déjà au statut **Annulée**.
Choix conservateur : l’annulation a déjà restauré le stock et ajusté MongoDB ; on ne détruit pas l’historique d’une commande active. Tenter de supprimer une commande non annulée renvoie une erreur métier.

### Statistiques

Voir section 10 : chaque création, ajustement de montant ou annulation met à jour les agrégats MongoDB sans bloquer le succès métier MariaDB en cas d’échec Mongo (journalisation d’erreur).

---

## 8. Livraison

Le calcul est **exclusivement serveur** (service `routing.service.js`, endpoint `POST /livraison/estimation` pour le client authentifié).

### OpenRouteService

- Géocodage de l’adresse de livraison et calcul d’itinéraire depuis les coordonnées du siège (`CATERER_LATITUDE`, `CATERER_LONGITUDE`, `CATERER_ADDRESS`).
- Clé API : `ORS_API_KEY` (backend uniquement, jamais exposée au frontend).
- En cas d’indisponibilité ORS ou d’adresse inexploitable : erreur explicite (pas de frais à 0 € silencieux).

### Règles tarifaires

| Situation | Tarif |
|-----------|--------|
| Livraison dans la commune de **Bordeaux** | Gratuite (`prix_livraison = 0`) |
| Hors Bordeaux | `5 + 0,59 × distance_km` (distance routière, arrondi métier) |

À la création / modification de commande, si l’adresse change, le backend recalcule distance et frais ; les valeurs éventuelles envoyées par le client sont ignorées.

Un rate limiting applicatif protège également l’endpoint d’estimation (limitation par utilisateur côté contrôleur livraison).

---

## 9. Système d’e-mails

Service central : `email.service.js` + templates HTML échappés (`email.templates.js`).

### Modes

| `EMAIL_PROVIDER` | Comportement |
|------------------|--------------|
| `log` (défaut local) | Aucun appel réseau ; contenu journalisé (simulation locale / CI). |
| `resend` | Envoi réel via l’API Resend (`RESEND_API_KEY`, `EMAIL_FROM`) lorsque la clé est fournie hors dépôt. |

Les parcours e-mail (contact, bienvenue, confirmation / annulation de commande) sont **implémentés** dans le code. En développement et préproduction locale, le mode `log` est utilisé par défaut. L’envoi réel dépend de la configuration Resend et n’est pas revendiqué comme déjà validé en production publique.

### Types d’e-mails

| Type | Déclencheur |
|------|-------------|
| Contact (notification) | Formulaire `/contact` → destinataire `CONTACT_TO` |
| Accusé de réception contact | Même parcours, vers l’expéditeur (best effort) |
| Bienvenue | Après inscription client (non bloquant) |
| Confirmation de commande | Après création réussie (après commit) |
| Annulation de commande | Après annulation (client, employé ou statut Annulée) |

---

## 10. Statistiques MongoDB

### Structure

Documents `statistiques` : `menu_id`, `nom_menu`, `nombre_commandes`, `chiffre_affaires`, `periode`.

### Synchronisation

Implémentée dans `statistique.service.js` via `appliquerDeltaStatistique` et les façades :

- `updateStatistiqueCommande` (création : +1 volume, CA inchangé) ;
- `synchroniserChiffreAffairesSelonStatut` (entrée / sortie des statuts CA) ;
- `ajusterStatistiqueCommande` (delta CA seul, ex. modification tarifaire si déjà réglée) ;
- `retirerStatistiqueCommande` (annulation : −1 volume, −CA si déjà réglée).

Approche **best-effort** : l’échec Mongo après une opération MariaDB réussie est journalisé ; `npm run stats:resync` reconstruit les agrégats sans doublon.

### Indicateurs exploités côté admin

L’API `/statistiques` (rôle administrateur) alimente les écrans :

- volume de commandes et chiffre d’affaires par menu / période (graphiques Chart.js) ;
- le CA affiché suit la règle des statuts « réglés à la livraison », distincte du simple volume.

---

## 11. Sécurité

| Mesure | Mise en œuvre |
|--------|----------------|
| **JWT** | Signature serveur, middleware sur les routes protégées |
| **bcrypt** | Hash des mots de passe ; règles de complexité à l’inscription |
| **Rôles** | `roleMiddleware` sur les opérations sensibles |
| **SQL paramétré** | Placeholders `mysql2` (pas de concaténation utilisateur dans le SQL) |
| **Rate limiting** | Login : 5 / 15 min ; Contact : 10 / h ; Inscription : 10 / h ; Création commande : 30 / 15 min (`express-rate-limit`) ; estimation livraison limitée côté contrôleur |
| **Comptes désactivés** | Recontrôle `actif` à chaque requête JWT (auth / optionalAuth) |
| **TRUST_PROXY** | Opt-in (`0` par défaut) ; `1` derrière un reverse proxy unique |
| **Erreurs client** | `safeErrorMessage` : messages techniques / SQL / TypeError remplacés par un message générique |
| **Secrets** | `.env` + interpolation Compose `${VAR:?…}` ; pas de secret de production en dur |
| **CORS** | Origine unique `CORS_ORIGIN` (obligatoire si `NODE_ENV=production`) |
| **Avis publics** | Sans JWT staff : uniquement statut **Validé** ; employés / admins voient l’ensemble |
| **MongoDB** | Authentification (root + utilisateur applicatif) ; port hôte non publié |
| **MariaDB** | Utilisateur applicatif + mot de passe root obligatoires ; port hôte non publié |
| **Processus backend** | Utilisateur Linux `node` (non-root) dans l’image Docker |

Le token JWT est stocké côté navigateur (`localStorage`) : pratique courante pour une SPA, avec les précautions XSS habituelles.

---

## 12. Conteneurisation Docker

### Dockerfiles

| Image | Principe |
|-------|----------|
| `frontend/Dockerfile` | Stage build (`npm ci`, `npm run build` avec `VITE_API_URL`) → stage **nginx:alpine** servant `dist/` + `nginx.conf` (SPA, cache assets / no-cache `index.html`). |
| `backend/Dockerfile` | `node:24-bookworm-slim`, `npm ci --omit=dev`, `NODE_ENV=production`, utilisateur `node`, `CMD ["node", "src/app.js"]`. |

### docker-compose.yml

Quatre services : `frontend`, `backend`, `mysql` (`mariadb:10.11`), `mongo` (`mongo:7`). Pas de volume applicatif monté sur frontend/backend : toute modification du code ou des assets frontend impose un **rebuild** de l’image concernée.

| Élément | Détail |
|---------|--------|
| **Réseau** | Bridge `vite-gourmand` |
| **Volumes** | `mysql_data`, `mongo_data` |
| **Init MariaDB** | `vite_gourmand.sql` → `02-validate-schema.sh` → `enrich_catalogue_menus.sql` → `04-validate-catalogue.sh` (volume vierge uniquement) |
| **Init Mongo** | `mongo-init-app-user.sh` (utilisateur `readWrite`) |
| **Ports hôte** | Frontend **5173**, backend **3000** ; MariaDB et Mongo **non publiés** (accès via `docker compose exec`) |
| **Dépendances** | Backend attend MariaDB et Mongo **healthy** ; frontend dépend de backend |
| **Restart** | `unless-stopped` |

Un éventuel fichier Compose local (ex. publication de ports MariaDB/Mongo sur `127.0.0.1` pour DBeaver / Compass) est **ignoré par Git** et ne fait pas partie de l’installation standard du dépôt.

### Variables d’environnement

Fichier modèle : `.env.example`.  
Compose exige notamment : `VITE_API_URL`, `CORS_ORIGIN`, `FRONTEND_URL`, `JWT_*`, `EMAIL_*`, credentials MariaDB / Mongo, `MONGO_URI`.

`VITE_API_URL` est un **build-arg** frontend : toute modification impose un rebuild de l’image frontend.

---

## 13. Pré-production

L’environnement Docker actuel n’est plus un simple setup de développement (pas de bind mount applicatif, pas de `vite dev` dans l’image frontend).

| Aspect | Réalisation |
|--------|-------------|
| Frontend | Build Vite de production + **nginx**, fallback React Router |
| Backend | `NODE_ENV=production`, dépendances de prod uniquement |
| Utilisateur non-root | Processus `node` (uid 1000) dans le conteneur backend |
| Healthchecks | MariaDB, Mongo (auth), backend (`fetch` sur `/health`) |
| Endpoint `/health` | `{"status":"ok"}` — liveness sans I/O métier |
| Arrêt propre | Handlers **SIGTERM** / **SIGINT** : fermeture HTTP → pool MariaDB → déconnexion Mongo |
| Secrets | Fichier `.env` obligatoire ; échec Compose si variables critiques absentes |
| BDD | Auth Mongo ; utilisateurs MariaDB non triviaux ; validation de schéma à l’init |
| Réseau | Services isolés sur `vite-gourmand` |

**Limites avant production publique :** HTTPS / domaine, CI/CD, sauvegardes automatiques, clés ORS / Resend de production. Une instance **AWS EC2** (Ubuntu, Docker / Compose, dépôt cloné, réseau initial) a pu être préparée côté infrastructure, mais l’application **n’est pas déployée publiquement** : pas d’URL publique opérationnelle, pas de certificat HTTPS de production ni de mesures de disponibilité en ligne documentées ici. Les URL `localhost` restent réservées à l’environnement local.

---

## 14. Tests

Les tests automatisés s’exécutent avec le moteur natif Node.js (`node --test`).

```bash
cd backend && npm test
cd frontend && npm test
```

### Résultats vérifiés localement (branche de développement)

| Suite | Commande | Résultat constaté |
|-------|----------|-------------------|
| Backend | `npm test` (liste des fichiers dans `backend/package.json`) | **236 / 236** réussis |
| Frontend | `npm test` (`src/data/*.test.js` — mappings images) | **9 / 9** réussis |

Ces chiffres correspondent à une exécution locale des suites automatisées ; ils ne couvrent pas à eux seuls l’ensemble des parcours métier (commande complète, UI admin, déploiement AWS).

### Suites backend présentes dans le dépôt

| Fichier | Périmètre |
|---------|-----------|
| `domain/Commande.test.js` | Calculs de prix, droits client, normalisation, statuts CA |
| `repositories/CommandeRepository.test.js` | Persistance commandes (mocks SQL) |
| `services/commande.service.test.js` | Création, annulation, modification, transactions, stats, e-mails |
| `services/routing.service.test.js` | ORS, Bordeaux / hors Bordeaux, erreurs 503 |
| `services/statistique.service.test.js` | Deltas Mongo, transitions CA, resync |
| `services/avis.service.test.js` | Règles de dépôt / filtres publics |
| `services/auth.service.test.js` | Login, comptes inactifs, payload JWT |
| `services/email.service.test.js` / `email.templates.test.js` | Modes log / Resend, templates |
| `controllers/contact.controller.test.js` | Validation contact |
| `services/menu.service.test.js` / `models/menu.model.test.js` | Menus enrichis |
| `services/utilisateur.service.test.js` | Inscription client / création employé |
| `middlewares/activeUser.test.js` | Recontrôle compte actif |
| `utils/safeErrorMessage.test.js` | Filtrage des messages techniques |

### Contrôles manuels / SQL (hors `npm test`)

En complément, selon les besoins : parcours navigateur (catalogue, lien header, commande, estimation livraison, espaces employés / admin), `GET /health`, validation catalogue MariaDB (`04-validate-catalogue.sh` ou requêtes équivalentes), URLs des 27 images WebP/SVG, et éventuellement `stats:resync` après modifications SQL directes.

---

## Conclusion

L’architecture de **Vite & Gourmand** sépare clairement présentation, API et données, tout en isolant les statistiques dans MongoDB.  
Les règles métier sensibles (montants, livraison, stock, avis, rôles) sont appliquées côté serveur.  
La conteneurisation actuelle constitue une **pré-production** cohérente (images de production, secrets externalisés, bases authentifiées, sondes de santé), prête à servir de base à un déploiement réel après ajout de HTTPS, d’un domaine et des pratiques d’exploitation (sauvegardes, supervision).

Ce document peut être repris et adapté dans le dossier projet du titre professionnel, en lien avec le `README.md`, les règles métiers (`docs/conception/02-regles-metiers.md`) et les diagrammes du dossier `docs/diagrammes/`.
