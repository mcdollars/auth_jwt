const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("./connection")
  .initialize()
  .then(() => {
    app.use("/", indexRouter);
  });

module.exports = app;