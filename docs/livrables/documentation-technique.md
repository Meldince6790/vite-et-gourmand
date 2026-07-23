# Documentation technique - Vite & Gourmand

## 1. Présentation générale du projet

**Vite & Gourmand** est une application web de gestion destinée à une entreprise de traiteur.

L'objectif du projet est de proposer une solution permettant de gérer les différents acteurs de l'entreprise ainsi que les processus métier associés :

- consultation des menus proposés ;
- gestion des plats et des menus ;
- gestion des commandes clients ;
- gestion des utilisateurs selon leurs rôles ;
- suivi statistique de l'activité ;
- consultation du chiffre d'affaires généré.

L'application a été conçue selon une architecture séparant clairement :

- l'interface utilisateur développée en React ;
- une API REST développée avec Node.js et Express ;
- une base de données relationnelle MySQL/MariaDB pour les données métier ;
- une base MongoDB dédiée aux statistiques.

Cette séparation permet d'améliorer la maintenabilité, la sécurité et l'évolution future de l'application.

---

# 2. Réflexions initiales et choix technologiques

## 2.1 Choix du frontend

### Technologies utilisées

- React
- Vite
- React Router
- Chart.js

### Justification

Le choix de React a été fait afin de développer une interface utilisateur moderne basée sur des composants réutilisables.

L'utilisation d'une architecture en composants permet :

- de faciliter la maintenance du code ;
- d'éviter la duplication ;
- de séparer les responsabilités entre les différentes parties de l'interface.

Vite a été choisi comme outil de développement afin de bénéficier :

- d'un démarrage rapide du serveur local ;
- d'un système de compilation optimisé ;
- d'une configuration légère adaptée au projet.

React Router permet la gestion de la navigation entre les différentes pages de l'application.

Chart.js est utilisé pour représenter graphiquement les données statistiques destinées aux administrateurs.

---

## 2.2 Choix du backend

### Technologies utilisées

- Node.js
- Express.js

### Justification

Node.js a été choisi afin d'utiliser un environnement JavaScript côté serveur, permettant d'avoir une cohérence technologique entre le frontend et le backend.

Express.js permet de construire une API REST légère et structurée.

L'API assure :

- la communication entre le frontend et les bases de données ;
- l'application des règles métier ;
- la gestion de l'authentification ;
- le contrôle des autorisations selon les rôles utilisateurs.

---

## 2.3 Choix des bases de données

### MySQL / MariaDB

MySQL/MariaDB est utilisé pour stocker les données métier principales :

- utilisateurs ;
- rôles ;
- menus ;
- plats ;
- commandes ;
- allergènes ;
- régimes alimentaires ;
- thèmes ;
- horaires.

Le modèle relationnel a été privilégié car les données présentent de nombreuses relations :

- un menu contient plusieurs plats ;
- un plat peut appartenir à plusieurs menus ;
- un utilisateur possède un rôle ;
- une commande est liée à un client et un menu.

Les contraintes relationnelles permettent également de garantir la cohérence des données.

### MongoDB

MongoDB est utilisé uniquement pour la partie statistique.

Ce choix permet de séparer les données métier des données d'analyse.

MongoDB stocke notamment :

- le nombre de commandes par menu ;
- les informations nécessaires aux graphiques statistiques ;
- les données utilisées pour le calcul du chiffre d'affaires.

Cette séparation permet d'éviter de surcharger la base métier avec des données calculées.

---

## 2.4 Choix de l’architecture générale

L’architecture de l’application **Vite & Gourmand** a été pensée afin de séparer clairement les différentes responsabilités du projet.

Le choix retenu est une architecture en trois couches :

- une interface utilisateur développée avec React ;
- une API REST développée avec Node.js et Express ;
- des bases de données spécialisées selon les besoins fonctionnels.

Cette séparation permet :

- une meilleure maintenabilité du code ;
- une évolution plus simple de l’application ;
- une séparation claire entre l’affichage, la logique métier et le stockage des données ;
- une meilleure sécurisation des échanges entre les différentes parties.

L’architecture générale retenue est la suivante :

```
Utilisateur
    |
    v
Frontend React
    |
    v
API REST Express
    |
    +----------------+
    |                |
    v                v
MySQL/MariaDB     MongoDB
Données métier    Statistiques
```

---

## 2.5 Choix du frontend

Le framework **React** a été choisi pour développer l’interface utilisateur.

Ce choix est motivé par plusieurs avantages :

- création d’interfaces dynamiques basées sur des composants réutilisables ;
- séparation des différentes fonctionnalités de l’application ;
- gestion simplifiée de l’état de l’application ;
- large communauté et nombreuses ressources disponibles.

L’utilisation de **Vite** permet également :

- un démarrage rapide du projet ;
- un environnement de développement performant ;
- une génération optimisée de l’application finale.

Les principales technologies utilisées côté frontend sont :

- React ;
- Vite ;
- React Router pour la gestion des routes ;
- Chart.js pour l’affichage des statistiques sous forme graphique.

---

## 2.6 Choix du backend

Le backend repose sur **Node.js** associé au framework **Express.js**.

Ce choix permet :

- de développer une API REST légère et performante ;
- d'utiliser JavaScript sur l'ensemble de la chaîne de développement ;
- de structurer l'application avec des contrôleurs, services et modèles ;
- de gérer les règles métier côté serveur.

L’API backend assure notamment :

- l’authentification des utilisateurs ;
- la gestion des rôles ;
- la validation des données ;
- les opérations CRUD sur les différentes ressources ;
- le calcul et l’enregistrement des statistiques.

---

## 2.7 Choix des bases de données

Deux solutions de stockage ont été utilisées afin d’adapter la technologie aux besoins fonctionnels.

### MySQL / MariaDB

MySQL (via MariaDB avec XAMPP) est utilisé pour les données métier.

Ce choix est adapté aux données nécessitant :

- une structure relationnelle claire ;
- des relations entre entités ;
- des contraintes d’intégrité ;
- des opérations transactionnelles.

Les données stockées concernent notamment :

- les utilisateurs ;
- les rôles ;
- les menus ;
- les plats ;
- les commandes ;
- les allergènes ;
- les régimes alimentaires ;
- les thèmes ;
- les horaires.

### MongoDB

MongoDB est utilisé pour la partie statistique.

Ce choix permet :

- une structure plus flexible pour les données analytiques ;
- une séparation entre les données métier et les données statistiques ;
- une évolution plus simple des indicateurs calculés.

MongoDB permet notamment de stocker :

- le nombre de commandes par menu ;
- les performances des menus ;
- le chiffre d’affaires généré.

---

## 2.8 Gestion de l’authentification et de la sécurité

La sécurité a été prise en compte dès la conception de l’application.

Le système d’authentification repose sur :

- une authentification par JWT ;
- une vérification du token côté serveur ;
- une gestion des droits selon le rôle utilisateur.

Trois rôles principaux sont définis :

| Rôle           | Droits                                          |
| -------------- | ----------------------------------------------- |
| Client         | Consultation des menus et création de commandes |
| Employé        | Gestion des menus, plats, commandes et horaires |
| Administrateur | Gestion des employés et accès aux statistiques  |

Les principales mesures de sécurité mises en place sont :

- validation des données reçues par l’API ;
- contrôle des autorisations avant chaque action sensible ;
- stockage sécurisé des mots de passe ;
- utilisation de requêtes paramétrées pour limiter les risques d’injection SQL ;
- absence d’exposition des informations sensibles dans les réponses API.

---

## 2.9 Organisation du développement

Le développement de l'application a été organisé en différentes phases afin de structurer l'avancement du projet et suivre les objectifs définis.

Le projet a été découpé en plusieurs sprints correspondant aux grandes étapes de réalisation :

- analyse et conception de la solution ;
- modélisation des données et des fonctionnalités ;
- développement de l'API backend ;
- développement de l'interface frontend ;
- intégration et validation des fonctionnalités ;
- finalisation de la documentation et préparation du déploiement.

Cette organisation par étapes a permis de suivre l'évolution du projet, de prioriser les fonctionnalités principales et de valider progressivement les différents éléments développés.

---

# 2.10 Modélisation de l'application

Afin de préparer la réalisation de l'application, plusieurs éléments de modélisation ont été réalisés durant la phase de conception.

Ces éléments permettent de représenter la structure de l'application, les interactions entre les acteurs et les échanges entre les différents composants techniques.

---

## 2.10.1 Diagramme de classes

Le diagramme de classes présente la structure statique de l'application.

Il permet d'identifier :

- les principales entités métier ;
- leurs attributs ;
- leurs relations ;
- les associations nécessaires au fonctionnement de l'application.

Ce diagramme a notamment servi de base pour la conception de la base de données relationnelle MySQL/MariaDB.

---

## 2.10.2 Diagramme de cas d'utilisation

Le diagramme de cas d'utilisation permet de représenter les interactions entre les acteurs et l'application.

Les acteurs identifiés sont :

- Visiteur ;
- Client ;
- Employé ;
- Administrateur.

Il permet de visualiser les fonctionnalités accessibles selon les rôles utilisateurs :

- consultation des menus ;
- gestion des commandes ;
- gestion des menus et des plats ;
- gestion des avis clients ;
- gestion des comptes employés ;
- consultation des statistiques.

---

## 2.10.3 Diagramme de séquence

Le diagramme de séquence illustre le déroulement d'une fonctionnalité métier à travers les échanges entre les différents composants de l'application.

Le scénario choisi correspond à la création d'une commande par un Client.

Il représente les interactions entre :

- le Client ;
- l'interface frontend React ;
- l'API backend Express ;
- le middleware d'authentification JWT ;
- le service de gestion des commandes ;
- la base de données MySQL/MariaDB.

Ce diagramme permet de comprendre le cheminement d'une requête depuis l'action utilisateur jusqu'à l'enregistrement des données.

## 2.11 Conclusion des choix techniques

Les choix technologiques réalisés répondent aux objectifs du projet :

- React et Vite permettent une interface moderne et évolutive ;
- Node.js et Express offrent une API claire et maintenable ;
- MySQL assure la cohérence des données métier ;
- MongoDB répond aux besoins spécifiques liés aux statistiques ;
- l’utilisation d’une architecture séparée améliore la sécurité et la qualité globale de l’application.

Ces choix permettent de proposer une solution adaptée aux besoins d’une entreprise de traiteur tout en conservant une structure facilement maintenable et évolutive.

---

# 3. Configuration de l'environnement de travail

## 3.1 Environnement matériel et logiciel

Le développement de l'application a été réalisé dans un environnement local permettant de reproduire les conditions nécessaires au fonctionnement de l'application.

### Outils utilisés

- Visual Studio Code : éditeur de développement ;
- Git : gestionnaire de versions ;
- GitHub : hébergement du dépôt et suivi du développement ;
- XAMPP : environnement local permettant d'exécuter MariaDB/MySQL ;
- MongoDB : stockage des données statistiques ;
- Node.js : environnement d'exécution du backend.

---

## 3.2 Versions utilisées

Les principales versions utilisées durant le développement sont :

| Technologie | Version                                                |
| ----------- | ------------------------------------------------------ |
| Node.js     | 24.x                                                   |
| npm         | 11.x                                                   |
| React       | 19.x                                                   |
| Vite        | Dernière version stable utilisée lors du développement |
| Express.js  | 5.x                                                    |
| MariaDB     | 10.4.x                                                 |
| MongoDB     | Version compatible avec l'environnement local          |

---

## 3.3 Organisation du développement

Le développement de l'application **Vite & Gourmand** a été organisé selon une approche progressive basée sur plusieurs phases de travail.

Le projet a été découpé en sprints afin de structurer l'avancement et de suivre les différentes étapes nécessaires à la réalisation de l'application.

Les différentes phases réalisées sont :

### Sprint 1 : Préparation de l'environnement

Cette première phase a permis de mettre en place l'environnement de développement :

- installation et configuration des outils nécessaires ;
- création du dépôt Git ;
- préparation de la structure générale du projet ;
- configuration des environnements frontend et backend.

---

### Sprint 2 : Analyse et conception

Cette phase a été consacrée à l'étude du besoin et à la modélisation de la solution.

Les travaux réalisés comprennent :

- analyse du cahier des charges ;
- identification des acteurs et fonctionnalités ;
- rédaction des règles métier ;
- réalisation des cas d'utilisation ;
- création du modèle de données ;
- réalisation des diagrammes nécessaires à la conception.

---

### Sprint 3 : Développement backend

Cette phase correspond à la création de la partie serveur de l'application.

Les fonctionnalités développées sont :

- mise en place de l'API REST avec Express.js ;
- connexion à la base de données MySQL/MariaDB ;
- création des modèles et contrôleurs ;
- développement des routes API ;
- gestion des utilisateurs ;
- mise en place de l'authentification JWT ;
- gestion des rôles et des autorisations ;
- développement des règles métier liées aux menus, plats et commandes.

---

### Sprint 4 : Développement frontend

Cette phase a permis de développer l'interface utilisateur avec React.

Les éléments réalisés sont :

- création des différentes pages de l'application ;
- mise en place du routage avec React Router ;
- création de composants réutilisables ;
- connexion avec l'API backend ;
- affichage des menus ;
- gestion des interfaces selon les rôles utilisateurs ;
- intégration des graphiques statistiques.

---

### Sprint 5 : Tests et validation

Cette phase a permis de vérifier le fonctionnement global de l'application.

Les tests réalisés concernent notamment :

- vérification des appels API ;
- validation des droits d'accès selon les rôles ;
- contrôle du fonctionnement des fonctionnalités principales ;
- correction des erreurs rencontrées ;
- vérification de l'intégration frontend/backend.

---

### Sprint 6 : Finalisation et préparation du rendu

Cette dernière phase est consacrée à la finalisation du projet.

Les actions réalisées sont :

- rédaction des documentations demandées ;
- préparation des données de démonstration ;
- vérification de la structure du dépôt ;
- préparation du déploiement ;
- validation finale de l'application.

---

## 3.4 Gestion du versionnement

Le projet utilise Git comme outil de gestion de versions afin de conserver un historique des modifications et assurer le suivi du développement.

Le dépôt utilise une branche principale :

- `main` : contient la version stable de l'application.

Les évolutions du projet ont été enregistrées sous forme de commits réguliers permettant de suivre :

- l'ajout des fonctionnalités ;
- les corrections techniques ;
- les modifications de structure ;
- l'ajout des éléments de documentation.

Une attention particulière a été portée à la clarté des messages de commit afin de faciliter la compréhension de l'historique du projet.

Cette organisation permet également de faciliter la maintenance et les évolutions futures de l'application.

## 3.5 Déploiement de l'application

Le déploiement de l'application **Vite & Gourmand** repose sur une séparation entre les différentes parties du projet :

- le frontend React ;
- l'API backend Express ;
- les bases de données MySQL/MariaDB et MongoDB.

Cette séparation permet de déployer chaque partie indépendamment selon les besoins de l'environnement cible.

---

## 3.5.1 Préparation de l'environnement

Avant le déploiement, plusieurs éléments doivent être configurés :

- installation des dépendances frontend et backend ;
- configuration des variables d'environnement ;
- préparation des bases de données ;
- import des données nécessaires au fonctionnement de l'application.

Les informations sensibles, comme les identifiants de connexion aux bases de données ou la clé secrète JWT, sont stockées dans des variables d'environnement et ne sont pas intégrées directement dans le code source.

---

## 3.5.2 Déploiement de la base de données

La partie métier de l'application repose sur une base de données relationnelle MySQL/MariaDB.

Le déploiement de la base de données nécessite :

1. La création de la base de données :

```sql
CREATE DATABASE vite_gourmand;
```

2. L'import du fichier SQL fourni dans le dépôt :

```text
database/vite_gourmand.sql
```

Ce fichier contient :

- la création des tables ;
- la définition des clés primaires et étrangères ;
- les relations entre les différentes entités ;
- l'intégration des données nécessaires aux tests et à la démonstration.

La base de données MySQL/MariaDB stocke les principales données métier :

- utilisateurs et rôles ;
- menus ;
- plats ;
- associations entre menus et plats ;
- allergènes ;
- régimes alimentaires ;
- thèmes ;
- commandes ;
- horaires.

---

La partie statistique de l'application repose sur MongoDB.

Une base dédiée est utilisée afin de conserver les données nécessaires aux analyses :

- nombre de commandes par menu ;
- suivi des performances des menus ;
- calcul du chiffre d'affaires généré.

La connexion à MongoDB est configurée grâce aux variables d'environnement du backend afin de ne pas exposer les informations sensibles dans le code source.

---

## 3.5.3 Déploiement du backend

Le backend développé avec Node.js et Express nécessite l'installation des dépendances avant son lancement.

Depuis le dossier backend :

```bash
cd backend
npm install
```

La configuration de l'application est réalisée grâce à un fichier `.env` contenant les paramètres nécessaires :

```env
PORT=3000

DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=vite_gourmand
DB_PORT=3306

JWT_SECRET=
JWT_EXPIRES=

MONGO_URI=
```

Les variables d'environnement permettent de séparer la configuration du code source et de sécuriser les informations sensibles.

Le serveur backend peut ensuite être démarré avec :

```bash
npm start
```

Une fois lancé, le backend expose une API REST permettant :

- la gestion des utilisateurs ;
- la consultation et la gestion des menus ;
- la gestion des plats ;
- la gestion des commandes ;
- l'accès aux statistiques.

---

## 3.5.4 Déploiement du frontend

Le frontend de l'application utilise React avec Vite.

Depuis le dossier frontend :

```bash
cd frontend
npm install
```

Pour générer la version optimisée destinée à la production :

```bash
npm run build
```

Cette commande génère les fichiers nécessaires au déploiement du frontend sur un serveur web.

Le frontend communique avec l'API backend grâce à l'adresse du serveur configurée dans l'application.

---

## 3.5.5 Vérifications après déploiement

Après le déploiement, plusieurs vérifications sont nécessaires afin de garantir le bon fonctionnement de l'application :

- accès à l'interface utilisateur ;
- communication entre le frontend et l'API backend ;
- connexion aux bases de données ;
- fonctionnement de l'authentification JWT ;
- contrôle des droits selon les rôles utilisateurs ;
- consultation des menus ;
- création et suivi des commandes ;
- affichage des statistiques administrateur.

Ces vérifications permettent de s'assurer que l'ensemble des composants fonctionnent correctement dans l'environnement cible.

---

## 3.5.6 Améliorations possibles

Dans le cadre de ce projet, certaines améliorations pourraient être envisagées pour une mise en production complète :

- mise en place d'un hébergement cloud adapté ;
- configuration d'un certificat HTTPS ;
- automatisation des déploiements avec une chaîne CI/CD ;
- conteneurisation de l'application avec Docker ;
- ajout d'outils de supervision et de sauvegarde automatisée.

Ces évolutions permettraient d'améliorer la fiabilité, la sécurité et la maintenabilité de l'application dans un environnement professionnel.

---

## 3.6 Tests et validation

Afin de garantir la qualité et la fiabilité de l'application, plusieurs phases de tests ont été réalisées durant le développement.

Ces tests ont permis de vérifier le bon fonctionnement des différentes fonctionnalités ainsi que la communication entre les composants de l'application.

---

## 3.6.1 Tests du backend

Les tests du backend ont principalement été réalisés à l'aide d'un outil de test d'API afin de vérifier les différentes routes exposées par Express.

Les vérifications effectuées concernent notamment :

- le démarrage correct du serveur API ;
- la connexion à la base de données MySQL/MariaDB ;
- le fonctionnement des différentes routes ;
- le retour des données attendues ;
- la gestion des erreurs.

Les principales fonctionnalités testées sont :

- authentification des utilisateurs ;
- récupération des menus ;
- récupération des plats ;
- gestion des utilisateurs ;
- gestion des commandes ;
- consultation des données liées aux tables de référence.

---

## 3.6.2 Tests de l'authentification et des autorisations

Une attention particulière a été portée à la sécurité des accès.

Les tests ont permis de vérifier :

- qu'un utilisateur non authentifié ne peut pas accéder aux fonctionnalités protégées ;
- que le token JWT est correctement vérifié ;
- que les droits associés au rôle de l'utilisateur sont respectés.

Les différents profils utilisateurs ont été vérifiés :

- Client :
  - accès aux fonctionnalités liées aux commandes ;
  - impossibilité d'accéder aux fonctions réservées aux employés.

- Employé :
  - accès à la gestion de l'activité ;
  - impossibilité d'accéder aux fonctions administrateur.

- Administrateur :
  - accès aux fonctionnalités de gestion avancée ;
  - accès aux statistiques.

---

## 3.6.3 Tests du frontend

Les tests frontend ont permis de vérifier :

- le bon affichage des différentes pages ;
- la navigation entre les vues ;
- la récupération des données depuis l'API ;
- le comportement des composants React.

Les pages principales vérifiées sont :

- page d'accueil ;
- consultation des menus ;
- connexion utilisateur ;
- page de contact.

---

## 3.6.4 Validation fonctionnelle

La validation fonctionnelle a été réalisée en vérifiant que les fonctionnalités développées correspondaient aux règles métier définies lors de la conception.

Les principaux scénarios vérifiés sont :

- consultation des menus par un visiteur ;
- connexion d'un utilisateur ;
- accès selon le rôle attribué ;
- récupération des informations depuis la base de données ;
- création et gestion des commandes selon les règles définies.

---

## 3.6.5 Limites identifiées

Certaines fonctionnalités prévues dans le cahier des charges n'ont pas pu être finalisées dans le temps imparti :

- création complète d'un compte client depuis l'interface ;
- envoi automatique d'e-mails ;
- finalisation complète du module statistique ;
- déploiement complet en environnement de production.

Ces éléments pourront être ajoutés dans une évolution future de l'application.

---

## 3.7 Conclusion technique et évolutions futures

Le développement de l'application **Vite & Gourmand** a permis de mettre en place une solution web complète répondant aux principaux besoins d'une entreprise de traiteur.

Les choix techniques réalisés ont permis de construire une architecture séparant clairement :

- l'interface utilisateur développée avec React ;
- l'API métier développée avec Node.js et Express ;
- la gestion des données métier avec MySQL/MariaDB ;
- l'exploitation des données statistiques avec MongoDB.

Cette séparation facilite la maintenance, l'évolution et la compréhension globale de l'application.

---

## 3.7.1 Bilan des choix techniques

Les technologies sélectionnées répondent aux besoins identifiés lors de la phase d'analyse :

- React permet de proposer une interface dynamique basée sur des composants réutilisables ;
- Node.js et Express permettent de créer une API REST légère et adaptée aux besoins de l'application ;
- MySQL/MariaDB assure la cohérence des données métier grâce au modèle relationnel ;
- MongoDB permet une gestion plus flexible des données statistiques.

La mise en place d'une authentification JWT et d'une gestion des rôles permet également de sécuriser l'accès aux fonctionnalités selon le profil utilisateur.

---

## 3.7.2 Limites actuelles

Dans le cadre du temps disponible pour la réalisation de l'ECF, certaines fonctionnalités, améliorations et livrables prévus initialement n'ont pas pu être finalisés :

- création complète d'un compte client depuis l'interface utilisateur ;
- automatisation de l'envoi des e-mails ;
- finalisation complète du tableau de statistiques ;
- mise en production complète de l'application ;
- finalisation complète de l'identité visuelle et de l'expérience utilisateur ;
- réalisation des maquettes graphiques prévues dans le cadre de l'ECF ;
- intégration des pages d'informations légales (mentions légales et conditions générales de vente) ;
- affichage des horaires d'ouverture dans le pied de page ;
- connexion du formulaire de contact à un système de traitement des demandes.

L'interface actuelle privilégie la simplicité, la lisibilité et le bon fonctionnement des fonctionnalités principales. Le travail d'amélioration graphique, d'enrichissement des composants visuels et d'ajout des informations complémentaires pourra être réalisé dans une évolution future de l'application.

Ces choix ont permis de concentrer les efforts sur la mise en place d'une architecture fonctionnelle, sécurisée et maintenable, conformément aux objectifs principaux du projet.

---

## 3.7.3 Améliorations futures

Plusieurs évolutions pourraient être envisagées afin d'améliorer l'application :

### Fonctionnalités supplémentaires

- ajout d'un parcours complet d'inscription client ;
- mise en place d'un système d'envoi d'e-mails automatiques ;
- ajout d'un espace client plus complet ;
- amélioration du suivi des commandes ;
- enrichissement du tableau de bord administrateur.

### Améliorations techniques

- automatisation des tests ;
- mise en place d'une intégration continue ;
- déploiement automatisé ;
- conteneurisation avec Docker ;
- amélioration du système de logs ;
- mise en place de sauvegardes automatisées des bases de données.

---

## 3.7.4 Conclusion

Le projet **Vite & Gourmand** a permis de mettre en pratique les différentes étapes nécessaires à la réalisation d'une application web professionnelle :

- analyse des besoins ;
- conception des modèles de données ;
- développement frontend et backend ;
- sécurisation des accès ;
- gestion des données ;
- préparation au déploiement.

Malgré certaines fonctionnalités restant à finaliser, l'application possède une base technique solide permettant son évolution vers une solution complète adaptée aux besoins d'une entreprise de traiteur.
