"use strict";

require("dotenv").config();

const express = require("express");
const mongo = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");
const urlModel = require("./models/url");

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// middleware to parse post request body
app.use(bodyParser.json());

// mongoose
// todo: use process.env.DB_URI;
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "db connection error:"));
db.once("open", function () {
  console.log("db connected");
});

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// url shortener endpoint
app.post("/api/shorturl/new", async (req, res) => {
  const full_url = req.body.url;
  const url_regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  // invalid url format
  if (!full_url.match(url_regex)) {
    res.json({ error: "invalid URL" });
  } else {
    const url = new urlModel(req.body);
    try {
      await url.save();
      res.json({
        original_url: url.url,
        short_url: url.id,
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

// Find url by id
app.get("/api/shorturl/:id", (req, res) => {
  urlModel.findById(req.params.id, (err, result) => {
    if (err) {
      res.json({ error: "invalid URL" });
    } else {
      res.redirect(result.url);
    }
  });
});

app.listen(port, function () {
  console.log("Node.js listening ...");
});
