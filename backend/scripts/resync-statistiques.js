require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env"),
});

const mongoose = require("mongoose");
const database = require("../src/config/database");
const statistiqueService = require("../src/services/statistique.service");

const COMMANDES_ACTIVES_SQL = `
  SELECT
    c.commande_id,
    c.menu_id,
    c.prix_menu,
    c.prix_livraison,
    c.date_commande,
    m.titre AS nom_menu
  FROM commande c
  INNER JOIN menu m ON m.menu_id = c.menu_id
  WHERE c.statut <> 'Annulée'
  ORDER BY c.date_commande ASC, c.commande_id ASC
`;

async function main() {
  let mongoConnected = false;

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI manquant dans l'environnement.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    mongoConnected = true;
    console.log("MongoDB connecté.");

    const [commandesActives] = await database.query(COMMANDES_ACTIVES_SQL);
    console.log(
      `${commandesActives.length} commande(s) active(s) lue(s) depuis MariaDB.`,
    );

    const rapport =
      await statistiqueService.recalculerStatistiques(commandesActives);

    console.log("Resynchronisation MongoDB terminée");
    console.log(`- Commandes lues          : ${rapport.commandesLues}`);
    console.log(`- Agrégats calculés       : ${rapport.agregatsCalcules}`);
    console.log(`- Documents créés         : ${rapport.documentsCrees}`);
    console.log(`- Documents mis à jour    : ${rapport.documentsMisAJour}`);
    console.log(`- Documents remis à zéro  : ${rapport.documentsRemisAZero}`);
  } catch (error) {
    console.error("Échec de la resynchronisation des statistiques :", error);
    process.exitCode = 1;
  } finally {
    if (mongoConnected) {
      try {
        await mongoose.disconnect();
        console.log("MongoDB déconnecté.");
      } catch (error) {
        console.error("Erreur lors de la déconnexion MongoDB :", error);
        process.exitCode = 1;
      }
    }

    try {
      await database.end();
      console.log("Pool MariaDB fermé.");
    } catch (error) {
      console.error("Erreur lors de la fermeture du pool MariaDB :", error);
      process.exitCode = 1;
    }
  }
}

main();
