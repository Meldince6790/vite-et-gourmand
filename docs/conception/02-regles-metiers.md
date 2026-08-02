# Règles métier

## Objectif

Ce document présente les principales règles métier de l'application **Vite & Gourmand**.

Il permet de faire le lien entre :

- les exigences du cahier des charges ;
- les choix de conception ;
- les fonctionnalités réellement développées.

Chaque règle précise son origine, son emplacement d'implémentation et son état d'avancement.

---

# Légende

## Origine

| Valeur                | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| 📋 Cahier des charges | Règle imposée par le sujet                                        |
| ⚙️ Conception         | Décision prise durant l'analyse du projet                         |
| 🔒 Bonne pratique     | Choix technique visant la sécurité ou la qualité du développement |

## Implémentation

| Valeur       | Description                                 |
| ------------ | ------------------------------------------- |
| Front        | Interface React                             |
| Back         | API Node.js / Express                       |
| BDD          | Base MySQL                                  |
| MongoDB      | Base MongoDB utilisée pour les statistiques |
| Front + Back | Validation côté client et serveur           |

## Statut

| Valeur          | Description                          |
| --------------- | ------------------------------------ |
| ⏳ À développer | Fonctionnalité non réalisée          |
| 🧪 Testée       | Fonctionnalité développée et validée |

---

# 1. Gestion des utilisateurs

| ID     | Origine               | Implémentation | Statut    | Règle métier                                                                  |
| ------ | --------------------- | -------------- | --------- | ----------------------------------------------------------------------------- |
| RM-001 | 📋 Cahier des charges | Front + Back   | 🧪 Testée | Un visiteur peut créer un compte client.                                      |
| RM-002 | 📋 Cahier des charges | Front + Back   | 🧪 Testée | Les informations obligatoires d'inscription sont contrôlées.                  |
| RM-003 | ⚙️ Conception         | Back + BDD     | 🧪 Testée | L'adresse e-mail d'un utilisateur doit être unique.                           |
| RM-004 | 📋 Cahier des charges | Front + Back   | 🧪 Testée | Les règles de sécurité du mot de passe sont appliquées.                       |
| RM-005 | 📋 Cahier des charges | Front + Back   | 🧪 Testée | Un utilisateur peut se connecter avec son adresse e-mail et son mot de passe. |
| RM-006 | 🔒 Bonne pratique     | Back           | 🧪 Testée | L'authentification utilise un système sécurisé basé sur un jeton JWT.         |
| RM-007 | 🔒 Bonne pratique     | Back           | 🧪 Testée | Les accès aux fonctionnalités sont contrôlés selon le rôle utilisateur.       |

---

# 2. Gestion des rôles et autorisations

| ID     | Origine           | Implémentation | Statut    | Règle métier                                                                                 |
| ------ | ----------------- | -------------- | --------- | -------------------------------------------------------------------------------------------- |
| RM-008 | ⚙️ Conception     | BDD            | 🧪 Testée | Les utilisateurs possèdent un rôle : Client, Employé ou Administrateur.                      |
| RM-009 | 🔒 Bonne pratique | Back           | 🧪 Testée | Les routes protégées nécessitent une authentification valide.                                |
| RM-010 | 🔒 Bonne pratique | Back           | 🧪 Testée | Un client ne peut pas accéder aux fonctionnalités réservées aux employés ou administrateurs. |
| RM-011 | 🔒 Bonne pratique | Back           | 🧪 Testée | Un employé ne peut pas accéder aux fonctionnalités réservées aux administrateurs.            |

---

# 3. Gestion des menus

## Consultation

| ID     | Origine               | Implémentation | Statut    | Règle métier                                                                                                                          |
| ------ | --------------------- | -------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| RM-012 | 📋 Cahier des charges | Front + Back   | 🧪 Testée | Les visiteurs peuvent consulter les menus disponibles.                                                                                |
| RM-013 | 📋 Cahier des charges | Front + Back   | 🧪 Testée | Le détail d'un menu affiche l'ensemble des informations nécessaires à sa consultation.                                                |
| RM-014 | ⚙️ Conception         | Back + BDD     | 🧪 Testée | Les menus sont récupérés depuis la base MySQL.                                                                                        |
| RM-061 | ⚙️ Conception         | Front          | 🧪 Testée | Le catalogue public peut être filtré côté interface selon le thème, le régime alimentaire, le prix maximum et le nombre de personnes. |
| RM-062 | ⚙️ Conception         | Front          | 🧪 Testée | Plusieurs filtres actifs se combinent avec une logique ET.                                                                            |
| RM-063 | ⚙️ Conception         | Front          | 🧪 Testée | L'action « Réinitialiser » restaure l'ensemble du catalogue et affiche un message lorsqu'aucun résultat ne correspond aux critères.   |

#### Détail de la règle RM-013

Le détail d'un menu affiche :

- le titre ;
- la description ;
- le thème ;
- le régime alimentaire ;
- le prix par personne ;
- le nombre minimum de personnes ;
- la quantité restante ;
- les conditions du menu ;
- les plats associés ;
- les allergènes des plats ;
- l'information relative à la remise de 10 % lorsque le seuil applicable est atteint.

## Gestion

| ID     | Origine               | Implémentation | Statut    | Règle métier                                                                                |
| ------ | --------------------- | -------------- | --------- | ------------------------------------------------------------------------------------------- |
| RM-015 | 📋 Cahier des charges | Back           | 🧪 Testée | Seul un employé ou un administrateur authentifié peut créer, modifier ou supprimer un menu. |
| RM-016 | ⚙️ Conception         | Front + Back   | 🧪 Testée | Les données obligatoires d'un menu sont contrôlées avant enregistrement.                    |
| RM-017 | ⚙️ Conception         | Back + BDD     | 🧪 Testée | Les associations entre menus, plats, thèmes et régimes respectent l'intégrité des données.  |

---

# 4. Gestion des plats et associations

| ID     | Origine               | Implémentation     | Statut    | Règle métier                                                                                                        |
| ------ | --------------------- | ------------------ | --------- | ------------------------------------------------------------------------------------------------------------------- |
| RM-018 | 📋 Cahier des charges | Front + Back       | 🧪 Testée | Les plats associés à un menu sont visibles lors de sa consultation.                                                 |
| RM-019 | ⚙️ Conception         | BDD                | 🧪 Testée | Un plat peut appartenir à plusieurs menus grâce aux tables d'association.                                           |
| RM-020 | ⚙️ Conception         | Front + Back + BDD | 🧪 Testée | Les allergènes sont gérés par association entre plats et allergènes et sont affichés dans le détail public du menu. |
| RM-021 | 📋 Cahier des charges | Back               | 🧪 Testée | La gestion des plats est réservée aux utilisateurs autorisés.                                                       |

---

# 5. Gestion des commandes

| ID     | Origine               | Implémentation | Statut    | Règle métier                                                                                                                                                                                                |
| ------ | --------------------- | -------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RM-022 | 📋 Cahier des charges | Front + Back   | 🧪 Testée | Seul un client authentifié peut créer une commande.                                                                                                                                                         |
| RM-023 | 📋 Cahier des charges | Front + Back   | 🧪 Testée | Une commande doit être associée à un menu existant.                                                                                                                                                         |
| RM-024 | ⚙️ Conception         | Back           | 🧪 Testée | Le serveur calcule automatiquement les montants d'une commande (prix du menu, remise éventuelle, frais de livraison et total).                                                                              |
| RM-025 | 📋 Cahier des charges | Back           | 🧪 Testée | Les frais de livraison sont calculés selon la formule `5 + 0,59 × distance_km` (0 € si la distance est nulle ou absente).                                                                                   |
| RM-026 | 📋 Cahier des charges | Front + Back   | 🧪 Testée | Un employé peut consulter et traiter les commandes clients (suivi des statuts et annulation).                                                                                                               |
| RM-041 | ⚙️ Conception         | Back + BDD     | 🧪 Testée | Une commande créée démarre au statut « En attente ». Les statuts autorisés sont : En attente, Acceptée, En préparation, En cours de livraison, Livrée, En attente du retour de matériel, Terminée, Annulée. |
| RM-042 | ⚙️ Conception         | Back + BDD     | 🧪 Testée | La création et la modification de quantité d'une commande vérifient le stock du menu et le mettent à jour dans une transaction MySQL.                                                                       |
| RM-043 | ⚙️ Conception         | Back + BDD     | 🧪 Testée | L'annulation d'une commande restaure le stock du menu concerné.                                                                                                                                             |
| RM-044 | ⚙️ Conception         | Front + Back   | 🧪 Testée | Un client peut modifier ou annuler sa commande uniquement lorsqu'elle est au statut « En attente ».                                                                                                         |
| RM-045 | ⚙️ Conception         | Front + Back   | 🧪 Testée | Un employé peut annuler une commande non déjà annulée en renseignant un motif et un mode de contact (Téléphone ou Mail).                                                                                    |
| RM-046 | ⚙️ Conception         | Back           | 🧪 Testée | Une remise de 10 % est appliquée sur le prix du menu lorsque le nombre de personnes est supérieur ou égal au minimum du menu + 5.                                                                           |
| RM-047 | ⚙️ Conception         | Back           | 🧪 Testée | Le prix total d'une commande correspond à la somme du prix du menu (après remise éventuelle) et des frais de livraison.                                                                                     |
| RM-048 | ⚙️ Conception         | Back           | 🧪 Testée | Un e-mail de confirmation est envoyé après la création réussie d'une commande ; un e-mail d'annulation est envoyé après annulation.                                                                         |

---

# 6. Gestion des statistiques MongoDB

| ID     | Origine               | Implémentation         | Statut    | Règle métier                                                                             |
| ------ | --------------------- | ---------------------- | --------- | ---------------------------------------------------------------------------------------- |
| RM-027 | 📋 Cahier des charges | Back + MongoDB         | 🧪 Testée | Les données statistiques nécessaires aux analyses sont enregistrées dans MongoDB.        |
| RM-028 | ⚙️ Conception         | Back + MongoDB         | 🧪 Testée | Les statistiques sont mises à jour lors de la création et de l'annulation des commandes. |
| RM-029 | 📋 Cahier des charges | Back + MongoDB         | 🧪 Testée | Le nombre de commandes par menu peut être calculé.                                       |
| RM-030 | 📋 Cahier des charges | Front + Back + MongoDB | 🧪 Testée | Les statistiques peuvent être affichées sous forme graphique pour l'administrateur.      |
| RM-031 | 📋 Cahier des charges | Front + Back + MongoDB | 🧪 Testée | L'administrateur peut comparer les performances des menus.                               |

---

# 7. Gestion du chiffre d'affaires

| ID     | Origine               | Implémentation         | Statut    | Règle métier                                                                                                        |
| ------ | --------------------- | ---------------------- | --------- | ------------------------------------------------------------------------------------------------------------------- |
| RM-032 | 📋 Cahier des charges | Back + MongoDB         | 🧪 Testée | Le chiffre d'affaires généré par les menus peut être calculé.                                                       |
| RM-033 | 📋 Cahier des charges | Front + Back + MongoDB | 🧪 Testée | L'administrateur peut consulter le chiffre d'affaires sous forme graphique.                                         |
| RM-034 | 📋 Cahier des charges | Front + Back + MongoDB | 🧪 Testée | Le chiffre d'affaires peut être filtré par menu.                                                                    |
| RM-035 | 📋 Cahier des charges | Front + Back + MongoDB | 🧪 Testée | Le chiffre d'affaires peut être filtré sur une période donnée.                                                      |
| RM-036 | ⚙️ Conception         | Back + MongoDB         | 🧪 Testée | Les statistiques de chiffre d'affaires sont calculées à partir des commandes enregistrées et maintenues cohérentes. |

---

# 8. Sécurité et validation

| ID     | Origine           | Implémentation | Statut    | Règle métier                                                      |
| ------ | ----------------- | -------------- | --------- | ----------------------------------------------------------------- |
| RM-037 | 🔒 Bonne pratique | Back           | 🧪 Testée | Toutes les opérations sensibles nécessitent une authentification. |
| RM-038 | 🔒 Bonne pratique | Back           | 🧪 Testée | Les permissions sont vérifiées avant chaque action protégée.      |
| RM-039 | 🔒 Bonne pratique | Back           | 🧪 Testée | Les erreurs serveur ne retournent pas d'informations sensibles.   |
| RM-040 | 🔒 Bonne pratique | Back           | 🧪 Testée | Les données reçues par l'API sont contrôlées avant traitement.    |

---

# 9. Gestion des avis clients

| ID     | Origine               | Implémentation | Statut    | Règle métier                                                                                                                                                |
| ------ | --------------------- | -------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RM-049 | 📋 Cahier des charges | Front + Back   | 🧪 Testée | Un client peut déposer un avis uniquement s'il possède au moins une commande au statut « Terminée ».                                                        |
| RM-050 | ⚙️ Conception         | Front + Back   | 🧪 Testée | La note d'un avis est un entier compris entre 1 et 5 ; le commentaire est obligatoire et limité à 500 caractères.                                           |
| RM-051 | ⚙️ Conception         | Back           | 🧪 Testée | Tout nouvel avis est créé au statut « En attente », indépendamment de la valeur éventuelle fournie par le client.                                           |
| RM-052 | ⚙️ Conception         | Back           | 🧪 Testée | Un client ne peut pas déposer un nouvel avis s'il possède déjà un avis « En attente » ou « Validé » ; un nouvel avis est possible après un avis « Refusé ». |
| RM-053 | 📋 Cahier des charges | Front + Back   | 🧪 Testée | Un employé peut modérer les avis (validation ou refus) ; seuls les avis « Validé » sont affichés sur la page d'accueil.                                     |

---

# 10. Contact et e-mails automatiques

| ID     | Origine               | Implémentation | Statut    | Règle métier                                                                                                                                |
| ------ | --------------------- | -------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| RM-054 | 📋 Cahier des charges | Front + Back   | 🧪 Testée | Un visiteur peut envoyer un message via le formulaire de contact (nom, e-mail et message obligatoires).                                     |
| RM-055 | ⚙️ Conception         | Back           | 🧪 Testée | L'envoi du message de contact vers l'adresse configurée est bloquant ; l'accusé de réception au visiteur est tenté sans bloquer la réponse. |
| RM-056 | ⚙️ Conception         | Back           | 🧪 Testée | Un e-mail de bienvenue est envoyé après l'inscription d'un client (envoi non bloquant).                                                     |
| RM-057 | ⚙️ Conception         | Back           | 🧪 Testée | Les e-mails transactionnels (contact, bienvenue, confirmation et annulation de commande) sont gérés par un service dédié (`log` ou Resend). |

---

# 11. Horaires et informations légales

| ID     | Origine               | Implémentation | Statut    | Règle métier                                                                                         |
| ------ | --------------------- | -------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| RM-058 | 📋 Cahier des charges | Front + Back   | 🧪 Testée | Les horaires d'ouverture sont consultables publiquement et affichés dans le pied de page.            |
| RM-059 | ⚙️ Conception         | Front + Back   | 🧪 Testée | Un employé peut gérer les horaires d'ouverture.                                                      |
| RM-060 | 📋 Cahier des charges | Front          | 🧪 Testée | Les pages Mentions légales et Conditions générales de vente sont accessibles depuis le pied de page. |

---

# Bilan

Les fonctionnalités principales développées et validées concernent :

- l'architecture API Node.js / Express ;
- la connexion MySQL et l'environnement Docker Compose local ;
- la gestion des menus, plats et associations ;
- le catalogue public filtrable et le détail enrichi des menus (stock, conditions, allergènes, information de remise) ;
- l'inscription client et l'authentification JWT ;
- la gestion des rôles et la protection des routes ;
- la gestion complète des commandes (stock, statuts, annulations, calculs tarifaires) ;
- l'envoi des e-mails automatiques (contact, bienvenue, confirmation, annulation) ;
- le dépôt et la modération des avis clients ;
- l'affichage des horaires et des pages légales (mentions, CGV) ;
- l'intégration MongoDB ;
- les statistiques administrateur et le chiffre d'affaires (création/annulation, resynchronisation possible) ;
- les graphiques et les filtres par menu et période.

Les évolutions restantes concernent principalement la mise en production (hébergement cloud, HTTPS), le polish de l'expérience utilisateur et l'industrialisation (CI/CD, supervision, sauvegardes).
