require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("PhP Cloud Backend OK"));
app.listen(port, () => console.log(`Rodando na porta ${port}`));
