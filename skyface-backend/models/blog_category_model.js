const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let blogCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    parent_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BlogCategory", blogCategorySchema);
