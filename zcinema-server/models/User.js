const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  },
  verification: {
    type: String
  },
  forgot: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: "user"
  }
});

module.exports = mongoose.model("user", UserSchema);
