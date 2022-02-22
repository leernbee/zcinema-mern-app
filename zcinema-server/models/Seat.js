const mongoose = require('mongoose');

const SeatSchema = mongoose.Schema({
  screen: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  seats: [
    {
      no: { type: String, required: true },
      reserved: { type: Boolean, default: false }
    }
  ]
});

module.exports = mongoose.model('seat', SeatSchema);
