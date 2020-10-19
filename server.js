"use strict";

const express = require("express");
const mongo = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// todo: mongoose.connect(process.env.DB_URI);

app.use(cors());

// middleware to parse post request body
app.use(bodyParser.json());

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// url shortener endpoint
app.post("/api/shorturl/new", function (req, res, next) {
  const url = req.body.url;
  dns.lookup(url.hostname, (err, addr) => {
    if (err && err.code === "ENOTFOUND") {
      res.json({ error: "invalid URL" });
    } else {
      res.json({
        original_url: url,
        short_url: url.length,
      });
    }
  });
});

app.get("/api/shorturl/");

app.listen(port, function () {
  console.log("Node.js listening ...");
});
