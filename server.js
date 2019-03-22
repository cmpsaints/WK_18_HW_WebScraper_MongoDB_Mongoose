var express = require("express");
//var expresshandlebars = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

// require models
var db = require("./models");

const PORT = process.env.PORT || 3001;

// initiate Express
var app = express();

// ----- middleware ---------------

// Morgan logger for logging requests
app.use(logger("dev"));
// parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// make public a static folder
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// main route
app.get("/", function(req, res) {
  res.send("index.html");
});

// GET route for scraping website
app.get("/scrape", function(req, res) {
  axios
    .get("https://www.nytimes.com/section/technology")
    .then(function(response) {
      var $ = cheerio.load(response.data);

      // assign every h2 within article tag and process content
      $("article h2").each(function(i, element) {
        var result = {};

        // create result object with properties populated by scrape
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

        // create new Article (model) from result object
        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });

      // inform terminal that scrape is complete
      res.send("Scrape complete ...");
    });
});

// start server, listen on PORT
app.listen(PORT, function() {
  console.log("App running on port " + PORT + " ...");
});
