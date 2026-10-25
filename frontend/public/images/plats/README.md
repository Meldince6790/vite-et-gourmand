# Photos des plats (catalogue)

Ressources locales versionnées pour le détail des menus. Mapping applicatif :
`frontend/src/data/platImages.js`.

Catalogue cible : **19 plats** — chacun a un WebP dédié (format cible typique : 1 200 × 750).

## Principe

- Association **explicite** titre → fichier pour les 19 plats conservés.
- Sinon : `plat-placeholder.svg` (fallback de sécurité uniquement).
- **Pas** de recyclage cyclique d’une photo d’un autre plat.

La colonne MariaDB `plat.photo` (BLOB) n’alimente pas le catalogue public dans
cette version ECF.

## Seed (ids 1–9)

| Fichier | Plat |
|---------|------|
| `plat-01-salade-perigourdine.webp` | Salade périgourdine |
| `plat-02-veloute-legumes.webp` | Velouté de légumes de saison |
| `plat-03-tartare-legumes.webp` | Tartare de légumes méditerranéens |
| `plat-04-poulet-sauce-forestiere.webp` | Filet de poulet sauce forestière |
| `plat-05-curry-legumes-coco.webp` | Curry de légumes au lait de coco |
| `plat-06-risotto-legumes.webp` | Risotto aux légumes |
| `plat-07-tarte-pommes.webp` | Tarte aux pommes maison |
| `plat-08-mousse-chocolat-vegetale.webp` | Mousse au chocolat végétale |
| `plat-09-salade-fruits.webp` | Salade de fruits frais |

## Enrichissement (10 plats)

| Fichier | Plat |
|---------|------|
| `plat-mini-bouchees-saumon-aneth.webp` | Mini bouchées saumon aneth |
| `plat-quiche-legumes-jardin.webp` | Quiche aux légumes du jardin |
| `plat-filet-boeuf-sauce-poivre.webp` | Filet de bœuf sauce poivre |
| `plat-paris-brest-praline.webp` | Paris-Brest praliné |
| `plat-gaspacho-andalou.webp` | Gaspacho andalou |
| `plat-paella-traiteur.webp` | Paella du traiteur |
| `plat-clafoutis-cerises.webp` | Clafoutis aux cerises |
| `plat-soupe-oignon-gratinee.webp` | Soupe à l’oignon gratinée |
| `plat-blanquette-veau-maison.webp` | Blanquette de veau maison |
| `plat-tarte-tatin.webp` | Tarte Tatin |

Sources converties depuis `assets-a-integrer/Plats/` (PNG → WebP, qualité 85).

## Placeholder

| Fichier | Usage |
|---------|--------|
| `plat-placeholder.svg` | Création originale Vite & Gourmand — secours pour un plat futur non mappé |
