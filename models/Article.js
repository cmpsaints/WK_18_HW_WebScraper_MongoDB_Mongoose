var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Schema constructor to create a new schema object
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// create model from above schema (Mongoose's model method)
var Article = mongoose.model("Article", ArticleSchema);

// export Article model
module.exports = Article;
