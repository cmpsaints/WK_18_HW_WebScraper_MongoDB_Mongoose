var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Schema constructor to create a new schema object
var NoteSchema = new Schema({
  title: String,
  body: String
});

// create model from above schema (Mongoose's model method)
var Note = mongoose.model("Note", NoteSchema);

// export Note model
module.exports = Note;
