const mongooose = require("mongoose");
const Schema = mongooose.Schema;

let CommentSchema = new Schema(
  {
    by_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    for_blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    comment_text: {
      type: String,
      required: true,
    },
    reply_to: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongooose.model("Comment", CommentSchema);
