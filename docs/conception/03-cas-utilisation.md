# 03 - Cas d’utilisation

## 1. 🎯 Objectif du système

Le site Vite & Gourmand est une application web destinée à la gestion de prestations culinaires.

Il permet :
- la consultation d’un catalogue de menus et plats
- la passation de commandes en ligne (utilisateurs authentifiés uniquement)
- la prise de contact via un formulaire structuré
- la gestion interne des commandes et du catalogue par le personnel

Le système distingue clairement les utilisateurs publics et les utilisateurs internes.

---

## 2. 👥 Acteurs du système

### 🧑 Visiteur
Utilisateur non authentifié pouvant consulter le site et utiliser le formulaire de contact.

### 👤 Client
Utilisateur authentifié pouvant gérer son profil, passer commande, suivre ses commandes et déposer un avis.

### 🧑‍💼 Employé
Utilisateur interne chargé du traitement opérationnel des commandes, du catalogue et de la modération des avis.

### 🧑‍🍳 Administrateur
Utilisateur principal du système disposant de droits étendus de gestion, de supervision et d’analyse.

---

## 3. 🧑 Visiteur

### 📌 Accès au site
Le visiteur peut accéder aux pages suivantes :
- Accueil  
- Menus  
- Contact  
- Connexion / Inscription  
- Mentions légales  
- CGV  

Il peut également consulter les horaires d’ouverture affichés dans le pied de page.

---

### 🍽️ Consultation du catalogue

Le visiteur peut consulter l’ensemble des menus disponibles.

#### Fonctionnalités :
- affichage des menus
- consultation du détail d’un menu

---

### 📞 Formulaire de contact

Le visiteur peut envoyer un message au prestataire via un formulaire de contact.

#### Fonctionnalités :
- nom
- e-mail
- message
- envoi du formulaire

---

### 👤 Création de compte

Le visiteur peut créer un compte client via la page de connexion.

Informations nécessaires :
- nom ;
- prénom ;
- email ;
- mot de passe ;
- coordonnées de contact.

---

## 4. 👤 Client

### 🍽️ Accès au site
Le client dispose des mêmes accès que le visiteur.

---

### 🛒 Commandes

Le client peut passer commande.

#### Fonctionnalités :
- accès à la page de commande (authentification obligatoire)
- sélection du menu
- définition du nombre de personnes
- contrôle de la disponibilité du menu
- mise à jour du stock lors de la création, de la modification ou de l’annulation
- validation de commande
- envoi d’un e-mail de confirmation ou d’annulation selon l’action réalisée
- modification d’une commande uniquement lorsqu’elle est au statut « En attente »
- annulation d’une commande selon les règles métier

---

### 👤 Espace utilisateur

#### Fonctionnalités :
- consultation et modification du profil
- consultation de l’historique des commandes
- suivi des statuts de commande
- dépôt d’un avis après une commande au statut « Terminée »
- avis soumis au statut « En attente » avant modération

---

## 5. 🧑‍💼 Employé

### 🧑‍💻 Espace employé
Accès après authentification.

---

### 🍽️ Gestion du catalogue
- ajout de menus / plats
- modification
- suppression
- gestion des horaires

---

### 📦 Gestion des commandes
- consultation des commandes
- filtrage par statut et client
- mise à jour des statuts :
  - en attente
  - acceptée
  - en préparation
  - en cours de livraison
  - livrée
  - en attente de retour de matériel
  - terminée
  - annulée

---

### ⚠️ Annulation de commande
- contact obligatoire avec le client (appel ou email)
- saisie du motif
- indication du mode de contact

---

### 📦 Gestion du matériel prêté
- suivi du prêt de matériel
- suivi de la restitution du matériel

---

### ⭐ Modération des avis
- validation des avis
- refus des avis
- publication des avis validés

---

## 6. 🧑‍🍳 Administrateur

### 👨‍💼 Gestion des employés
- création directe de comptes employés par l’administrateur (email + mot de passe)
- désactivation de comptes
- impossibilité de créer un administrateur via l’application

---

### 🧑‍💼 Supervision employé
L’administrateur dispose des mêmes droits qu’un employé.

---

### 📊 Analyse des ventes
- nombre de commandes par menu
- comparaison via graphiques

---

### 💰 Chiffre d’affaires
- calcul du CA par menu
- filtrage par menu et période

---

## 7. 🧩 Synthèse fonctionnelle

- Visiteur : consultation des menus, avis publiés, horaires, pages légales et formulaire de contact
- Client : profil, commandes (création, suivi, modification et annulation), dépôt d’avis
- Employé : gestion du catalogue, des horaires, des commandes, du matériel et modération des avis
- Administrateur : gestion des employés, supervision opérationnelle, statistiques et chiffre d’affaires

---

## 8. Diagramme UML

### Note de lecture

Les cas d’utilisation sont représentés à un niveau fonctionnel sans détail technique.

Le diagramme suivant synthétise les cas d'utilisation décrits ci-dessus.

![Diagramme de cas d'utilisation - Vite & Gourmand](../diagrammes/cas-utilisation.svg)
