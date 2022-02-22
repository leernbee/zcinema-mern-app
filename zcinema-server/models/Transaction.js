const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
  screen: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  movieDate: {
    type: String,
    required: true
  },
  movieTime: {
    type: String,
    required: true
  },
  seats: [String],
  amount: {
    type: Number,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('transaction', TransactionSchema);
