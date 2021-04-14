const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "A user must have a first name"],
  },
  lastName: {
    type: String,
    required: [true, "A user must have a last name"],
  },
  email: {
    type: String,
    required: [true, "A user must have an email address"],
    unique: true,
    // validate: {
    //   validator
    // }
  },
});
