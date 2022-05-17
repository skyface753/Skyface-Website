const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      // unique: true
    },
    givenName: {
      type: String,
      required: true,
    },
    familyName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    provider: {
      // Manuelly, Google
      type: String,
      required: true,
    },
    password: {
      // Not required for login with Google
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    picture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
