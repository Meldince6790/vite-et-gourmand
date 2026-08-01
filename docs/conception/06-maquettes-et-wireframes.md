# Maquettes et wireframes

## 1. Introduction

Un **wireframe** (maquette filaire) représente la structure d’un écran : zones, hiérarchie, contenus et actions principales. Il reste volontairement basique (noir et blanc, rectangles, libellés, placeholders).

Une **maquette** (mockup haute fidélité) applique ensuite l’identité visuelle : couleurs, typographie, icônes, photographies et rendu responsive proche du produit final.

Les wireframes basse fidélité servent à :

- valider l’organisation des écrans avant le design détaillé ;
- clarifier les parcours utilisateur (navigation, filtres, commande, authentification) ;
- distinguer ce qui est déjà implémenté de ce qui est prévu par le sujet ECF.

Le sujet demande **3 écrans desktop** et **3 écrans mobile**. Les six wireframes ci-dessous répondent à cette exigence. Les mockups haute fidélité seront produits ensuite (Figma).

---

## 2. Écrans retenus

| # | Support | Écran | Fichiers |
|---|---------|-------|----------|
| 1 | Desktop | Accueil | [SVG](../wireframes/wireframe-desktop-accueil.svg) · [PlantUML](../wireframes/wireframe-desktop-accueil.puml) |
| 2 | Desktop | Catalogue des menus | [SVG](../wireframes/wireframe-desktop-menus.svg) · [PlantUML](../wireframes/wireframe-desktop-menus.puml) |
| 3 | Desktop | Commande d’un menu | [SVG](../wireframes/wireframe-desktop-commande.svg) · [PlantUML](../wireframes/wireframe-desktop-commande.puml) |
| 4 | Mobile | Accueil | [SVG](../wireframes/wireframe-mobile-accueil.svg) · [PlantUML](../wireframes/wireframe-mobile-accueil.puml) |
| 5 | Mobile | Catalogue des menus | [SVG](../wireframes/wireframe-mobile-menus.svg) · [PlantUML](../wireframes/wireframe-mobile-menus.puml) |
| 6 | Mobile | Authentification (Connexion / Inscription) | [SVG](../wireframes/wireframe-mobile-authentification.svg) · [PlantUML](../wireframes/wireframe-mobile-authentification.puml) |

---

## 3. Wireframe 1 — Desktop Accueil

Page d’entrée du site : navigation principale, hero avec appel à l’action vers le catalogue, présentation de l’entreprise, mise en avant du professionnalisme / de l’équipe, avis clients validés, pied de page (horaires, mentions légales, CGV).

- Rendu SVG : [wireframe-desktop-accueil.svg](../wireframes/wireframe-desktop-accueil.svg)
- Source PlantUML : [wireframe-desktop-accueil.puml](../wireframes/wireframe-desktop-accueil.puml)
- Statut : **Wireframe réalisé**
- Maquette haute fidélité : **À produire dans Figma**

---

## 4. Wireframe 2 — Desktop Catalogue des menus

Liste filtrable des menus : filtres (prix maximum, fourchette, thème, régime, nombre minimum de personnes), grille de cartes (image, titre, description courte, minimum de personnes, prix, bouton « Voir le détail »), header et footer desktop.

- Rendu SVG : [wireframe-desktop-menus.svg](../wireframes/wireframe-desktop-menus.svg)
- Source PlantUML : [wireframe-desktop-menus.puml](../wireframes/wireframe-desktop-menus.puml)
- Statut : **Wireframe réalisé**
- Maquette haute fidélité : **À produire dans Figma**

---

## 5. Wireframe 3 — Desktop Commande d’un menu

Formulaire de commande : récapitulatif du menu choisi, informations client, informations de prestation (adresse, date, heure, lieu), nombre de personnes, récapitulatif des prix (menu, livraison, remise, total), bouton de validation et mention d’un e-mail de confirmation.

- Rendu SVG : [wireframe-desktop-commande.svg](../wireframes/wireframe-desktop-commande.svg)
- Source PlantUML : [wireframe-desktop-commande.puml](../wireframes/wireframe-desktop-commande.puml)
- Statut : **Wireframe réalisé**
- Maquette haute fidélité : **À produire dans Figma**

---

## 6. Wireframe 4 — Mobile Accueil

Adaptation mobile de l’accueil : header compact (logo + menu burger), hero réduit, CTA « Découvrir nos menus », présentation courte, une carte avis / placeholder de carrousel, footer (horaires et liens légaux).

- Rendu SVG : [wireframe-mobile-accueil.svg](../wireframes/wireframe-mobile-accueil.svg)
- Source PlantUML : [wireframe-mobile-accueil.puml](../wireframes/wireframe-mobile-accueil.puml)
- Statut : **Wireframe réalisé**
- Maquette haute fidélité : **À produire dans Figma**

---

## 7. Wireframe 5 — Mobile Catalogue des menus

Catalogue en liste verticale : bouton « Filtres » avec panneau replié, cartes empilées (image, titre, minimum de personnes, prix, « Voir le détail »), header et footer mobile.

- Rendu SVG : [wireframe-mobile-menus.svg](../wireframes/wireframe-mobile-menus.svg)
- Source PlantUML : [wireframe-mobile-menus.puml](../wireframes/wireframe-mobile-menus.puml)
- Statut : **Wireframe réalisé**
- Maquette haute fidélité : **À produire dans Figma**

---

## 8. Wireframe 6 — Mobile Authentification

Écran « Mon compte » avec onglets **Connexion** et **Inscription**. Connexion : e-mail, mot de passe, bouton, lien « Mot de passe oublié ? ». Inscription : identité, coordonnées, mots de passe, règles de complexité, bouton de création et note sur l’e-mail de bienvenue.

- Rendu SVG : [wireframe-mobile-authentification.svg](../wireframes/wireframe-mobile-authentification.svg)
- Source PlantUML : [wireframe-mobile-authentification.puml](../wireframes/wireframe-mobile-authentification.puml)
- Statut : **Wireframe réalisé**
- Maquette haute fidélité : **À produire dans Figma**

---

## 9. Fonctionnalités futures intégrées dans les maquettes

Les éléments suivants figurent dans les wireframes (ou y sont anticipés) alors qu’ils ne sont pas tous implémentés aujourd’hui ; ils restent exigés ou attendus dans le périmètre ECF :

- inscription client ;
- e-mail de bienvenue après inscription ;
- réinitialisation du mot de passe (« Mot de passe oublié ? ») ;
- e-mail de confirmation de commande ;
- notifications e-mail lors des changements de statut de commande ;
- e-mail de création de compte employé ;
- envoi d’e-mail via le formulaire de contact.

---

## 10. Mockups haute fidélité à produire

Les mêmes six écrans seront déclinés en maquettes haute fidélité :

1. Accueil (desktop)
2. Catalogue des menus (desktop)
3. Commande d’un menu (desktop)
4. Accueil (mobile)
5. Catalogue des menus (mobile)
6. Authentification Connexion / Inscription (mobile)

---

## 11. Note sur les maquettes haute fidélité

Les mockups appliqueront :

- l’identité visuelle existante (vert / beige) ;
- la typographie retenue dans la charte ;
- les icônes ;
- les photographies (produits, équipe, ambiance) ;
- la mise en page responsive alignée sur ces wireframes.
