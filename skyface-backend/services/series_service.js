const SeriesBlogsModel = require("../models/series_blogs_model");
const SeriesModel = require("../models/series_model");

let SeriesService = {
  getAllSeries: async (req, res) => {
    let series = await SeriesModel.find({});
    res.json({
      success: true,
      series: series,
    });
  },
  getSeriesWithBlogs: async (req, res) => {
    let seriesUrl = req.params.seriesUrl;
    let series = await SeriesModel.findOne({ url: seriesUrl });
    if (!series) {
      res.json({
        success: false,
        message: "No series found",
      });
      return;
    }
    let seriesBlogs = await SeriesBlogsModel.find({
      series: series._id,
    })
      .populate("blog")
      .sort({ position: 1 });
    res.json({
      success: true,
      series: series,
      seriesBlogs: seriesBlogs,
    });
  },
  checkIfSeriesUrlIsFree: async (req, res) => {
    let seriesUrl = req.params.seriesUrl;
    console.log("seriesUrl", seriesUrl);
    let series = await SeriesModel.findOne({ url: seriesUrl });
    if (series) {
      res.json({
        success: false,
        message: "Series url is not free",
      });
      return;
    }
    res.json({
      success: true,
      message: "Series url is free",
    });
  },
};

module.exports = SeriesService;
