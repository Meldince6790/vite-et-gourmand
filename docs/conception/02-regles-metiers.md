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

| ID     | Origine               | Implémentation | Statut          | Règle métier                                                                  |
| ------ | --------------------- | -------------- | --------------- | ----------------------------------------------------------------------------- |
| RM-001 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un visiteur peut créer un compte client.                                      |
| RM-002 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Les informations obligatoires d'inscription sont contrôlées.                  |
| RM-003 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | L'adresse e-mail d'un utilisateur doit être unique.                           |
| RM-004 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Les règles de sécurité du mot de passe sont appliquées.                       |
| RM-005 | 📋 Cahier des charges | Front + Back   | 🧪 Testée       | Un utilisateur peut se connecter avec son adresse e-mail et son mot de passe. |
| RM-006 | 🔒 Bonne pratique     | Back           | 🧪 Testée       | L'authentification utilise un système sécurisé basé sur un jeton JWT.         |
| RM-007 | 🔒 Bonne pratique     | Back           | 🧪 Testée       | Les accès aux fonctionnalités sont contrôlés selon le rôle utilisateur.       |

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

| ID     | Origine               | Implémentation | Statut    | Règle métier                                                                                                  |
| ------ | --------------------- | -------------- | --------- | ------------------------------------------------------------------------------------------------------------- |
| RM-012 | 📋 Cahier des charges | Front + Back   | 🧪 Testée | Les visiteurs peuvent consulter les menus disponibles.                                                        |
| RM-013 | 📋 Cahier des charges | Front + Back   | 🧪 Testée | Le détail d'un menu affiche son titre, sa description, son thème, son régime, son prix et ses plats associés. |
| RM-014 | ⚙️ Conception         | Back + BDD     | 🧪 Testée | Les menus sont récupérés depuis la base MySQL.                                                                |

## Gestion

| ID     | Origine               | Implémentation | Statut    | Règle métier                                                                               |
| ------ | --------------------- | -------------- | --------- | ------------------------------------------------------------------------------------------ |
| RM-015 | 📋 Cahier des charges | Back           | 🧪 Testée | Seul un employé authentifié peut créer, modifier ou supprimer un menu.                     |
| RM-016 | ⚙️ Conception         | Front + Back   | 🧪 Testée | Les données obligatoires d'un menu sont contrôlées avant enregistrement.                   |
| RM-017 | ⚙️ Conception         | Back + BDD     | 🧪 Testée | Les associations entre menus, plats, thèmes et régimes respectent l'intégrité des données. |

---

# 4. Gestion des plats et associations

| ID     | Origine               | Implémentation | Statut    | Règle métier                                                              |
| ------ | --------------------- | -------------- | --------- | ------------------------------------------------------------------------- |
| RM-018 | 📋 Cahier des charges | Front + Back   | 🧪 Testée | Les plats associés à un menu sont visibles lors de sa consultation.       |
| RM-019 | ⚙️ Conception         | BDD            | 🧪 Testée | Un plat peut appartenir à plusieurs menus grâce aux tables d'association. |
| RM-020 | ⚙️ Conception         | BDD            | 🧪 Testée | Les allergènes sont gérés par association entre plats et allergènes.      |
| RM-021 | 📋 Cahier des charges | Back           | 🧪 Testée | La gestion des plats est réservée aux utilisateurs autorisés.             |

---

# 5. Gestion des commandes

| ID     | Origine               | Implémentation | Statut          | Règle métier                                                               |
| ------ | --------------------- | -------------- | --------------- | -------------------------------------------------------------------------- |
| RM-022 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Seul un client authentifié peut créer une commande.                        |
| RM-023 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Une commande doit être associée à un menu existant.                        |
| RM-024 | ⚙️ Conception         | Back           | ⏳ À développer | Le serveur calcule automatiquement les montants d'une commande.            |
| RM-025 | 📋 Cahier des charges | Back           | ⏳ À développer | Les frais de livraison sont calculés selon les règles tarifaires définies. |
| RM-026 | 📋 Cahier des charges | Back           | ⏳ À développer | Un employé peut consulter et traiter les commandes clients.                |

---

# 6. Gestion des statistiques MongoDB

| ID     | Origine               | Implémentation         | Statut    | Règle métier                                                                        |
| ------ | --------------------- | ---------------------- | --------- | ----------------------------------------------------------------------------------- |
| RM-027 | 📋 Cahier des charges | Back + MongoDB         | 🧪 Testée | Les données statistiques nécessaires aux analyses sont enregistrées dans MongoDB.   |
| RM-028 | ⚙️ Conception         | Back + MongoDB         | 🧪 Testée | Les statistiques sont mises à jour lors des événements métier concernés.            |
| RM-029 | 📋 Cahier des charges | Back + MongoDB         | 🧪 Testée | Le nombre de commandes par menu peut être calculé.                                  |
| RM-030 | 📋 Cahier des charges | Front + Back + MongoDB | 🧪 Testée | Les statistiques peuvent être affichées sous forme graphique pour l'administrateur. |
| RM-031 | 📋 Cahier des charges | Front + Back + MongoDB | 🧪 Testée | L'administrateur peut comparer les performances des menus.                          |

---

# 7. Gestion du chiffre d'affaires

| ID     | Origine               | Implémentation         | Statut    | Règle métier                                                                                             |
| ------ | --------------------- | ---------------------- | --------- | -------------------------------------------------------------------------------------------------------- |
| RM-032 | 📋 Cahier des charges | Back + MongoDB         | 🧪 Testée | Le chiffre d'affaires généré par les menus peut être calculé.                                            |
| RM-033 | 📋 Cahier des charges | Front + Back + MongoDB | 🧪 Testée | L'administrateur peut consulter le chiffre d'affaires sous forme graphique.                              |
| RM-034 | 📋 Cahier des charges | Front + Back + MongoDB | 🧪 Testée | Le chiffre d'affaires peut être filtré par menu.                                                         |
| RM-035 | 📋 Cahier des charges | Front + Back + MongoDB | 🧪 Testée | Le chiffre d'affaires peut être filtré sur une période donnée.                                           |
| RM-036 | ⚙️ Conception         | Back + MongoDB         | 🧪 Testée | Les montants utilisés dans les statistiques correspondent aux données issues des commandes enregistrées. |

---

# 8. Sécurité et validation

| ID     | Origine           | Implémentation | Statut    | Règle métier                                                      |
| ------ | ----------------- | -------------- | --------- | ----------------------------------------------------------------- |
| RM-037 | 🔒 Bonne pratique | Back           | 🧪 Testée | Toutes les opérations sensibles nécessitent une authentification. |
| RM-038 | 🔒 Bonne pratique | Back           | 🧪 Testée | Les permissions sont vérifiées avant chaque action protégée.      |
| RM-039 | 🔒 Bonne pratique | Back           | 🧪 Testée | Les erreurs serveur ne retournent pas d'informations sensibles.   |
| RM-040 | 🔒 Bonne pratique | Back           | 🧪 Testée | Les données reçues par l'API sont contrôlées avant traitement.    |

---

# Bilan

Les fonctionnalités principales développées et validées concernent :

- l'architecture API Node.js / Express ;
- la connexion MySQL ;
- la gestion des menus et des associations ;
- l'authentification JWT ;
- la gestion des rôles ;
- la protection des routes ;
- l'intégration MongoDB ;
- les statistiques administrateur ;
- les graphiques ;
- le calcul du chiffre d'affaires ;
- les filtres du chiffre d'affaires par menu et période.

Les fonctionnalités restantes concernent principalement les éléments non développés dans le périmètre actuel, notamment certaines interfaces de gestion avancée et fonctionnalités secondaires.
