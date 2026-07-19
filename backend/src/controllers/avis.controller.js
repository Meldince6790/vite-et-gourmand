const avisService = require("../services/avis.service");

exports.getAll = async (req, res) => {
  try {
    const avis = await avisService.getAll();

    res.json(avis);
  } catch (error) {
    res.status(500).json({
      message: "Erreur récupération avis",
      error: error.message,
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const avis = await avisService.getById(req.params.id);

    if (!avis) {
      return res.status(404).json({
        message: "Avis introuvable",
      });
    }

    res.json(avis);
  } catch (error) {
    res.status(500).json({
      message: "Erreur récupération avis",
      error: error.message,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await avisService.create(req.body);

    res.status(201).json({
      message: "Avis créé avec succès.",
      avis_id: id,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await avisService.update(req.params.id, req.body);

    if (!result) {
      return res.status(404).json({
        message: "Avis introuvable",
      });
    }

    res.json({
      message: "Avis modifié avec succès.",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await avisService.delete(req.params.id);

    if (!result) {
      return res.status(404).json({
        message: "Avis introuvable",
      });
    }

    res.json({
      message: "Avis supprimé avec succès.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur suppression avis",
      error: error.message,
    });
  }
};
