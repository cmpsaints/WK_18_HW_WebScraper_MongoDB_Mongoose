var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

// require models for Mongoose db structure
var db = require("./models");

// initiate Express
var app = express();

const PORT = process.env.PORT || 5500;

// ----- middleware ---------------

// Morgan logger for logging requests
app.use(logger("dev"));

// parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// make public folder a static route
app.use(express.static("public"));

// set Express Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database.
//
/* var MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://heroku_flkl5pqw:5ikojdboicpm91qm55oekmhllp@ds121406.mlab.com:21406/heroku_flkl5pqw";

mongoose.connect(MONGODB_URI); */

mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://heroku_flkl5pqw:5ikojdboicpm91qm55oekmhllp@ds121406.mlab.com:21406/heroku_flkl5pqw",
  { useNewUrlParser: true }
);

// main route
app.get("/", function(req, res) {
  res.render("index");
});

// GET request to route to home, and clear page
app.get("/home", function(req, res) {
  db.Article.deleteMany({})
    .then(function(dbArticle) {
      // res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
  res.redirect("/");
});

// GET request to scrape
app.get("/scrape", function(req, res) {
  db.Article.deleteMany({})
    .then(function(dbArticle) {
      // res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });

  // First, we grab the body of the html with Axios
  axios.get("https://www.w3.org/blog/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .find("h2 > a")
        .text();
      result.date = $(this)
        .find("time")
        .text();
      result.link = $(this)
        .find("a")
        .attr("href");
      result.paragraph = $(this)
        .find("header + div > p")
        .text();

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        // console.log(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    // refresh page to display articles
    res.redirect("/");
  });
});

// GET all Articles
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// GET specific Article
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

// POST to save/update Articles
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        {
          note: dbNote._id
        },
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
