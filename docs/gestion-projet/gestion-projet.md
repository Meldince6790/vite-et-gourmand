# Gestion de projet - Vite & Gourmand

## 1. Présentation de l'organisation du projet

Le projet **Vite & Gourmand** a été réalisé dans le cadre d'un ECF de développement d'application web.

L'objectif était de concevoir et développer une application complète de gestion pour une entreprise de traiteur, permettant de répondre aux besoins des différents profils utilisateurs :

- visiteurs ;
- clients ;
- employés ;
- administrateurs.

Le développement du projet a été organisé autour de plusieurs phases successives :

- analyse du besoin et définition des fonctionnalités ;
- conception de l'architecture et du modèle de données ;
- développement de l'API backend ;
- développement de l'interface frontend ;
- intégration et validation des fonctionnalités ;
- rédaction des documents nécessaires au rendu final.

Cette organisation a permis de structurer progressivement le développement et de suivre l'évolution du projet jusqu'à sa version finale.

---

## 2. Méthode de gestion utilisée

Le projet a été organisé selon une approche itérative adaptée à un développement individuel.

Le travail a été découpé en plusieurs sprints ayant chacun des objectifs précis, afin de structurer l'avancement du projet et de suivre progressivement la réalisation des différentes fonctionnalités.

Cette organisation a permis de :

- planifier les différentes phases de développement ;
- prioriser les fonctionnalités essentielles ;
- contrôler l'avancement du projet ;
- identifier rapidement les points nécessitant des ajustements.

Le suivi du projet s'est appuyé sur :

- un découpage fonctionnel des tâches ;
- l'utilisation de Git pour le suivi des évolutions du code ;
- des validations régulières des fonctionnalités développées ;
- la mise à jour progressive des documents de conception.

Cette méthode a été choisie afin d'apporter un cadre de travail structuré tout en restant adaptée aux contraintes d'un projet réalisé seul.

---

## 3. Découpage du projet en sprints

Afin de structurer l'avancement du projet, le développement a été organisé en plusieurs sprints correspondant aux différentes phases de réalisation de l'application.

Chaque sprint avait un objectif principal permettant de faire évoluer progressivement le projet, depuis la préparation de l'environnement jusqu'à la finalisation des livrables.

---

### 3.1 Sprint 1 - Mise en place de l'environnement

Le premier sprint a consisté à préparer l'environnement nécessaire au développement de l'application.

Les principales actions réalisées ont été :

- installation et configuration des outils de développement ;
- préparation de l'environnement frontend et backend ;
- configuration du dépôt Git ;
- mise en place de la structure initiale du projet.

Ce sprint a permis de disposer d'une base de travail stable pour débuter les phases de conception et de développement.

---

### 3.2 Sprint 2 - Analyse et conception

Le deuxième sprint a été consacré à l'analyse du besoin et à la conception de l'application.

Cette phase avait pour objectif de définir la structure générale du projet avant le début du développement.

Les principales actions réalisées ont été :

- analyse des besoins fonctionnels de l'application ;
- identification des différents acteurs et de leurs droits ;
- définition des fonctionnalités principales ;
- rédaction des règles métier ;
- conception du modèle de données ;
- réalisation des diagrammes nécessaires à la compréhension du système.

Les éléments produits durant cette phase comprennent notamment :

- le modèle conceptuel de données ;
- le diagramme de classes ;
- les diagrammes de cas d'utilisation ;
- les premières réflexions concernant l'architecture technique.

Cette étape a permis de disposer d'une vision globale de l'application et de préparer une base cohérente avant le développement des différentes fonctionnalités.

---

### 3.3 Sprint 3 - Développement backend

Le troisième sprint a été consacré au développement de la partie backend de l'application.

L'objectif principal était de mettre en place une architecture robuste permettant de gérer les données, les règles métier et les échanges avec la base de données.

Les principales réalisations de ce sprint sont :

- mise en place de l'architecture du projet backend ;
- création des modèles de données ;
- développement des services métier ;
- création des contrôleurs et des routes de l'API REST ;
- connexion à la base de données MySQL ;
- mise en place de l'authentification par JWT ;
- gestion des rôles utilisateurs (Client, Employé et Administrateur) ;
- sécurisation des routes selon les droits d'accès.

Une phase importante de validation a également été réalisée afin de vérifier le bon fonctionnement des différents points d'accès de l'API avant le développement de l'interface utilisateur.

À l'issue de ce sprint, l'ensemble des fonctionnalités backend nécessaires au fonctionnement de l'application était opérationnel, permettant ainsi d'aborder le développement du frontend dans de bonnes conditions.

---

### 3.4 Sprint 4 - Développement frontend

Le quatrième sprint a été consacré au développement de l'interface utilisateur de l'application.

L'objectif était de proposer une interface permettant aux différents utilisateurs d'accéder aux fonctionnalités développées lors du sprint précédent.

Les principales réalisations de ce sprint sont :

- mise en place de l'application React avec Vite ;
- création de l'architecture des composants ;
- configuration du système de navigation avec React Router ;
- développement des différentes pages de l'application ;
- intégration des appels à l'API REST ;
- intégration de MongoDB pour la gestion et la visualisation des statistiques ;
- gestion de l'authentification côté client ;
- adaptation de l'affichage en fonction du rôle de l'utilisateur connecté ;
- développement des interfaces de gestion des menus, plats, commandes, avis et utilisateurs.

Une attention particulière a été portée à la séparation des composants afin de faciliter leur réutilisation et leur maintenance.

L'interface graphique a volontairement privilégié la simplicité et la lisibilité afin de concentrer les efforts sur la mise en œuvre des fonctionnalités principales de l'application.

---

### 3.5 Sprint 5 - Tests et corrections

Le cinquième sprint a été consacré à la validation progressive des fonctionnalités développées lors des sprints précédents.

Cette phase avait pour objectif de vérifier le bon fonctionnement de l'application et de corriger les anomalies identifiées au cours du développement.

Les principales actions réalisées sont :

- vérification du fonctionnement des différentes routes de l'API ;
- validation des contrôles d'accès selon les rôles utilisateurs ;
- tests des principales fonctionnalités du frontend ;
- correction des anomalies détectées ;
- amélioration de la stabilité générale de l'application ;
- ajustements de l'interface utilisateur afin de faciliter son utilisation.

Cette phase a permis de consolider le fonctionnement général de l'application avant la production des livrables finaux.

---

### 3.6 Sprint 6 - Documentation et finalisation

Le dernier sprint a été consacré à la préparation du rendu final du projet.

Cette phase comprenait notamment :

- la rédaction du manuel utilisateur ;
- la rédaction de la documentation technique ;
- la rédaction de la documentation de gestion de projet ;
- la réalisation de la charte graphique ;
- la vérification de la cohérence des différents livrables ;
- les dernières corrections apportées à l'application.

Les contraintes de temps ont conduit à prioriser la livraison d'une application fonctionnelle accompagnée d'une documentation complète. Certaines fonctionnalités secondaires ainsi que certaines améliorations graphiques ont été identifiées comme des évolutions futures.

---

## 4. Gestion du versionnement

Le suivi des évolutions du projet a été assuré à l'aide de Git.

L'ensemble du développement a été centralisé dans un dépôt GitHub permettant de conserver un historique des différentes modifications réalisées tout au long du projet.

La branche principale utilisée est :

- `main` : contient la version de référence du projet.

Les différentes évolutions de l'application ont été intégrées progressivement au travers de commits réguliers correspondant aux principales étapes du développement :

- préparation de l'environnement ;
- conception de l'application ;
- développement du backend ;
- développement du frontend ;
- intégration des fonctionnalités ;
- corrections ;
- production des livrables.

Une attention particulière a été portée à la rédaction des messages de commit afin de faciliter le suivi de l'évolution du projet et l'identification des différentes modifications réalisées.

Compte tenu des contraintes de temps liées au développement du projet, le workflow Git prévu initialement avec une branche de développement et des branches dédiées aux différentes fonctionnalités n'a pas été appliqué dans cette version. Le suivi du projet a néanmoins été assuré grâce à des commits réguliers permettant de conserver un historique clair des différentes étapes de réalisation.

---

## 5. Suivi de l'avancement

Le suivi de l'avancement du projet a été réalisé tout au long du développement afin de vérifier la progression des différentes phases et d'identifier les éventuels ajustements nécessaires.

Chaque sprint faisait l'objet d'une validation avant le démarrage de la phase suivante. Cette organisation a permis de conserver une progression logique du projet et de limiter les risques de régression.

Le développement s'est déroulé selon les grandes étapes suivantes :

- validation de l'environnement de développement ;
- validation des éléments de conception ;
- finalisation du backend avant le démarrage du frontend ;
- intégration progressive des fonctionnalités côté interface utilisateur ;
- phase de tests et de corrections ;
- rédaction et validation des différents livrables.

Cette démarche a permis de disposer d'une vision claire de l'état d'avancement du projet et d'adapter les priorités lorsque cela était nécessaire.

Les différentes validations intermédiaires ont également facilité l'identification des anomalies et leur correction avant le passage à l'étape suivante.

---

## 6. Gestion des priorités et arbitrages

Au cours du développement, plusieurs arbitrages ont été réalisés afin de respecter les délais de réalisation du projet.

L'objectif principal a été de livrer une application fonctionnelle répondant aux besoins essentiels définis lors de la phase d'analyse.

Les priorités retenues ont été les suivantes :

- mise en place de l'architecture technique ;
- développement complet du backend ;
- sécurisation de l'application par authentification et gestion des rôles ;
- développement des principales fonctionnalités du frontend ;
- validation du fonctionnement général de l'application ;
- production des différents livrables demandés.

À l'inverse, certaines fonctionnalités ou améliorations ont volontairement été reportées afin de concentrer les efforts sur les éléments indispensables au fonctionnement de l'application.

Parmi ces éléments figurent notamment :

- la création complète d'un compte client depuis l'interface ;
- l'automatisation des échanges par e-mail ;
- l'amélioration de l'identité visuelle ;
- l'adaptation responsive de l'interface ;
- le déploiement complet de l'application.

Cette démarche de priorisation a permis de garantir la stabilité et la cohérence du projet tout en respectant les contraintes de temps imposées par l'ECF.

---

## 7. Contraintes rencontrées

La réalisation du projet s'est déroulée dans un contexte présentant plusieurs contraintes ayant influencé son organisation et les choix réalisés au cours du développement.

Le projet a notamment été mené dans le cadre d'une formation suivie en parallèle d'une activité professionnelle à temps plein.

Cette situation a nécessité une gestion rigoureuse du temps disponible afin de concilier les différentes obligations tout en respectant les échéances de l'ECF.

Face à ces contraintes, plusieurs choix de priorisation ont été effectués :

- privilégier la mise en place d'une architecture technique robuste ;
- assurer le développement des fonctionnalités principales ;
- garantir la sécurisation de l'application ;
- produire une documentation complète et cohérente.

Certaines fonctionnalités complémentaires ainsi que plusieurs améliorations graphiques ont ainsi été identifiées comme des évolutions futures afin de concentrer les efforts sur les éléments essentiels au bon fonctionnement de l'application.

Malgré ces contraintes, la majorite des objectifs principaux du projet a pu être développée, permettant la livraison d'une application fonctionnelle, documentée et conforme aux attentes essentielles du sujet.

---

## 8. Bilan du projet

La réalisation du projet **Vite & Gourmand** a permis de mettre en pratique les différentes étapes nécessaires au développement d'une application web complète.

Ce projet a permis d'aborder :

- l'analyse d'un besoin fonctionnel ;
- la conception d'une architecture applicative ;
- la modélisation des données ;
- le développement d'une API REST ;
- la création d'une interface frontend ;
- la gestion des droits utilisateurs ;
- la rédaction des documents techniques et fonctionnels.

L'organisation du projet par sprints a permis de structurer progressivement le développement et de conserver une vision claire de l'avancement.

Les principaux objectifs du projet ont été atteints avec la mise en place :

- d'une architecture backend fonctionnelle ;
- d'une interface utilisateur opérationnelle ;
- d'un système d'authentification sécurisé ;
- d'une gestion des rôles permettant d'adapter les fonctionnalités selon les profils utilisateurs ;
- d'une documentation complète accompagnant l'application.

Les contraintes rencontrées ont conduit à effectuer certains choix de priorisation, mais ont également permis de renforcer la capacité à identifier les fonctionnalités essentielles et à organiser le développement en fonction des ressources disponibles.

Les évolutions futures identifiées permettront notamment d'améliorer l'expérience utilisateur, d'enrichir les fonctionnalités existantes et de finaliser certains éléments complémentaires.

Ce projet constitue ainsi une expérience complète de conception et de réalisation d'une application web, de l'analyse initiale jusqu'à la préparation du rendu final.
