const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  screen: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  trailer: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('movie', MovieSchema);
