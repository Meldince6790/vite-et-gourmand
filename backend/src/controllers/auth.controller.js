const authService = require("../services/auth.service");

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const utilisateur = await authService.login(email, password);

      res.status(200).json(utilisateur);
    } catch (error) {
      console.error(error);

      if (error.message === "Identifiants incorrects.") {
        return res.status(401).json({
          message: error.message,
        });
      }

      res.status(500).json({
        message: "Erreur interne du serveur.",
      });
    }
  },
};

module.exports = authController;
