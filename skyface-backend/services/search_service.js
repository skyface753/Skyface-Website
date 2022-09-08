const UserModel = require("../models/user_model");
const BlogModel = require("../models/blog_model");
const BlogCategoryModel = require("../models/blog_category_model");
const SeriesModel = require("../models/series_model");
const CertificateModel = require("../models/certificates_model");

let SearchService = {
  search: async (req, res) => {
    let searchString = req.body.searchString;
    let searchResult = {
      users: [],
      blogs: [],
      categories: [],
      series: [],
      certificates: [],
      success: false,
    };
    let users = await UserModel.find({
      username: { $regex: searchString, $options: "i" },
    });
    // Clear user Password
    for (let i = 0; i < users.length; i++) {
      users[i].password = "";
    }

    let blogs = await BlogModel.find({
      title: { $regex: searchString, $options: "i" },
    });
    let categories = await BlogCategoryModel.find({
      name: { $regex: searchString, $options: "i" },
    });
    let series = await SeriesModel.find({
      name: { $regex: searchString, $options: "i" },
    });
    let certificates = await CertificateModel.find({
      $or: [
        { title: { $regex: searchString, $options: "i" } },
        { description: { $regex: searchString, $options: "i" } },
      ],
    });
    searchResult.users = users;
    searchResult.blogs = blogs;
    searchResult.categories = categories;
    searchResult.series = series;
    searchResult.certificates = certificates;
    searchResult.success = true;
    res.json(searchResult);
  },
};

module.exports = SearchService;
