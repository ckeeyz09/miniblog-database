// phrase.js

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StatusSchema = new Schema({
  image: String,
  game: String,
  status: String
});

var Status = mongoose.model('Status', StatusSchema);

module.exports = Status;