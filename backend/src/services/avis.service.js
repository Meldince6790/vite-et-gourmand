const Avis = require("../models/avis.model");
const db = require("../config/database");

function createAvisService({ avisModel = Avis, database = db } = {}) {
  const avisService = {
    async getAll() {
      return await avisModel.getAll();
    },

    async getById(id) {
      return await avisModel.getById(id);
    },

    async create(data) {
      if (data.note === undefined || data.note === null || data.note === "") {
        throw new Error("La note est obligatoire.");
      }

      const note = Number(data.note);

      if (!Number.isInteger(note) || note < 1 || note > 5) {
        throw new Error("La note doit être comprise entre 1 et 5.");
      }

      if (typeof data.description !== "string") {
        throw new Error("Le commentaire est obligatoire.");
      }

      const description = data.description.trim();

      if (!description) {
        throw new Error("Le commentaire est obligatoire.");
      }

      if (description.length > 500) {
        throw new Error("Le commentaire ne peut pas dépasser 500 caractères.");
      }

      const [commandes] = await database.query(
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

      const [avisActifs] = await database.query(
        `
          SELECT avis_id
          FROM avis
          WHERE utilisateur_id = ?
          AND statut IN (?, ?)
          LIMIT 1
        `,
        [data.utilisateur_id, "En attente", "Validé"],
      );

      if (avisActifs.length > 0) {
        throw new Error(
          "Vous avez déjà déposé un avis en attente ou validé.",
        );
      }

      return await avisModel.create({
        note,
        description,
        statut: "En attente",
        utilisateur_id: data.utilisateur_id,
      });
    },

    async update(id, data) {
      if (data.note !== undefined) {
        const note = Number(data.note);

        if (!Number.isInteger(note) || note < 1 || note > 5) {
          throw new Error("La note doit être comprise entre 1 et 5.");
        }

        data.note = note;
      }

      if (
        data.statut &&
        !["En attente", "Validé", "Refusé"].includes(data.statut)
      ) {
        throw new Error("Statut d'avis invalide.");
      }

      return await avisModel.update(id, data);
    },

    async delete(id) {
      return await avisModel.delete(id);
    },
  };

  return avisService;
}

const avisService = createAvisService();

module.exports = avisService;
module.exports.createAvisService = createAvisService;
