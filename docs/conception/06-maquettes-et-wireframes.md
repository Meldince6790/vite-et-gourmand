# Maquettes et wireframes

## 1. Introduction

Un **wireframe** (maquette filaire) représente la structure d’un écran : zones, hiérarchie, contenus et actions principales. Il reste volontairement basique (noir et blanc, rectangles, libellés, placeholders).

Une **maquette** (mockup haute fidélité) applique ensuite l’identité visuelle : couleurs, typographie, icônes, photographies et rendu responsive proche du produit final.

Les wireframes basse fidélité servent à :

- valider l’organisation des écrans avant le design détaillé ;
- clarifier les parcours utilisateur (navigation, filtres, commande, authentification) ;
- distinguer ce qui est déjà implémenté de ce qui est prévu par le sujet ECF.

Le sujet demande l’export de wireframes et de mockups pour **3 écrans bureautiques** et **3 écrans mobiles**. Les six wireframes et les six maquettes haute fidélité correspondantes constituent ce livrable.

## 2. Écrans retenus

| #   | Support | Écran                                      | Wireframe                                                                                                                     | Maquette haute fidélité                                              |
| --- | ------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Desktop | Accueil                                    | [SVG](../wireframes/wireframe-desktop-accueil.svg) · [PlantUML](../wireframes/wireframe-desktop-accueil.puml)                 | [Accueil - Desktop.png](../maquettes/desktop/Accueil%20-%20Desktop.png) |
| 2   | Desktop | Catalogue des menus                        | [SVG](../wireframes/wireframe-desktop-menus.svg) · [PlantUML](../wireframes/wireframe-desktop-menus.puml)                     | [Menus - Desktop.png](../maquettes/desktop/Menus%20-%20Desktop.png) |
| 3   | Desktop | Commande d’un menu                         | [SVG](../wireframes/wireframe-desktop-commande.svg) · [PlantUML](../wireframes/wireframe-desktop-commande.puml)               | [Commande - Desktop.png](../maquettes/desktop/Commande%20-%20Desktop.png) |
| 4   | Mobile  | Accueil                                    | [SVG](../wireframes/wireframe-mobile-accueil.svg) · [PlantUML](../wireframes/wireframe-mobile-accueil.puml)                   | [Mobile - Accueil.png](../maquettes/mobile/Mobile%20-%20Accueil.png) |
| 5   | Mobile  | Catalogue des menus                        | [SVG](../wireframes/wireframe-mobile-menus.svg) · [PlantUML](../wireframes/wireframe-mobile-menus.puml)                       | [Mobile - Menus.png](../maquettes/mobile/Mobile%20-%20Menus.png) |
| 6   | Mobile  | Authentification (Connexion / Inscription) | [SVG](../wireframes/wireframe-mobile-authentification.svg) · [PlantUML](../wireframes/wireframe-mobile-authentification.puml) | [Mobile - Authentification.png](../maquettes/mobile/Mobile%20-%20Authentification.png) |

---

## 3. Wireframe 1 — Desktop Accueil

Page d’entrée du site : navigation principale, hero avec appel à l’action vers le catalogue, présentation de l’entreprise, mise en avant du professionnalisme / de l’équipe, avis clients validés, pied de page (horaires, mentions légales, CGV).

- Rendu SVG : [wireframe-desktop-accueil.svg](../wireframes/wireframe-desktop-accueil.svg)
- Source PlantUML : [wireframe-desktop-accueil.puml](../wireframes/wireframe-desktop-accueil.puml)
- Statut : **Wireframe réalisé**
- Maquette haute fidélité : **Réalisée** — [Accueil - Desktop.png](../maquettes/desktop/Accueil%20-%20Desktop.png)

---

## 4. Wireframe 2 — Desktop Catalogue des menus

Liste filtrable des menus : filtres (prix maximum, fourchette, thème, régime, nombre minimum de personnes), grille de cartes (image, titre, description courte, minimum de personnes, prix, bouton « Voir le détail »), header et footer desktop.

- Rendu SVG : [wireframe-desktop-menus.svg](../wireframes/wireframe-desktop-menus.svg)
- Source PlantUML : [wireframe-desktop-menus.puml](../wireframes/wireframe-desktop-menus.puml)
- Statut : **Wireframe réalisé**
- Maquette haute fidélité : **Réalisée** — [Menus - Desktop.png](../maquettes/desktop/Menus%20-%20Desktop.png)

---

## 5. Wireframe 3 — Desktop Commande d’un menu

Formulaire de commande : récapitulatif du menu choisi, informations client, informations de prestation (adresse, date, heure, lieu), nombre de personnes, récapitulatif des prix (menu, livraison, remise, total), bouton de validation et mention d’un e-mail de confirmation.

- Rendu SVG : [wireframe-desktop-commande.svg](../wireframes/wireframe-desktop-commande.svg)
- Source PlantUML : [wireframe-desktop-commande.puml](../wireframes/wireframe-desktop-commande.puml)
- Statut : **Wireframe réalisé**
- Maquette haute fidélité : **Réalisée** — [Commande - Desktop.png](../maquettes/desktop/Commande%20-%20Desktop.png)

---

## 6. Wireframe 4 — Mobile Accueil

Adaptation mobile de l’accueil : header compact (logo + menu burger), hero réduit, CTA « Découvrir nos menus », présentation courte, une carte avis / placeholder de carrousel, footer (horaires et liens légaux).

- Rendu SVG : [wireframe-mobile-accueil.svg](../wireframes/wireframe-mobile-accueil.svg)
- Source PlantUML : [wireframe-mobile-accueil.puml](../wireframes/wireframe-mobile-accueil.puml)
- Statut : **Wireframe réalisé**
- Maquette haute fidélité : **Réalisée** — [Mobile - Accueil.png](../maquettes/mobile/Mobile%20-%20Accueil.png)

---

## 7. Wireframe 5 — Mobile Catalogue des menus

Catalogue en liste verticale : bouton « Filtres » avec panneau replié, cartes empilées (image, titre, minimum de personnes, prix, « Voir le détail »), header et footer mobile.

- Rendu SVG : [wireframe-mobile-menus.svg](../wireframes/wireframe-mobile-menus.svg)
- Source PlantUML : [wireframe-mobile-menus.puml](../wireframes/wireframe-mobile-menus.puml)
- Statut : **Wireframe réalisé**
- Maquette haute fidélité : **Réalisée** — [Mobile - Menus.png](../maquettes/mobile/Mobile%20-%20Menus.png)

---

## 8. Wireframe 6 — Mobile Authentification

Écran « Mon compte » avec onglets **Connexion** et **Inscription**. Connexion : e-mail, mot de passe, bouton, lien « Mot de passe oublié ? ». Inscription : identité, coordonnées, mots de passe, règles de complexité, bouton de création et note sur l’e-mail de bienvenue.

- Rendu SVG : [wireframe-mobile-authentification.svg](../wireframes/wireframe-mobile-authentification.svg)
- Source PlantUML : [wireframe-mobile-authentification.puml](../wireframes/wireframe-mobile-authentification.puml)
- Statut : **Wireframe réalisé**
- Maquette haute fidélité : **Réalisée** — [Mobile - Authentification.png](../maquettes/mobile/Mobile%20-%20Authentification.png)

---

## 9. Fonctionnalités représentées dans les maquettes

Les wireframes et maquettes anticipent certains éléments du parcours. Leur statut dans l’application actuelle est le suivant.

### Implémentées

- inscription client ;
- e-mail de bienvenue après inscription ;
- e-mail de confirmation de commande ;
- envoi d’e-mail via le formulaire de contact (notification et accusé de réception, selon la configuration `EMAIL_PROVIDER`).

### Encore prévues ou partielles

- réinitialisation du mot de passe (« Mot de passe oublié ? ») : lien présent dans l’interface, sans parcours fonctionnel complet ;
- notifications e-mail lors des changements de statut de commande ;
- e-mail de création de compte employé.

---

## 10. Mockups haute fidélité réalisés

Les six écrans retenus disposent d’une maquette haute fidélité au format PNG dans `docs/maquettes/` :

1. Accueil (desktop) — [Accueil - Desktop.png](../maquettes/desktop/Accueil%20-%20Desktop.png)
2. Catalogue des menus (desktop) — [Menus - Desktop.png](../maquettes/desktop/Menus%20-%20Desktop.png)
3. Commande d’un menu (desktop) — [Commande - Desktop.png](../maquettes/desktop/Commande%20-%20Desktop.png)
4. Accueil (mobile) — [Mobile - Accueil.png](../maquettes/mobile/Mobile%20-%20Accueil.png)
5. Catalogue des menus (mobile) — [Mobile - Menus.png](../maquettes/mobile/Mobile%20-%20Menus.png)
6. Authentification Connexion / Inscription (mobile) — [Mobile - Authentification.png](../maquettes/mobile/Mobile%20-%20Authentification.png)

---

## 11. Note sur les maquettes haute fidélité

Les mockups appliquent :

- l’identité visuelle existante (vert / beige) ;
- la typographie retenue dans la charte ;
- les icônes ;
- les photographies (produits, équipe, ambiance) ;
- la mise en page responsive alignée sur ces wireframes.
