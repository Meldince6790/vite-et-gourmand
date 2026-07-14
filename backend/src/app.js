const express = require("express");

require("dotenv").config();

const app = express();

app.disable("x-powered-by");

const PORT = process.env.PORT || 3000;

const routes = require("./routes");

app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});