class Commande {
  constructor(data = {}) {
    Object.assign(this, data);
  }

  static calculerPrixMenu(menu, nombrePersonne) {
    let prixMenu =
      Number(menu.prix_par_personne) * Number(nombrePersonne);

    if (nombrePersonne >= Number(menu.nombre_personne_minimum) + 5) {
      prixMenu *= 0.9;
    }

    return Number(prixMenu.toFixed(2));
  }

  static calculerPrixLivraison(distanceKm) {
    let prixLivraison = 0;

    if (distanceKm > 0) {
      prixLivraison = 5 + 0.59 * distanceKm;
    }

    return Number(prixLivraison.toFixed(2));
  }

  calculerTotal() {
    return Number(
      (Number(this.prix_menu) + Number(this.prix_livraison)).toFixed(2),
    );
  }

  peutEtreModifieeParClient() {
    return this.statut === "En attente";
  }

  peutEtreAnnuleeParClient() {
    return this.statut === "En attente";
  }

  static normaliserInformationsComplementaires(value) {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value !== "string") {
      throw new Error(
        "Les informations complémentaires doivent être une chaîne de caractères.",
      );
    }

    const trimmed = value.trim();

    if (trimmed === "") {
      return null;
    }

    if (trimmed.length > 500) {
      throw new Error(
        "Les informations complémentaires ne doivent pas dépasser 500 caractères.",
      );
    }

    return trimmed;
  }

  static initialiserCreation(input, menu, date = new Date()) {
    const nombrePersonne = input.nombre_personne;
    const prixMenu = Commande.calculerPrixMenu(menu, nombrePersonne);
    const prixLivraison = Commande.calculerPrixLivraison(input.distance_km);

    return new Commande({
      ...input,
      numero_commande: `CMD-${date.getTime()}`,
      date_commande: date,
      statut: "En attente",
      prix_menu: prixMenu,
      prix_livraison: prixLivraison,
      informations_complementaires:
        Commande.normaliserInformationsComplementaires(
          input.informations_complementaires,
        ),
      pret_materiel:
        input.pret_materiel === undefined ? false : input.pret_materiel,
      restitution_materiel:
        input.restitution_materiel === undefined
          ? false
          : input.restitution_materiel,
    });
  }
}

module.exports = Commande;
