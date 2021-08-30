const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Email должен быть корректным",
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },

  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Ritis Barauskas",
  },
});

module.exports = mongoose.model("user", userSchema);