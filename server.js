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
//
/* var MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://heroku_flkl5pqw:5ikojdboicpm91qm55oekmhllp@ds121406.mlab.com:21406/heroku_flkl5pqw";

mongoose.connect(MONGODB_URI); */

mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://heroku_flkl5pqw:5ikojdboicpm91qm55oekmhllp@ds121406.mlab.com:21406/heroku_flkl5pqw"
);

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

// GET route for getting all Articles from db
app.get("/articles", function(req, res) {
  db.Article.find({})

    .then(function(dbArticle) {
      res.json(dbArticle);
    })

    .catch(function(err) {
      res.json(err);
    });
});

// GET route for grabbing Article by id, and populate with its note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })

    .populate("note")

    .then(function(dbArticle) {
      res.json(dbArticle);
    })

    .catch(function(err) {
      res.json(err);
    });
});

// POST route for saving & updating Note in Article
app.post("/articles/:id", function(req, res) {
  // create new Note and pass req.body to new entry
  db.Note.create(req.body)

    // find one Article with _id equal to req.params.id, then update Article with new Note
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })

    .catch(function(err) {
      res.json(err);
    });
});

// start server, listen on PORT
app.listen(PORT, function() {
  console.log("App running on port " + PORT + " ...");
});
