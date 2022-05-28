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
  createBlogCategory: async (req, res) => {
    let name = req.body.name;
    let description = req.body.description;
    let parentCategory = req.body.parentCategory;
    let url = req.body.url;
    if (!name || !description || !url) {
      res.json({
        error: "No name, description or url provided",
      });
      return;
    }
    if (!parentCategory) {
      parentCategory = null;
    }
    let blogCategory = new blogCategoryModel({
      name: name,
      description: description,
      parent_category: parentCategory,
      url: url,
    });
    let savedBlogCategory = await blogCategory.save();
    res.json({
      success: true,
      blogCategory: savedBlogCategory,
    });
  },
  checkIfCategoryUrlIsFree: async (req, res) => {
    let categoryUrl = req.params.categoryUrl;
    let category = await blogCategoryModel.findOne({ url: categoryUrl });
    if (category) {
      res.json({
        success: false,
      });
    } else {
      res.json({
        success: true,
      });
    }
  },
};

module.exports = BlogCategoryService;
