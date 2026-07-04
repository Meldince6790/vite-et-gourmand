# Règles métier

## Objectif

Ce document recense l'ensemble des règles métier de l'application **Vite & Gourmand**.

Il constitue une référence tout au long du projet afin de garantir que les fonctionnalités développées respectent les exigences du cahier des charges, les décisions de conception ainsi que les bonnes pratiques de développement.

Chaque règle est identifiée, son origine est précisée, son emplacement d'implémentation est défini et son avancement est suivi.

---

# Légende

## Origine

| Valeur | Description |
|---------|-------------|
| 📋 Cahier des charges | Exigence imposée par le sujet |
| ⚙️ Conception | Décision prise durant la phase d'analyse |
| 🔒 Bonne pratique | Choix technique visant à améliorer la qualité, la sécurité ou la maintenabilité |

---

## Implémentation

| Valeur | Description |
|---------|-------------|
| Front | Interface utilisateur (React) |
| Back | API (Node.js / Express) |
| BDD | Base de données relationnelle (MySQL) |
| MongoDB | Base de données non relationnelle |
| Front + Back | Validation côté client et côté serveur |
| Back + BDD | Traitement métier + contrainte SQL |
| Back + MongoDB | Traitement métier + mise à jour des statistiques |

---

## Statut

| Valeur | Description |
|---------|-------------|
| ⏳ À développer | La règle n'a pas encore été implémentée |
| 🔄 En cours | Développement en cours |
| ✅ Développée | La règle est implémentée |
| 🧪 Testée | La règle a été validée par les tests |

---

# 1. Gestion des utilisateurs

## 1.1 Inscription

| ID | Origine | Implémentation | Statut | Règle métier |
|----|----------|----------------|--------|--------------|
| RM-001 | 📋 Cahier des charges | Front + Back | ⏳ À développer | Un visiteur peut créer un compte. |
| RM-002 | 📋 Cahier des charges | Front + Back | ⏳ À développer | Les informations obligatoires sont : nom, prénom, téléphone, adresse postale, adresse e-mail et mot de passe. |
| RM-003 | ⚙️ Conception | Back + BDD | ⏳ À développer | L'adresse e-mail doit être unique. |
| RM-004 | 📋 Cahier des charges | Front + Back | ⏳ À développer | Le mot de passe doit contenir au minimum 10 caractères. |
| RM-005 | 📋 Cahier des charges | Front + Back | ⏳ À développer | Le mot de passe doit contenir au moins une majuscule. |
| RM-006 | 📋 Cahier des charges | Front + Back | ⏳ À développer | Le mot de passe doit contenir au moins une minuscule. |
| RM-007 | 📋 Cahier des charges | Front + Back | ⏳ À développer | Le mot de passe doit contenir au moins un chiffre. |
| RM-008 | 📋 Cahier des charges | Front + Back | ⏳ À développer | Le mot de passe doit contenir au moins un caractère spécial. |
| RM-009 | 📋 Cahier des charges | Back | ⏳ À développer | Le rôle attribué lors de l'inscription est obligatoirement « Utilisateur ». |
| RM-010 | 📋 Cahier des charges | Back | ⏳ À développer | Un e-mail de bienvenue est envoyé automatiquement après l'inscription. |

## 1.2 Connexion

| ID | Origine | Implémentation | Statut | Règle métier |
|----|----------|----------------|--------|--------------|
| RM-011 | 📋 Cahier des charges | Front + Back | ⏳ À développer | La connexion s'effectue à l'aide d'une adresse e-mail et d'un mot de passe. |
| RM-012 | 📋 Cahier des charges | Back | ⏳ À développer | Les identifiants doivent être valides pour autoriser la connexion. |
| RM-013 | 🔒 Bonne pratique | Back | ⏳ À développer | Les mots de passe sont stockés sous forme hachée avec bcrypt. |
| RM-014 | 📋 Cahier des charges | Front + Back | ⏳ À développer | Un utilisateur peut demander la réinitialisation de son mot de passe. |
| RM-015 | 📋 Cahier des charges | Back | ⏳ À développer | Un lien de réinitialisation est envoyé par e-mail.