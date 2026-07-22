const mongoose = require("mongoose");

const statistiqueSchema = new mongoose.Schema(
  {
    menu_id: {
      type: Number,
      required: true,
    },

    nom_menu: {
      type: String,
      required: true,
    },

    nombre_commandes: {
      type: Number,
      default: 0,
    },

    chiffre_affaires: {
      type: Number,
      default: 0,
    },

    periode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  },
);

module.exports = mongoose.model("Statistique", statistiqueSchema);
