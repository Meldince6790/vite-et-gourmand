const Avis = require("../models/avis.model");
const db = require("../config/database");

const avisService = {
  async getAll() {
    return await Avis.getAll();
  },

  async getById(id) {
    return await Avis.getById(id);
  },

  async create(data) {
    const note = Number(data.note);

    if (note < 1 || note > 5) {
      throw new Error("La note doit être comprise entre 1 et 5.");
    }

    if (!data.description) {
      throw new Error("Le commentaire est obligatoire.");
    }

    // Vérification qu'une commande terminée existe pour l'utilisateur
    const [commandes] = await db.query(
      `
      SELECT commande_id
      FROM commande
      WHERE utilisateur_id = ?
      AND statut = ?
      LIMIT 1
      `,
      [data.utilisateur_id, "Terminée"],
    );

    if (commandes.length === 0) {
      throw new Error(
        "Impossible de déposer un avis : aucune commande terminée trouvée.",
      );
    }

    return await Avis.create({
      ...data,
      note,
    });
  },

  async update(id, data) {
    const note = Number(data.note);

    if (note < 1 || note > 5) {
      throw new Error("La note doit être comprise entre 1 et 5.");
    }

    return await Avis.update(id, {
      ...data,
      note,
    });
  },

  async delete(id) {
    return await Avis.delete(id);
  },
};

module.exports = avisService;
