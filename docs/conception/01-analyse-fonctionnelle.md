# Analyse fonctionnelle

## Objectif

Ce document présente l'analyse fonctionnelle de l'application **Vite & Gourmand**.

Son objectif est de définir les besoins fonctionnels du projet en identifiant les différents acteurs, leurs responsabilités ainsi que les principales fonctionnalités attendues.

Cette analyse est indépendante des choix techniques qui seront réalisés lors des phases de conception et de développement.

---

# 1. Présentation du projet

Vite & Gourmand est une application web permettant la gestion de prestations culinaires, de menus et de commandes.

Elle permet aux clients de découvrir les prestations proposées, de consulter les menus disponibles, de passer des commandes en ligne et d'en assurer le suivi.

L'application met également à disposition un espace réservé au personnel de l'entreprise afin de gérer les menus, les commandes, les avis clients ainsi que les différents comptes du personnel.

---

# 2. Objectifs de l'application

L'application a pour objectif de :

- présenter les prestations du traiteur ;
- permettre la consultation des menus disponibles ;
- faciliter la prise de commande en ligne ;
- assurer le suivi des commandes ;
- permettre aux clients de déposer un avis après une prestation ;
- fournir au personnel les outils nécessaires à la gestion quotidienne de l'activité.

---

# 3. Identification des acteurs

L'application distingue trois catégories d'acteurs.

## 3.1 Visiteur

Le visiteur accède librement au site sans être authentifié.

Il peut notamment :

- consulter les menus ;
- consulter les avis publiés ;
- consulter les horaires d'ouverture dans le pied de page ;
- consulter les mentions légales ;
- consulter les conditions générales de vente ;
- utiliser le formulaire de contact ;
- créer un compte client.

---

## 3.2 Client

Le client est un utilisateur authentifié.

Il peut :

- gérer son profil ;
- consulter les menus ;
- passer une commande ;
- suivre ses commandes ;
- modifier une commande uniquement lorsqu'elle est au statut « En attente » ;
- annuler une commande selon les règles métier prévues ;
- déposer un avis après une commande au statut « Terminée ».

---

## 3.3 Entreprise

Le personnel de l'entreprise dispose d'un espace d'administration.

Il se compose de deux profils.

### Employé

L'employé participe à la gestion quotidienne de l'activité.

Il peut :

- gérer les menus ;
- gérer les plats ;
- gérer les horaires ;
- gérer les commandes ;
- modérer les avis clients.

### Administrateur

L'administrateur possède l'ensemble des droits de l'employé.

Il peut également :

- gérer les comptes du personnel ;
- consulter les statistiques de l'application ;
- administrer les fonctionnalités réservées à la direction.

---

# 4. Décisions de conception

À ce stade du projet, les décisions suivantes ont été retenues :

- Les acteurs sont répartis en trois catégories : Visiteur, Client et Entreprise.
- Le personnel de l'entreprise est composé de deux profils : Employé et Administrateur.
- L'administrateur hérite des droits de l'employé et dispose de privilèges supplémentaires.
- Les aspects techniques (architecture, bases de données, authentification, etc.) feront l'objet de documents de conception dédiés.

---