var express = require("express");
//var expresshandlebars = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

// require models
var db = require("./models");

const PORT = process.env.PORT || 3000;

// initiate Express
var app = express();

// middleware
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// start server, listen on PORT
app.listen(PORT, function() {
  console.log("App running on port " + PORT + " ...");
});
