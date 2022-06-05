const BlogLikesModel = require("../models/blog_likes_model");

let BlogLikesService = {
  likeABlog: async (req, res) => {
    if (!req.params.blogID) {
      res.status(400).json({
        success: false,
        message: "Blog ID is required",
      });
      return;
    }
    let blogLikes = new BlogLikesModel({
      for_blog: req.params.blogID,
      by_user: req.user._id,
    });
    await blogLikes.save();
    res.json({
      success: true,
      message: "Blog liked",
    });
  },
  unlikeABlog: async (req, res) => {
    if (!req.params.blogID) {
      res.status(400).json({
        success: false,
        message: "Blog ID is required",
      });
      return;
    }
    let blogLikes = await BlogLikesModel.findOneAndDelete({
      for_blog: req.params.blogID,
      by_user: req.user._id,
    }).exec();
    res.json({
      success: true,
      message: "Blog unliked",
    });
  },
};

module.exports = BlogLikesService;
