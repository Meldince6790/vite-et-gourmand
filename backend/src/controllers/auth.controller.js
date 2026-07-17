const authService = require("../services/auth.service");

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const utilisateur = await authService.login(email, password);

      res.status(200).json(utilisateur);
    } catch (error) {
      console.error(error);

      res.status(401).json({
        message: error.message,
      });
    }
  },
};

module.exports = authController;
