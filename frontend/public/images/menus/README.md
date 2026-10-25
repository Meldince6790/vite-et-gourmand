# Photos des cartes catalogue

Mapping applicatif : `frontend/src/data/menuImages.js`.

Catalogue cible : **8 menus** (ids 1–6, 8, 15). Format cible typique des WebP : 1 200 × 750.

## Images dédiées (actives)

`USE_DEDICATED_MENU_IMAGES = true` — chaque menu conservé a son WebP :

| Fichier | Menu |
|---------|------|
| `menu-01-entreprise-classique.webp` | Menu Entreprise Classique |
| `menu-02-vegetarien-gourmand.webp` | Menu Végétarien Gourmand |
| `menu-03-mariage-vegan.webp` | Menu Mariage Végan |
| `menu-04-cocktail-dinatoire.webp` | Menu Cocktail Dinatoire |
| `menu-05-buffet-traditionnel.webp` | Menu Buffet Traditionnel |
| `menu-06-gastronomique-signature.webp` | Menu Gastronomique Signature |
| `menu-08-estival-mediterraneen.webp` | Menu Estival Méditerranéen |
| `menu-15-brunch-festif.webp` | Menu Brunch Festif |

## Fallback (titres inconnus)

Pour un menu futur non mappé : `MENU_IMAGE_PLACEHOLDER` →
`/images/plats/plat-placeholder.svg` (asset neutre partagé avec le catalogue plats).

Les anciens fichiers génériques seed (`menu-entreprise.webp`,
`menu-vegetarien.webp`, `menu-vegan.webp`) ont été retirés après l’intégration
des huit photographies dédiées.
