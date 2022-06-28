const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let DeletedBlogSchema = new Schema(
  {
    blog_id: {
      type: String,
      required: true,
      // unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
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
      required: false,
    },
    deleted_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deleted_at: {
      type: Date,
      required: true,
    },
    contents: [
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DeletedBlog", DeletedBlogSchema);
