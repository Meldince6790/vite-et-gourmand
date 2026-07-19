const horaireService = require("../services/horaire.service");

exports.getAll = async (req, res) => {
  try {
    const horaires = await horaireService.getAllHoraires();

    res.json(horaires);
  } catch (error) {
    res.status(500).json({
      message: "Erreur récupération horaires",
      error: error.message,
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const horaire = await horaireService.getHoraireById(req.params.id);

    if (!horaire) {
      return res.status(404).json({
        message: "Horaire introuvable",
      });
    }

    res.json(horaire);
  } catch (error) {
    res.status(500).json({
      message: "Erreur récupération horaire",
      error: error.message,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await horaireService.createHoraire(req.body);

    res.status(201).json({
      message: "Horaire créé avec succès.",
      horaire_id: id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur création horaire",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await horaireService.updateHoraire(req.params.id, req.body);

    if (!result) {
      return res.status(404).json({
        message: "Horaire introuvable",
      });
    }

    res.json({
      message: "Horaire modifié avec succès.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur modification horaire",
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await horaireService.deleteHoraire(req.params.id);

    if (!result) {
      return res.status(404).json({
        message: "Horaire introuvable",
      });
    }

    res.json({
      message: "Horaire supprimé avec succès.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur suppression horaire",
      error: error.message,
    });
  }
};
