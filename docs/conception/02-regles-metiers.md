# Règles métier

## Objectif

Ce document recense l'ensemble des règles métier de l'application **Vite & Gourmand**.

Il constitue une référence tout au long du projet afin de garantir que les fonctionnalités développées respectent les exigences du cahier des charges, les décisions de conception ainsi que les bonnes pratiques de développement.

Chaque règle est identifiée, son origine est précisée, son emplacement d'implémentation est défini et son avancement est suivi.

---

# Légende

## Origine

| Valeur                | Description                                                                     |
| --------------------- | ------------------------------------------------------------------------------- |
| 📋 Cahier des charges | Exigence imposée par le sujet                                                   |
| ⚙️ Conception         | Décision prise durant la phase d'analyse                                        |
| 🔒 Bonne pratique     | Choix technique visant à améliorer la qualité, la sécurité ou la maintenabilité |

---

## Implémentation

| Valeur         | Description                                      |
| -------------- | ------------------------------------------------ |
| Front          | Interface utilisateur (React)                    |
| Back           | API (Node.js / Express)                          |
| BDD            | Base de données relationnelle (MySQL)            |
| MongoDB        | Base de données non relationnelle                |
| Front + Back   | Validation côté client et côté serveur           |
| Back + BDD     | Traitement métier + contrainte SQL               |
| Back + MongoDB | Traitement métier + mise à jour des statistiques |

---

## Statut

| Valeur         | Description                             |
| -------------- | --------------------------------------- |
| ⏳ À développer | La règle n'a pas encore été implémentée |
| 🔄 En cours    | Développement en cours                  |
| ✅ Développée   | La règle est implémentée                |
| 🧪 Testée      | La règle a été validée par les tests    |

---

# 1. Gestion des utilisateurs

## 1.1 Inscription

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                                                  |
| ------ | --------------------- | -------------- | -------------- | ------------------------------------------------------------------------------------------------------------- |
| RM-001 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un visiteur peut créer un compte.                                                                             |
| RM-002 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Les informations obligatoires sont : nom, prénom, téléphone, adresse postale, adresse e-mail et mot de passe. |
| RM-003 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | L'adresse e-mail doit être unique.                                                                            |
| RM-004 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Le mot de passe doit contenir au minimum 10 caractères.                                                       |
| RM-005 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Le mot de passe doit contenir au moins une majuscule.                                                         |
| RM-006 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Le mot de passe doit contenir au moins une minuscule.                                                         |
| RM-007 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Le mot de passe doit contenir au moins un chiffre.                                                            |
| RM-008 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Le mot de passe doit contenir au moins un caractère spécial.                                                  |
| RM-009 | 📋 Cahier des charges | Back           | ⏳ À développer | Le rôle attribué automatiquement lors de l'inscription est obligatoirement « Client ».                        |
| RM-010 | 📋 Cahier des charges | Back           | ⏳ À développer | Un e-mail de bienvenue est envoyé automatiquement après l'inscription.                                        |

## 1.2 Connexion

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                |
| ------ | --------------------- | -------------- | -------------- | --------------------------------------------------------------------------- |
| RM-011 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | La connexion s'effectue à l'aide d'une adresse e-mail et d'un mot de passe. |
| RM-012 | 📋 Cahier des charges | Back           | ⏳ À développer | Les identifiants doivent être valides pour autoriser la connexion.          |
| RM-013 | 🔒 Bonne pratique     | Back           | ⏳ À développer | Les mots de passe sont stockés sous forme hachée avec bcrypt.               |
| RM-014 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un utilisateur peut demander la réinitialisation de son mot de passe.       |
| RM-015 | 📋 Cahier des charges | Back           | ⏳ À développer | Un lien de réinitialisation est envoyé par e-mail.                          |

---

# 2. Gestion des menus

## 2.1 Consultation

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                                                                                          |
| ------ | --------------------- | -------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| RM-016 | 📋 Cahier des charges | Front          | ⏳ À développer | Un visiteur peut consulter la liste des menus disponibles.                                                                                            |
| RM-017 | 📋 Cahier des charges | Front          | ⏳ À développer | Un visiteur peut consulter le détail d'un menu.                                                                                                       |
| RM-018 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un menu affiche son titre, sa description, son thème, son régime alimentaire, son prix, le nombre minimum de personnes et les plats qui le composent. |
| RM-019 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un visiteur peut filtrer les menus par thème, régime alimentaire, prix et nombre de personnes.                                                        |

## 2.2 Création

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                 |
| ------ | --------------------- | -------------- | -------------- | ---------------------------------------------------------------------------- |
| RM-020 | 📋 Cahier des charges | Back           | ⏳ À développer | Seul un employé authentifié peut créer un menu.                              |
| RM-021 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Le titre d'un menu est obligatoire.                                          |
| RM-022 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | La description d'un menu est obligatoire.                                    |
| RM-023 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un thème doit être associé à chaque menu.                                    |
| RM-024 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un régime alimentaire doit être associé à chaque menu.                       |
| RM-025 | ⚙️ Conception         | Front + Back   | ⏳ À développer | Un menu possède un nombre minimum de personnes strictement supérieur à zéro. |
| RM-026 | ⚙️ Conception         | Front + Back   | ⏳ À développer | Le prix du menu est strictement supérieur à zéro.                            |
| RM-027 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un menu possède au moins une photographie.                                   |
| RM-028 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Les conditions de commande du menu sont renseignées.                         |

---

# 2. Gestion des menus (suite)

## 2.3 Modification

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                                     |
| ------ | --------------------- | -------------- | -------------- | ------------------------------------------------------------------------------------------------ |
| RM-029 | 📋 Cahier des charges | Back           | ⏳ À développer | Seul un employé authentifié peut modifier un menu existant.                                      |
| RM-030 | ⚙️ Conception         | Back           | ⏳ À développer | Toute modification d'un menu est immédiatement prise en compte pour les consultations suivantes. |

## 2.4 Suppression

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                                           |
| ------ | --------------------- | -------------- | -------------- | ------------------------------------------------------------------------------------------------------ |
| RM-031 | 📋 Cahier des charges | Back           | ⏳ À développer | Seul un employé authentifié peut supprimer un menu.                                                    |
| RM-032 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Un menu ne peut être supprimé que si cette suppression ne compromet pas l'intégrité des données liées. |

---

# 3. Gestion des commandes

## 3.1 Création d'une commande

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                                                                    |
| ------ | --------------------- | -------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| RM-033 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Seul un client authentifié peut passer une commande.                                                                            |
| RM-034 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Une commande est obligatoirement associée à un menu existant.                                                                   |
| RM-035 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Le nombre de personnes renseigné doit être supérieur ou égal au minimum défini par le menu.                                     |
| RM-036 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Une date de livraison est obligatoire lors de la création d'une commande.                                                       |
| RM-037 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Une heure de livraison est obligatoire lors de la création d'une commande.                                                      |
| RM-038 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | L'adresse de livraison est obligatoire lors de la création d'une commande.                                                      |
| RM-039 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Le numéro de téléphone du client est obligatoire pour permettre la livraison.                                                   |
| RM-040 | ⚙️ Conception         | Back           | ⏳ À développer | Le prix total d'une commande est calculé automatiquement par le serveur à partir du menu sélectionné et du nombre de personnes. |
| RM-041 | 📋 Cahier des charges | Back           | ⏳ À développer | Les frais de déplacement sont ajoutés automatiquement au montant de la commande selon les règles tarifaires définies.           |
| RM-042 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Une commande ne peut être passée que dans le délai minimum défini par les conditions de commande du menu.                       |
| RM-043 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Une commande nouvellement créée possède automatiquement le statut « En attente ».                                               |

## 3.2 Consultation et suivi des commandes

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                    |
| ------ | --------------------- | -------------- | -------------- | ------------------------------------------------------------------------------- |
| RM-044 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un client peut consulter l'historique de ses commandes.                         |
| RM-045 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un client ne peut consulter que ses propres commandes.                          |
| RM-046 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un employé peut consulter les commandes clients afin d'assurer leur traitement. |
| RM-047 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un employé peut filtrer les commandes selon leur statut.                        |
| RM-048 | ⚙️ Conception         | Front + Back   | ⏳ À développer | Un employé peut rechercher une commande selon les informations du client.       |

## 3.3 Gestion des statuts des commandes

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                                                                                      |
| ------ | --------------------- | -------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| RM-049 | 📋 Cahier des charges | Back           | ⏳ À développer | Seul un employé authentifié peut modifier le statut d'une commande.                                                                               |
| RM-050 | 📋 Cahier des charges | Back           | ⏳ À développer | Les statuts disponibles sont : en attente, acceptée, en préparation, en cours de livraison, livrée, en attente du retour de matériel et terminée. |
| RM-051 | ⚙️ Conception         | Back           | ⏳ À développer | Une commande doit suivre l'ordre logique des étapes de traitement.                                                                                |
| RM-052 | ⚙️ Conception         | Back           | ⏳ À développer | Une commande terminée ne peut plus être modifiée.                                                                                                 |

## 3.4 Annulation d'une commande

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                                   |
| ------ | --------------------- | -------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| RM-053 | 📋 Cahier des charges | Back           | ⏳ À développer | Un employé peut annuler une commande uniquement dans le cadre prévu par les règles de gestion. |
| RM-054 | 📋 Cahier des charges | Back           | ⏳ À développer | L'annulation d'une commande nécessite de contacter le client par téléphone ou par e-mail.      |
| RM-055 | 📋 Cahier des charges | Back           | ⏳ À développer | Un motif d'annulation doit obligatoirement être renseigné.                                     |
| RM-056 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Le motif d'annulation est conservé dans l'historique de la commande.                           |

---

# 4. Gestion des plats

## 4.1 Consultation des plats

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                          |
| ------ | --------------------- | -------------- | -------------- | ------------------------------------------------------------------------------------- |
| RM-057 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Les plats associés à un menu sont visibles lors de la consultation du détail du menu. |
| RM-058 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Un plat peut être associé à plusieurs menus.                                          |
| RM-059 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Un plat conserve ses informations indépendamment des menus auxquels il est associé.   |

## 4.2 Création d'un plat

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                |
| ------ | --------------------- | -------------- | -------------- | --------------------------------------------------------------------------- |
| RM-060 | 📋 Cahier des charges | Back           | ⏳ À développer | Seul un employé authentifié peut créer un plat.                             |
| RM-061 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Le nom du plat est obligatoire.                                             |
| RM-062 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | La description du plat est obligatoire.                                     |
| RM-063 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Le type du plat doit être renseigné (entrée, plat ou dessert).              |
| RM-064 | ⚙️ Conception         | Front + Back   | ⏳ À développer | Un plat doit être associé à au moins un menu pour être proposé aux clients. |

---

# 4. Gestion des plats (suite)

## 4.3 Modification d'un plat

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                        |
| ------ | --------------------- | -------------- | -------------- | ----------------------------------------------------------------------------------- |
| RM-065 | 📋 Cahier des charges | Back           | ⏳ À développer | Seul un employé authentifié peut modifier un plat existant.                         |
| RM-066 | ⚙️ Conception         | Back           | ⏳ À développer | Toute modification d'un plat est répercutée dans les menus auxquels il est associé. |

## 4.4 Suppression d'un plat

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                       |
| ------ | --------------------- | -------------- | -------------- | ---------------------------------------------------------------------------------- |
| RM-067 | 📋 Cahier des charges | Back           | ⏳ À développer | Seul un employé authentifié peut supprimer un plat.                                |
| RM-068 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | La suppression d'un plat ne doit pas compromettre l'intégrité des menus existants. |

---

# 5. Gestion des allergènes

## 5.1 Consultation des allergènes

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                     |
| ------ | --------------------- | -------------- | -------------- | -------------------------------------------------------------------------------- |
| RM-069 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Les allergènes associés à un plat sont visibles lors de la consultation du menu. |
| RM-070 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Un plat peut être associé à plusieurs allergènes.                                |
| RM-071 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Un allergène peut être associé à plusieurs plats.                                |

## 5.2 Gestion des allergènes

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                                                                        |
| ------ | --------------------- | -------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| RM-072 | 📋 Cahier des charges | Back           | ⏳ À développer | Seul un employé authentifié peut associer un allergène à un plat.                                                                   |
| RM-073 | 📋 Cahier des charges | Back           | ⏳ À développer | Seul un employé authentifié peut retirer un allergène associé à un plat.                                                            |
| RM-074 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Un même allergène ne peut pas être associé plusieurs fois au même plat.                                                             |
| RM-075 | 🔒 Bonne pratique     | Back           | ⏳ À développer | Les informations concernant les allergènes doivent rester fiables et ne peuvent pas être modifiées par un utilisateur non autorisé. |

---

# 6. Gestion des régimes alimentaires

## 6.1 Consultation des régimes

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                         |
| ------ | --------------------- | -------------- | -------------- | ------------------------------------------------------------------------------------ |
| RM-076 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Le régime alimentaire associé à un menu est visible lors de la consultation du menu. |
| RM-077 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un visiteur peut filtrer les menus selon leur régime alimentaire.                    |
| RM-078 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Chaque menu possède un unique régime alimentaire associé.                            |
| RM-079 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Un régime alimentaire peut être associé à plusieurs menus.                           |

## 6.2 Gestion des régimes

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                       |
| ------ | --------------------- | -------------- | -------------- | ---------------------------------------------------------------------------------- |
| RM-080 | 📋 Cahier des charges | Back           | ⏳ À développer | Seul un employé authentifié peut modifier le régime alimentaire associé à un menu. |
| RM-081 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Un menu ne peut pas être créé sans régime alimentaire associé.                     |

---

# 7. Gestion des thèmes

## 7.1 Consultation des thèmes

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                            |
| ------ | --------------------- | -------------- | -------------- | ----------------------------------------------------------------------- |
| RM-082 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Le thème associé à un menu est visible lors de la consultation du menu. |
| RM-083 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un visiteur peut filtrer les menus selon leur thème.                    |
| RM-084 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Chaque menu possède un unique thème associé.                            |
| RM-085 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Un thème peut être associé à plusieurs menus.                           |

## 7.2 Gestion des thèmes

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                          |
| ------ | --------------------- | -------------- | -------------- | --------------------------------------------------------------------- |
| RM-086 | 📋 Cahier des charges | Back           | ⏳ À développer | Seul un employé authentifié peut modifier le thème associé à un menu. |
| RM-087 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Un menu ne peut pas être créé sans thème associé.                     |

---

# 8. Gestion des horaires

## 8.1 Consultation des horaires

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                          |
| ------ | --------------------- | -------------- | -------------- | ------------------------------------------------------------------------------------- |
| RM-088 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Les horaires d'ouverture de l'entreprise sont accessibles aux visiteurs.              |
| RM-089 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Les horaires affichés correspondent aux informations enregistrées en base de données. |

## 8.2 Gestion des horaires

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                                           |
| ------ | --------------------- | -------------- | -------------- | ------------------------------------------------------------------------------------------------------ |
| RM-090 | 📋 Cahier des charges | Back           | ⏳ À développer | Seul un employé authentifié peut modifier les horaires de l'entreprise.                                |
| RM-091 | ⚙️ Conception         | Front + Back   | ⏳ À développer | Les horaires renseignés doivent respecter un format horaire valide.                                    |
| RM-092 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Les horaires sont stockés sous forme de chaîne de caractères conformément au modèle de données défini. |


---

# 9. Gestion des employés

## 9.1 Création des comptes employés

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                  |
| ------ | --------------------- | -------------- | -------------- | ------------------------------------------------------------- |
| RM-093 | 📋 Cahier des charges | Back           | ⏳ À développer | Seul un administrateur peut créer un compte employé.          |
| RM-094 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | La création d'un compte employé nécessite une adresse e-mail. |
| RM-095 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Chaque employé possède un identifiant interne unique.         |
| RM-096 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Un compte employé est actif par défaut lors de sa création.   |

## 9.2 Gestion des comptes employés

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                     |
| ------ | --------------------- | -------------- | -------------- | -------------------------------------------------------------------------------- |
| RM-097 | 📋 Cahier des charges | Back           | ⏳ À développer | Un administrateur peut désactiver un compte employé.                             |
| RM-098 | ⚙️ Conception         | Back + BDD     | ⏳ À développer | Un employé dont le compte est désactivé ne peut plus accéder à l'application.    |
| RM-099 | ⚙️ Conception         | Back           | ⏳ À développer | La désactivation d'un compte employé conserve les données historiques associées. |

## 9.3 Droits et actions des employés

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                            |
| ------ | --------------------- | -------------- | -------------- | ----------------------------------------------------------------------- |
| RM-100 | 📋 Cahier des charges | Back           | ⏳ À développer | Un employé authentifié peut gérer les menus.                            |
| RM-101 | 📋 Cahier des charges | Back           | ⏳ À développer | Un employé authentifié peut gérer les plats.                            |
| RM-102 | 📋 Cahier des charges | Back           | ⏳ À développer | Un employé authentifié peut gérer les horaires.                         |
| RM-103 | 📋 Cahier des charges | Back           | ⏳ À développer | Un employé authentifié peut consulter et traiter les commandes clients. |
| RM-104 | 📋 Cahier des charges | Back           | ⏳ À développer | Un employé peut modifier le statut d'une commande.                      |
| RM-105 | 📋 Cahier des charges | Back           | ⏳ À développer | Un employé ne peut pas créer ou modifier un compte administrateur.      |

---

# 10. Gestion des administrateurs

## 10.1 Gestion des comptes employés

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                        |
| ------ | --------------------- | -------------- | -------------- | ------------------------------------------------------------------- |
| RM-106 | 📋 Cahier des charges | Back           | ⏳ À développer | Seul un administrateur authentifié peut gérer les comptes employés. |
| RM-107 | 📋 Cahier des charges | Back           | ⏳ À développer | Un administrateur peut créer un compte employé.                     |
| RM-108 | 📋 Cahier des charges | Back           | ⏳ À développer | Un administrateur peut désactiver un compte employé.                |

## 10.2 Gestion des droits administrateur

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                                                     |
| ------ | --------------------- | -------------- | -------------- | ---------------------------------------------------------------------------------------------------------------- |
| RM-109 | ⚙️ Conception         | Back           | ⏳ À développer | Un administrateur possède les droits fonctionnels d'un employé.                                                  |
| RM-110 | ⚙️ Conception         | Back           | ⏳ À développer | Un administrateur possède des droits supplémentaires liés à la gestion des comptes internes et aux statistiques. |
| RM-111 | 📋 Cahier des charges | Back           | ⏳ À développer | La création d'un compte administrateur ne peut pas être réalisée par inscription publique.                       |

## 10.3 Consultation des statistiques

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                     |
| ------ | --------------------- | -------------- | -------------- | -------------------------------------------------------------------------------- |
| RM-112 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un administrateur peut consulter le nombre de commandes par menu.                |
| RM-113 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un administrateur peut comparer les performances des menus sous forme graphique. |
| RM-114 | 📋 Cahier des charges | Front + Back   | ⏳ À développer | Un administrateur peut consulter le chiffre d'affaires généré par les menus.     |

---

# 11. Gestion des statistiques MongoDB

## 11.1 Enregistrement des statistiques

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                           |
| ------ | --------------------- | -------------- | -------------- | -------------------------------------------------------------------------------------- |
| RM-115 | 📋 Cahier des charges | Back + MongoDB | ⏳ À développer | Les données nécessaires aux statistiques des commandes sont enregistrées dans MongoDB. |
| RM-116 | ⚙️ Conception         | Back + MongoDB | ⏳ À développer | Une statistique est associée à un menu identifié.                                      |
| RM-117 | ⚙️ Conception         | Back + MongoDB | ⏳ À développer | Les statistiques sont mises à jour lors des événements métier définis.                 |

## 11.2 Analyse des commandes

| ID     | Origine               | Implémentation         | Statut         | Règle métier                                                                         |
| ------ | --------------------- | ---------------------- | -------------- | ------------------------------------------------------------------------------------ |
| RM-118 | 📋 Cahier des charges | Back + MongoDB         | ⏳ À développer | Le nombre de commandes par menu peut être calculé à partir des données statistiques. |
| RM-119 | 📋 Cahier des charges | Front + Back + MongoDB | ⏳ À développer | Les statistiques peuvent être affichées sous forme graphique pour l'administrateur.  |
| RM-120 | 📋 Cahier des charges | Front + Back + MongoDB | ⏳ À développer | L'administrateur peut comparer les performances des différents menus.                |

## 11.3 Chiffre d'affaires

| ID     | Origine               | Implémentation | Statut         | Règle métier                                                                      |
| ------ | --------------------- | -------------- | -------------- | --------------------------------------------------------------------------------- |
| RM-121 | 📋 Cahier des charges | Back + MongoDB | ⏳ À développer | Le chiffre d'affaires généré par menu peut être calculé.                          |
| RM-122 | ⚙️ Conception         | Back + MongoDB | ⏳ À développer | Les montants utilisés pour les statistiques correspondent aux commandes validées. |

---

# 12. Sécurité et validation des données

## 12.1 Authentification

| ID     | Origine           | Implémentation | Statut         | Règle métier                                                                                                 |
| ------ | ----------------- | -------------- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| RM-123 | 🔒 Bonne pratique | Back           | ⏳ À développer | Les fonctionnalités nécessitant une authentification ne sont accessibles qu'aux utilisateurs connectés.      |
| RM-124 | 🔒 Bonne pratique | Back           | ⏳ À développer | L'identité de l'utilisateur connecté est vérifiée avant chaque opération nécessitant des droits spécifiques. |
| RM-125 | 🔒 Bonne pratique | Back           | ⏳ À développer | Les sessions d'authentification disposent d'une durée de validité limitée.                                   |
| RM-126 | 🔒 Bonne pratique | Back           | ⏳ À développer | Les informations sensibles d'authentification ne sont jamais exposées dans les réponses de l'API.            |
| RM-127 | 🔒 Bonne pratique | Back           | ⏳ À développer | L'authentification utilise un mécanisme sécurisé basé sur un jeton d'accès.                                  |

## 12.2 Gestion des autorisations

| ID     | Origine           | Implémentation | Statut         | Règle métier                                                                                                       |
| ------ | ----------------- | -------------- | -------------- | ------------------------------------------------------------------------------------------------------------------ |
| RM-128 | 🔒 Bonne pratique | Back           | ⏳ À développer | Chaque action protégée vérifie les permissions associées au rôle de l'utilisateur.                                 |
| RM-129 | 🔒 Bonne pratique | Back           | ⏳ À développer | Un client ne peut pas accéder aux fonctionnalités réservées aux employés ou administrateurs.                       |
| RM-130 | 🔒 Bonne pratique | Back           | ⏳ À développer | Un employé ne peut pas accéder aux fonctionnalités réservées aux administrateurs.                                  |
| RM-131 | 🔒 Bonne pratique | Back           | ⏳ À développer | Un utilisateur ne peut modifier ou supprimer que les ressources pour lesquelles il possède les droits nécessaires. |

## 12.3 Validation des données

| ID     | Origine           | Implémentation | Statut         | Règle métier                                                                          |
| ------ | ----------------- | -------------- | -------------- | ------------------------------------------------------------------------------------- |
| RM-132 | 🔒 Bonne pratique | Front + Back   | ⏳ À développer | Toutes les données reçues par l'API sont validées côté serveur avant traitement.      |
| RM-133 | 🔒 Bonne pratique | Back           | ⏳ À développer | Les données invalides sont rejetées avec un message d'erreur explicite.               |
| RM-134 | 🔒 Bonne pratique | Back           | ⏳ À développer | Les entrées utilisateurs sont contrôlées afin de limiter les risques d'injection SQL. |
| RM-135 | 🔒 Bonne pratique | Back           | ⏳ À développer | Les erreurs internes du serveur ne doivent pas exposer d'informations sensibles.      |

## 12.4 Protection des mots de passe

| ID     | Origine           | Implémentation | Statut         | Règle métier                                                                             |
| ------ | ----------------- | -------------- | -------------- | ---------------------------------------------------------------------------------------- |
| RM-136 | 🔒 Bonne pratique | Back + BDD     | ⏳ À développer | Les mots de passe sont stockés sous forme hachée et ne sont jamais enregistrés en clair. |
| RM-137 | 🔒 Bonne pratique | Back           | ⏳ À développer | Les mots de passe ne sont jamais transmis ou affichés après leur création.               |

---
