const mongoose = require("mongoose");

async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connecté avec succès.");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error);

    process.exit(1);
  }
}

module.exports = connectMongoDB;
