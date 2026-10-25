const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const connectMongoDB = require("./config/mongodb");
const database = require("./config/database");

const app = express();

app.disable("x-powered-by");

/**
 * Trust proxy uniquement si explicitement configuré.
 * Valeurs acceptées : "0"/absent = désactivé ; "1" ou entier = nombre de hops ;
 * "true" = un hop. Ne jamais accepter aveuglément tous les proxies.
 */
function configureTrustProxy(application) {
  const raw = process.env.TRUST_PROXY;

  if (raw === undefined || raw === "" || raw === "0" || raw === "false") {
    return;
  }

  if (raw === "true" || raw === "1") {
    application.set("trust proxy", 1);
    return;
  }

  const hops = Number(raw);

  if (Number.isInteger(hops) && hops > 0) {
    application.set("trust proxy", hops);
  }
}

configureTrustProxy(app);

const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !process.env.JWT_SECRET) {
  console.error("JWT_SECRET est obligatoire en production.");
  process.exit(1);
}

if (isProduction && !process.env.CORS_ORIGIN) {
  console.error("CORS_ORIGIN est obligatoire en production.");
  process.exit(1);
}

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  }),
);

app.use(express.json({ limit: "100kb" }));

const routes = require("./routes");

app.use("/", routes);

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
