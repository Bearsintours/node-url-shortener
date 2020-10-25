"use strict";

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
mongoose.connect("mongodb+srv://root_user:root_pwd@cluster0.fduiv.mongodb.net/db?retryWrites=true&w=majority", {
  useNewUrlParser: true,
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

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// url shortener endpoint
app.post("/api/shorturl/new", async (req, res) => {
  const domain = req.body.url.split("://")[1];
  // invalid url format
  if (domain === undefined) {
    res.json({ error: "invalid URL" });
  } else {
    await dns.lookup(domain, (err) => {
      // domain not found
      if (err) {
        res.json({ error: "invalid URL" });
      } else {
        const url = new urlModel(req.body);
        try {
          url.save();
          res.json({
            original_url: url.url,
            short_url: url.id,
          });
        } catch (err) {
          res.status(500).send(err);
        }
      }
    });
  }
});

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
