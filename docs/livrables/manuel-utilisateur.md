# Manuel utilisateur - Vite & Gourmand

## 1. Présentation de l'application

**Vite & Gourmand** est une application web permettant de gérer l'activité d'une entreprise de traiteur.

L'application permet aux différents utilisateurs d'accéder à des fonctionnalités adaptées à leur rôle :

- les visiteurs peuvent consulter les menus proposés ;
- les clients peuvent consulter les offres et effectuer des commandes ;
- les employés peuvent gérer l'activité quotidienne ;
- les administrateurs peuvent superviser les utilisateurs et consulter les statistiques.

L'objectif de l'application est de centraliser la gestion des menus, des plats et des commandes dans une interface simple et accessible.

### Catalogue proposé en démonstration

Lors du **premier** démarrage Docker (volume MariaDB neuf), l’application dispose automatiquement du catalogue cible : **8 menus**, **19 plats** et **26** associations `menu_plat` (seed + enrichissement montés dans `docker-entrypoint-initdb.d`, contrôlés par `04-validate-catalogue.sh`).

Menus conservés (identifiants inchangés) : Entreprise Classique (1), Végétarien Gourmand (2), Mariage Végan (3), Cocktail Dinatoire (4), Buffet Traditionnel (5), Gastronomique Signature (6), Estival Méditerranéen (8), Brunch Festif (15). Cocktail Dinatoire et Brunch Festif comportent quatre plats ; les six autres en comportent trois. Plusieurs recettes sont mutualisées entre menus via `menu_plat`.

Si la base a été créée avant cette intégration et ne contient que 3 menus, compléter **sans supprimer le volume** avec :

```bash
ENRICH_CONFIRM=y ./database/apply-enrich-catalogue.sh
```

Cet enrichissement est idempotent et ne modifie pas les comptes utilisateurs ni les commandes existantes. Sur un volume déjà à un état intermédiaire (ex. 8 menus / 24 plats), utiliser les scripts de migration manuels (`preview_catalogue_*.sql` / `migrate_catalogue_*.sql`) décrits dans le README — **ne pas** utiliser `docker compose down -v` comme mise à jour ordinaire.

Les photographies du catalogue public sont des fichiers WebP (et un placeholder SVG) versionnés sous `frontend/public/images/`, résolus par `menuImages.js` et `platImages.js`. Ce n’est **pas** une fonctionnalité d’upload depuis l’interface employé.

### Commandes de démonstration

Le seed SQL initial contient **trois** commandes historiques (`CMD-2026-001` Terminée, `CMD-2026-002` En préparation, `CMD-2026-003` Annulée). Une base locale peut en contenir davantage si un script optionnel (ex. `database/insert_commandes_demo.sql`) a été exécuté manuellement : ces ajouts ne font **pas** partie de l’initialisation Docker standard ni d’un déploiement futur tant qu’ils n’y sont pas rejoués. Les statistiques MongoDB associées (volume, CA) dépendent de l’état réel de la base et d’une éventuelle resynchronisation (`stats:resync`) ; ce ne sont pas des chiffres de production.

---

## 2. Accès à l'application

L'application est accessible depuis un navigateur web.

En environnement local, les adresses utilisées sont :

- Interface utilisateur :

  http://localhost:5173

- API backend :

  http://localhost:3000

Depuis l’interface, le titre « Vite & Gourmand » du header renvoie vers la page d’accueil (`/`).

L'accès aux fonctionnalités dépend du rôle de l'utilisateur connecté.

Trois types de profils sont disponibles :

- Client ;
- Employé ;
- Administrateur.

Chaque profil possède des droits différents afin de garantir une séparation des responsabilités.

---

## 2.1 Connexion utilisateur

Les utilisateurs disposant d'un compte peuvent accéder à l'espace de connexion depuis la page dédiée.

La connexion nécessite :

- une adresse email ;
- un mot de passe valide.

Après authentification, l'utilisateur est redirigé vers les fonctionnalités correspondant à son rôle.

---

## 3. Parcours Visiteur

Le visiteur correspond à un utilisateur non authentifié consultant l'application.

Il peut accéder aux informations publiques sans disposer de compte.

Les fonctionnalités disponibles sont :

- consultation et filtrage des menus proposés ;
- consultation du détail d'un menu ;
- consultation des informations de contact.

---

## 3.1 Consultation des menus

Depuis la page dédiée aux menus, le visiteur peut consulter les différentes offres proposées par l'entreprise.

Il peut filtrer le catalogue selon :

- le thème ;
- le régime alimentaire ;
- le prix maximum ;
- le nombre de personnes.

Le filtrage est lancé uniquement après un clic sur « Appliquer ». Le bouton « Réinitialiser » restaure l'affichage de l'ensemble du catalogue. Si aucun menu ne correspond aux critères choisis, le message « Aucun menu ne correspond à vos critères. » est affiché.

Chaque carte menu présente les informations principales :

- nom du menu ;
- description ;
- thème associé ;
- régime alimentaire ;
- nombre minimum de personnes ;
- prix par personne ;
- quantité restante ;
- indication d'indisponibilité lorsque la quantité restante est nulle.

Le visiteur peut ainsi consulter les différentes prestations disponibles avant de créer une commande.

---

## 3.2 Consultation du détail d'un menu

Lorsqu'un menu est sélectionné, l'utilisateur peut accéder à une vue détaillée présentant les informations complémentaires.

Cette page permet notamment de consulter :

- le thème et le régime alimentaire ;
- le prix par personne ;
- le nombre minimum de personnes ;
- la quantité restante ;
- les conditions associées au menu ;
- la composition du menu et les plats proposés ;
- les allergènes associés à chaque plat ;
- une information sur la remise de 10 % applicable uniquement lorsque le nombre de personnes atteint le seuil affiché (nombre minimum de personnes + 5).

Cette étape permet au visiteur de choisir une prestation adaptée à ses besoins.

---

## 3.3 Accès au formulaire de contact

La page de contact permet au visiteur d'envoyer une demande au traiteur.

Le formulaire comporte les champs suivants :

- nom ;
- e-mail ;
- message.

Lors de l'envoi, la demande est transmise à l'entreprise et un accusé de réception est envoyé à l'adresse e-mail indiquée par le visiteur.

---

## 3.4 Limitation du parcours visiteur

Certaines fonctionnalités nécessitent une authentification.

Un visiteur non connecté ne peut pas :

- passer une commande ;
- accéder aux fonctionnalités réservées aux clients ;
- accéder aux espaces employés et administrateurs.

Pour continuer son parcours et accéder aux fonctionnalités réservées aux utilisateurs authentifiés, le visiteur doit se connecter avec un compte disposant des droits nécessaires.

Les fonctionnalités accessibles après connexion dépendent du rôle associé au compte utilisateur :

- Client ;
- Employé ;
- Administrateur.

---

## 4. Parcours Client

Le client correspond à un utilisateur authentifié disposant d'un compte avec le rôle **Client**.

Après connexion, il peut accéder aux fonctionnalités qui lui sont dédiées.

Les principales fonctionnalités disponibles sont :

- consultation des menus ;
- accès aux informations détaillées des prestations ;
- passage d'une commande ;
- suivi de ses commandes depuis son espace client.

---

## 4.1 Connexion d'un client

Pour accéder aux fonctionnalités réservées aux clients, l'utilisateur doit disposer d'un compte existant.

La connexion nécessite :

- une adresse email ;
- un mot de passe valide.

Après authentification, le système vérifie les informations du compte et associe l'utilisateur à son rôle.

L'accès aux fonctionnalités est ensuite adapté selon les droits associés au compte.

---

## 4.2 Consultation des menus

Une fois connecté, le client dispose des mêmes possibilités de consultation et de filtrage du catalogue que le visiteur.

Il peut notamment :

- filtrer les menus par thème, régime alimentaire, prix maximum et nombre de personnes ;
- consulter les cartes menus (thème, régime, prix par personne, nombre minimum de personnes, quantité restante) ;
- ouvrir le détail d'un menu (composition, allergènes, conditions, stock et information sur la remise éventuelle).

Le client peut ainsi identifier le menu correspondant à ses besoins avant de réaliser une commande.

---

## 4.3 Espace client et suivi des commandes

L'espace client permet à l'utilisateur de retrouver les informations liées à ses commandes.

Cette interface permet notamment de consulter :

- les commandes déjà réalisées ;
- les informations associées à chaque commande ;
- l'état d'avancement de la commande.

Cette fonctionnalité permet au client de suivre ses prestations et de conserver un historique de ses demandes auprès de l'entreprise.

---

## 4.4 Passage d'une commande

Le client peut effectuer une commande à partir d'un menu disponible.

Lors de la commande, les informations nécessaires sont prises en compte afin de respecter les règles métier définies :

- menu sélectionné ;
- nombre de personnes concernées ;
- adresse de livraison complète (numéro, rue, code postal, ville) ;
- informations nécessaires au traitement de la commande.

Avant de valider la commande, le client doit obtenir une **estimation des frais de livraison** à partir de l’adresse saisie. La livraison est gratuite à Bordeaux ; hors Bordeaux, un forfait kilométrique s’applique. Sans estimation valide, la commande ne peut pas être confirmée.

Lors de l’enregistrement, le serveur **recalcule systématiquement** la distance et les frais de livraison. Les montants éventuellement affichés côté interface ne sont pas repris tels quels : seuls les calculs effectués par l’API sont enregistrés.

Le système applique les contrôles nécessaires avant l'enregistrement de la commande.

---

## 4.5 Restrictions d'accès

Les fonctionnalités clientes sont protégées par un système d'authentification et de gestion des rôles.

Un utilisateur non connecté ne peut pas :

- accéder aux fonctionnalités réservées aux clients ;
- effectuer une commande ;
- accéder aux espaces employés ou administrateurs.

Les droits sont contrôlés côté serveur afin d'éviter les accès non autorisés.

---

## 5. Parcours Employé

L'employé correspond à un utilisateur authentifié disposant d'un compte avec le rôle **Employé**.

Après connexion, il accède aux fonctionnalités nécessaires à la gestion quotidienne de l'activité de l'entreprise.

Les principales fonctionnalités disponibles sont :

- gestion des menus ;
- gestion des plats ;
- consultation et gestion des commandes ;
- gestion des horaires ;
- gestion et modération des avis clients.

---

## 5.1 Connexion d'un employé

L'accès à l'espace employé nécessite un compte disposant du rôle correspondant.

La connexion s'effectue à l'aide :

- d'une adresse email ;
- d'un mot de passe valide.

Après authentification, les droits associés au rôle Employé sont appliqués automatiquement.

---

## 5.2 Gestion des menus

L'employé peut accéder à l'espace de gestion des menus depuis l'interface d'administration.

Cette fonctionnalité lui permet de maintenir les prestations proposées par l'entreprise.

L'employé peut notamment :

- consulter les menus existants ;
- modifier les informations associées aux menus (titre, description, conditions, stock, prix, thème, régime) ;
- mettre à jour la composition des menus.

La modification d'un menu permet notamment d'ajouter, retirer ou modifier les plats qui le composent afin de conserver une offre adaptée aux besoins de l'entreprise. Les images des cartes catalogue sont gérées côté application (fichiers versionnés) et ne sont pas éditables depuis cet écran.

---

## 5.3 Gestion des plats

L'employé peut gérer les plats disponibles depuis l'interface de gestion.

Cette fonctionnalité permet notamment :

- consulter les plats existants ;
- créer, renommer ou supprimer un plat ;
- gérer les allergènes associés à chaque plat ;
- mettre à jour les plats associés aux menus (depuis la gestion des menus).

Les modifications réalisées depuis l'interface sont enregistrées dans la base de données afin de maintenir les informations affichées aux utilisateurs. Les photographies des plats du catalogue public sont des ressources frontend versionnées ; elles ne sont pas saisies dans cet écran.

---

## 5.4 Gestion des commandes

L'employé peut consulter et gérer les commandes clients depuis son espace de gestion.

Cette fonctionnalité permet notamment de :

- consulter les commandes enregistrées ;
- accéder aux informations nécessaires à leur préparation ;
- modifier le statut d'une commande ;
- assurer le suivi de l'avancement des prestations.

Les différents changements de statut permettent à l'entreprise et au client de suivre l'évolution d'une commande depuis son enregistrement jusqu'à sa réalisation.

---

### Règle concernant l'annulation d'une commande

L'annulation d'une commande nécessite une action préalable de la part de l'employé.

Avant de pouvoir annuler une commande, l'employé doit avoir pris contact avec le client afin de confirmer la demande d'annulation.

Cette règle permet de garantir un suivi client et d'éviter les annulations effectuées sans validation préalable.

---

## 5.5 Gestion des horaires

L'employé peut gérer les horaires d'ouverture de l'entreprise depuis son espace dédié.

Cette fonctionnalité permet notamment de :

- consulter les plages horaires enregistrées pour chaque jour ;
- modifier les heures d'ouverture et de fermeture ;
- maintenir à jour les informations affichées dans le pied de page du site.

Les horaires publiés permettent aux visiteurs et aux clients de connaître les périodes d'activité de l'entreprise.

---

## 5.6 Gestion des avis clients

L'employé peut accéder à la modération des avis déposés par les clients.

Cette fonctionnalité permet notamment de :

- consulter la liste des avis (y compris ceux en attente de validation) ;
- valider un avis afin qu'il puisse être affiché sur la page d'accueil ;
- refuser un avis qui ne doit pas être publié.

Seuls les avis au statut **Validé** sont visibles par les visiteurs sur le site public.

---

## 5.7 Restrictions d'accès

Les fonctionnalités employées sont protégées par le système d'authentification et de gestion des rôles.

Un utilisateur ne disposant pas du rôle Employé ou Administrateur ne peut pas accéder aux fonctionnalités de gestion.

Les contrôles sont effectués côté serveur afin de garantir que seules les personnes autorisées puissent modifier les données métier.

---

## 6. Parcours Administrateur

L'administrateur correspond à un utilisateur authentifié disposant d'un compte avec le rôle **Administrateur**.

Il possède les droits les plus élevés de l'application et peut accéder aux fonctionnalités de supervision et de gestion avancée.

Les principales fonctionnalités disponibles sont :

- gestion des menus ;
- gestion des plats ;
- gestion des commandes ;
- gestion des avis clients ;
- gestion des comptes employé ;
- supervision de l'activité ;
- consultation des statistiques.

---

## 6.1 Connexion administrateur

L'accès aux fonctionnalités administrateur nécessite un compte disposant du rôle Administrateur.

La connexion s'effectue avec :

- une adresse email ;
- un mot de passe valide.

Après authentification, les droits administrateur sont appliqués automatiquement afin de permettre l'accès aux fonctionnalités protégées.

---

## 6.2 Gestion des utilisateurs

L'administrateur peut gérer les utilisateurs de l'application.

Cette fonctionnalité permet notamment :

- consulter les comptes existants ;
- gérer les informations des utilisateurs ;
- attribuer ou modifier les rôles associés aux comptes.

La gestion des rôles permet de contrôler les accès aux différentes parties de l'application :

- Client ;
- Employé ;
- Administrateur.

---

## 6.3 Consultation des statistiques

L'administrateur peut accéder aux données statistiques permettant d'avoir une vision globale de l'activité de l'entreprise.

Les statistiques permettent notamment de suivre :

- le volume de commandes (hors commandes annulées) ;
- les performances des menus ;
- le chiffre d'affaires agrégé (`prix_menu + prix_livraison`) pour les commandes dont le statut est **Livrée**, **En attente du retour de matériel** ou **Terminée**.

Ces indicateurs reflètent le suivi métier des commandes. Il n’existe pas de module de paiement bancaire : le chiffre d’affaires affiché n’est pas une preuve d’encaissement bancaire.

Ces informations permettent d'aider à l'analyse de l'activité et à la prise de décision.

---

## 6.4 Restrictions d'accès

Les fonctionnalités administrateur sont protégées par le système d'authentification et de gestion des rôles.

Seuls les utilisateurs disposant du rôle Administrateur peuvent accéder aux fonctionnalités de supervision et de gestion avancée.

Les contrôles sont réalisés côté serveur afin de garantir la sécurité des données sensibles.

---

## 7. Comptes de démonstration

Afin de permettre la découverte des différentes fonctionnalités de l'application, plusieurs comptes de démonstration sont prévus.

Chaque compte permet de tester un parcours utilisateur différent selon le rôle associé.

Ces comptes sont présents après import du fichier `database/vite_gourmand.sql` (premier démarrage du volume MariaDB). Les mots de passe sont stockés **uniquement sous forme de hash bcrypt** dans ce fichier SQL.

**Sécurité :**

- ne jamais publier ni versionner de mots de passe de démonstration en clair ;
- ces comptes sont réservés à un environnement **local / de préproduction contrôlée** ;
- avant tout déploiement public, changer ou désactiver ces comptes et utiliser des secrets forts distincts.

Les e-mails de démonstration issus du seed sont :

---

## 7.1 Compte Client

Ce compte permet de tester le parcours client :

- connexion à l'application ;
- consultation des menus ;
- passage d'une commande ;
- suivi des commandes.

```
Email : client@vite-gourmand.fr
Mot de passe : non publié (hash dans database/vite_gourmand.sql — usage local uniquement)
```

---

## 7.2 Compte Employé

Ce compte permet de tester les fonctionnalités de gestion :

- gestion des menus ;
- gestion des plats ;
- gestion des commandes ;
- gestion des horaires ;
- gestion des avis clients.

```
Email : employe@vite-gourmand.fr
Mot de passe : non publié (hash dans database/vite_gourmand.sql — usage local uniquement)
```

---

## 7.3 Compte Administrateur

Ce compte permet de tester l'ensemble des fonctionnalités d'administration :

- gestion des comptes employés ;
- gestion des fonctionnalités accessibles aux employés ;
- consultation des statistiques ;
- supervision de l'activité.

```
Email : admin@vite-gourmand.fr
Mot de passe : non publié (hash dans database/vite_gourmand.sql — usage local uniquement)
```

---

## 8. Remarque

Certaines fonctionnalités pourront évoluer dans de futures versions de l'application afin d'enrichir l'expérience utilisateur.
