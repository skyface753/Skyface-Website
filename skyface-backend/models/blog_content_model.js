const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let blogContentSchema = new Schema(
  {
    for_blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    code: {
      type: String,
    },
    image: {
      type: String,
    },
    subline: {
      type: String,
    },
    link: {
      type: String,
    } ,
    link: {
      type: String,
    } ,
    download: {
      type: String,
    } ,
    pureHTML: {
      type: String,
    } ,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BlogContent", blogContentSchema);
