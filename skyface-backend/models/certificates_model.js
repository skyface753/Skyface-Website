const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let certificatesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  file_path: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Certificates", certificatesSchema);
