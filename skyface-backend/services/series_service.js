// const SeriesBlogsModel = require("../models/series_blogs_model");
const SeriesModel = require("../models/series_model");
const BlogModel = require("../models/blog_model");
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
    let seriesBlogs = await BlogModel.find({ series: series._id }).sort({
      series_position: 1,
    });
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
  createSeries: async (req, res) => {
    let series = req.body.series;
    if (!series) {
      res.json({
        success: false,
        message: "No series data",
      });
      return;
    }
    if (!series.name || !series.description || !series.url) {
      res.json({
        success: false,
        message: "No series data",
      });
      return;
    }
    // Check if series url is free
    let seriesUrl = series.url;
    let seriesCheck = await SeriesModel.findOne({ url: seriesUrl });
    if (seriesCheck) {
      res.json({
        success: false,
        message: "Series url is not free",
      });
      return;
    }

    let newSeries = await SeriesModel.create(series);
    res.json({
      success: true,
      series: newSeries,
    });
  },
  updateSeries: async (req, res) => {
    let series = req.body.series;
    if (!series) {
      res.json({
        success: false,
        message: "No series data",
      });
      return;
    }
    if (!series.name || !series.description || !series.url) {
      res.json({
        success: false,
        message: "No series data",
      });
      return;
    }
    // Check if series url is free
    let seriesUrl = series.url;
    let seriesCheck = await SeriesModel.findOne({ url: seriesUrl });
    if (seriesCheck) {
      res.json({
        success: false,
        message: "Series url is not free",
      });
      return;
    }
    let oldSeries = await SeriesModel.findOne({ _id: series._id });
    if (!oldSeries) {
      res.json({
        success: false,
        message: "No series found",
      });
      return;
    }
    oldSeries.name = series.name;
    oldSeries.description = series.description;
    oldSeries.url = series.url;
    await oldSeries.save();
    res.json({
      success: true,
      series: oldSeries,
    });
  },
};

module.exports = SeriesService;
