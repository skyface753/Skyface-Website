const blogCategoryModel = require("../models/blog_category_model.js");

let BlogCategoryService = {
  getBlogCategories: async (req, res) => {
    let blogCategories = await blogCategoryModel.find({});
    res.json(blogCategories);
  },
};

module.exports = BlogCategoryService;
