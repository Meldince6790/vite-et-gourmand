const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const connectMongoDB = require("./config/mongodb");
const database = require("./config/database");

const app = express();

app.disable("x-powered-by");

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  }),
);

app.use(express.json());

// Routes
const routes = require("./routes");

app.use("/", routes);

// Lancement du serveur
const PORT = process.env.PORT || 3000;

const SHUTDOWN_TIMEOUT_MS = 10_000;

async function closeConnections() {
  try {
    await database.end();
  } catch (error) {
    console.error("Erreur lors de la fermeture du pool MariaDB :", error);
  }

  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch (error) {
    console.error("Erreur lors de la déconnexion MongoDB :", error);
  }
}

function setupGracefulShutdown(server) {
  let shuttingDown = false;

  const shutdown = (signal) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    console.log(`${signal} reçu — arrêt du serveur…`);

    const forceExit = setTimeout(() => {
      console.error("Arrêt forcé après délai dépassé.");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);

    forceExit.unref();

    server.close(async (closeError) => {
      if (closeError) {
        console.error("Erreur lors de la fermeture HTTP :", closeError);
      }

      await closeConnections();
      clearTimeout(forceExit);
      process.exit(closeError ? 1 : 0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

async function startServer() {
  await connectMongoDB();

  const server = app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
  });

  setupGracefulShutdown(server);
}

startServer();
