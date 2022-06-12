const blogCategoryModel = require("../models/blog_category_model.js");
const blogModel = require("../models/blog_model.js");
let BlogCategoryService = {
  getBlogCategories: async (req, res) => {
    let blogCategories = await blogCategoryModel.find({});
    var categories = blogCategories.map((category) => {
      return {
        _id: category._id,
        name: category.name,
        description: category.description,
        url: category.url,
        parent_category: category.parent_category,
        blogCount: 0,
      };
    });
    for (let i = 0; i < categories.length; i++) {
      let blogCategory = categories[i];
      let blogCount = await blogModel.count({
        category: blogCategory._id,
      });
      categories[i].blogCount = blogCount;
    }
    res.json(categories);
    // for (let i = 0; i < categories.length; i++) {
    //   let blogCategory = categories[i];
    //   let blogCount = await blogModel
    //     .countDocuments({
    //       category: blogCategory._id,
    //     })
    //     .exec();
    //   console.log(blogCount + " blogs in category " + blogCategory.name);
    //   categories[i].blogCount = blogCount;
    // }
    // console.log(categories);
    // res.json(categories);
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
    let parentCategory = req.body.parent_category;
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
  editBlogCategory: async (req, res) => {
    let id = req.body._id;
    let name = req.body.name;
    let description = req.body.description;
    let parentCategory = req.body.parent_category;
    let url = req.body.url;
    if (!id || !name || !description || !url) {
      res.json({
        error: "No id, name, description or url provided",
      });
      return;
    }
    if (!parentCategory) {
      parentCategory = null;
    }
    if (parentCategory == id) {
      res.json({
        error: "You can't set a category as its own parent!",
      });
      return;
    }
    let blogCategory = await blogCategoryModel.findById(id);
    if (!blogCategory) {
      res.json({
        error: "No blog category found with id " + id,
      });
      return;
    }
    blogCategory.name = name;
    blogCategory.description = description;
    blogCategory.parent_category = parentCategory;
    blogCategory.url = url;
    let savedBlogCategory = await blogCategory.save();
    res.json({
      success: true,
      category: savedBlogCategory,
    });
  },
  deleteBlogCategory: async (req, res) => {
    let id = req.params.categoryId;
    let blogCategory = await blogCategoryModel.findById(id);
    if (!blogCategory) {
      res.json({
        error: "No blog category found with id " + id,
      });
      return;
    }
    let blogs = await blogModel.find({ category: id });
    for (let i = 0; i < blogs.length; i++) {
      let blog = blogs[i];
      blog.category = null;
      await blog.save();
    }
    await blogCategory.remove();
    res.json({
      success: true,
    });
  },
};

module.exports = BlogCategoryService;
