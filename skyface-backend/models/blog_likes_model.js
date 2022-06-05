const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let blogLikesSchema = new Schema(
  {
    for_blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    by_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BlogLikes", blogLikesSchema);
