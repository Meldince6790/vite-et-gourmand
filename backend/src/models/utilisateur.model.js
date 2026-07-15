const database = require("../config/database");

const Utilisateur = {
    async findAll() {
        const [rows] = await database.query(
            "SELECT * FROM utilisateur"
        );

        return rows;
    },

    async findById(id) {
        const [rows] = await database.query(
            "SELECT * FROM utilisateur WHERE utilisateur_id = ?",
            [id]
        );

        return rows[0];
    }
};

module.exports = Utilisateur;