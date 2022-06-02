const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    provider: {
      // Manuelly, Google, GitHub
      type: String,
      required: true,
    },
    GitHub_id: {
      type: String,
      required: function () { return this.provider === "GitHub"; },
    },
    Google_Mail: {
      type: String,
      required: function () { return this.provider === "Google"; },
    },
    password: {
      required: function () { return this.provider === "Manuelly"; },
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
)

module.exports = mongoose.model("User", UserSchema);
