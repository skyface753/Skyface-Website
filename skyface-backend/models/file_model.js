const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let FileSchema = new Schema(
  {
    original_name: {
      type: String,
      required: true,
    },
    generated_name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
    },
    uploaded_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("File", FileSchema);
