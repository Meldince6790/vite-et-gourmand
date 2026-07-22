const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectMongoDB = require("./config/mongodb");

const app = express();

app.disable("x-powered-by");

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

// Routes
const routes = require("./routes");

app.use("/", routes);

// Lancement du serveur
const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
  });
}

startServer();
