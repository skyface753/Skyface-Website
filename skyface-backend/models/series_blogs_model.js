const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let SeriesBlogsSchema = new Schema(
  {
    series: {
      type: Schema.Types.ObjectId,
      ref: "Series",
      required: true,
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SeriesBlogs", SeriesBlogsSchema);
