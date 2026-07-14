# Diagramme de classes

## Objectif

Le diagramme de classes présente les principales entités métier de l'application **Vite & Gourmand**, leurs attributs ainsi que les relations qui les unissent.

Il constitue une représentation statique du système et sert de base à la conception du modèle de données et à l'implémentation des fonctionnalités de l'application.

## Choix de modélisation

Le diagramme de classes a été élaboré à partir des besoins fonctionnels décrits dans le sujet de l'ECF et de son annexe.

Les classes retenues correspondent aux principales entités manipulées par l'application : les utilisateurs, les menus, les plats, les commandes et les avis.

Le **Visiteur** n'est pas représenté dans le diagramme de classes, car il s'agit d'un acteur externe ne possédant aucune donnée persistée. Il est uniquement présent dans le diagramme de cas d'utilisation afin de représenter les fonctionnalités accessibles sans authentification.

La gestion des comptes repose sur une classe générale **Utilisateur**, représentant les personnes disposant d'un compte dans l'application.

Les différents types d'utilisateurs sont définis par l'intermédiaire d'un **Role** associé au compte utilisateur :

- Le rôle **Client** permet à un utilisateur authentifié de consulter le catalogue, passer des commandes, suivre leur évolution et déposer un avis après une prestation.
- Le rôle **Employé** permet à un utilisateur interne de gérer le catalogue, traiter les commandes et modérer les avis.
- Le rôle **Administrateur** correspond à un utilisateur disposant de droits supplémentaires, notamment la gestion des comptes employés et la consultation des statistiques.

Cette modélisation permet de centraliser les informations communes liées aux comptes utilisateurs tout en différenciant les droits et responsabilités associés à chaque rôle.

Les relations entre les différentes classes ont été établies à partir des règles métier décrites dans le sujet ainsi que des éléments présents dans le modèle de données fourni en annexe. Lorsque certaines informations n'étaient pas explicitement précisées, les choix de modélisation ont privilégié une représentation simple, cohérente et facilement justifiable, tout en respectant les besoins fonctionnels de l'application.

## Principales classes métier

Les principales classes identifiées sont les suivantes :

- **Utilisateur**
- **Role**
- **Menu**
- **Plat**
- **Commande**
- **Avis**
- **Allergène**
- **Horaire** est conservée conformément au modèle de données fourni en annexe. Elle représente les plages horaires de l'entreprise et n'est pas associée directement aux autres entités métier dans ce modèle.

Le diagramme intègre, lorsque cela est pertinent, des classes d'association et des énumérations afin de représenter fidèlement les règles métier tout en conservant une modélisation claire et cohérente.

## Principales relations identifiées

Les relations métier suivantes sont déjà établies :

- Un **Utilisateur** disposant du rôle **Client** peut effectuer plusieurs **Commandes**.
- Une **Commande** est associée au **Menu** sélectionné par le client lors de sa demande de prestation.
- Un **Menu** est composé de plusieurs **Plat**.
- Un **Plat** peut appartenir à plusieurs **Menu**.
- Un **Plat** peut être associé à plusieurs **Allergène**.
- Un **Utilisateur** disposant du rôle **Client** peut déposer un **Avis** uniquement après une commande terminée.
- Un **Employé** peut gérer les menus, les plats, les commandes et modérer les avis.
- Un **Administrateur** dispose des responsabilités d'un **Employé** ainsi que de droits supplémentaires.
- Une **Commande** précise le nombre de personnes prévues pour la prestation, en fonction du **Menu** choisi.

Le diagramme UML précisera les attributs, les relations ainsi que les cardinalités entre les différentes classes.

## Diagramme UML

## Diagramme UML

Le diagramme de classes suivant présente la structure statique de l'application **Vite & Gourmand**, les principales entités métier, leurs attributs ainsi que leurs relations.

![Diagramme de classes - Vite & Gourmand](../diagrammes/DiagrammeClasses.svg)
