const blogCategoryModel = require("../models/blog_category_model.js");
const blogModel = require("../models/blog_model.js");
let BlogCategoryService = {
  getBlogCategories: async (req, res) => {
    let blogCategories = await blogCategoryModel.find({});
    res.json(blogCategories);
  },
  getSingleCategoryAndAllBlogs: async (req, res) => {
    let categoryUrl = req.params.categoryUrl;
    console.log("categoryUrl: " + categoryUrl);
    console.log(categoryUrl);
    if (
      !categoryUrl ||
      categoryUrl == "undefined" ||
      categoryUrl == "" ||
      categoryUrl == null
    ) {
      res.json({
        error: "No category url provided",
      });
      return;
    }
    let category = await blogCategoryModel.findOne({ url: categoryUrl });
    let blogs = await blogModel
      .find({ category: category._id })
      .sort({ createdAt: -1 });
    res.json({
      category: category,
      blogs: blogs,
    });
  },
};

module.exports = BlogCategoryService;
