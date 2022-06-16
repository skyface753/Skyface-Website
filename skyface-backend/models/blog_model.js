const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    // content: { // ECMA Script | UTF-8
    //     type: String,
    //     required: true
    // },
    posted_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    series: {
      type: Schema.Types.ObjectId,
      ref: "Series",
    },
    series_position: {
      type: Number,
      required: function () {
        return this.series;
      },
    },
    blog_image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
