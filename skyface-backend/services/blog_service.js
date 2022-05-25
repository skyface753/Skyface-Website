const blogModel = require("../models/blog_model.js");
const blogContentModel = require("../models/blog_content_model.js");
const blogCategoryModel = require("../models/blog_category_model.js");
const UserService = require("../services/user_service.js");
const CommentModel = require("../models/comment_model");

let BlogService = {
  getAllBlogs: async (req, res) => {
    let blogs = await blogModel.find().sort({ createdAt: -1 });
    console.log("Returned Blogs")
    res.json(blogs);
  },
  getSingleBlogByUrl: async (req, res) => {
    var blogUrl = req.params.url;
    // console.log(blogUrl);
    // console.log(req.body);
    let blog = await blogModel
      .findOne({ url: blogUrl })
      .populate("category")
      .populate("posted_by", "username _id");
    let blogContent = await blogContentModel
      .find({ for_blog: blog._id })
      .sort({ position: 1 });
    let blogComments = await CommentModel.find({ for_blog: blog._id }).populate(
      "by_user",
      "username _id picture"
    );
    res.json({
      blog: blog,
      blogContent: blogContent,
      blogComments: blogComments,
    });
  },
  getLast5Blogs: async (req, res) => {
    let blogs = await blogModel.find().sort({ createdAt: -1 }).limit(5);
    res.json(blogs);
  },
  updateBlog: async (req, res) => {
    var user = req.user;

    let blogId = req.params.id;
    if (!blogId) {
      res.json({
        error: "No blog id provided",
      });
      return;
    }
    let newBlogContent = req.body.blogContent;
    let newBlog = req.body.blog;
    if (
      !newBlog ||
      newBlog.length === 0
    ) {
      res.json({
        success: false,
        message: "No blog (or blog content) provided",
      });
      return;
    }
    let blog = await blogModel.findById(blogId);
    if (!blog) {
      res.json({
        success: false,
        message: "No blog found",
      });
      return;
    }
    // Update Blog
    blog.title = newBlog.title;
    blog.subtitle = newBlog.subtitle;
    blog.url = newBlog.url;
    blog.category = newBlog.category;
    await blog.save();

    //Delete old blog content
    await blogContentModel.deleteMany({ for_blog: blog._id }).exec();
    //Create new blog content
    for (let i = 0; i < newBlogContent.length; i++) {
      let blogContent = new blogContentModel({
        content: newBlogContent[i].content,
        for_blog: blog._id,
        position: newBlogContent[i].position,
        type: newBlogContent[i].type,
      });
      await blogContent.save();
    }
    if(!newBlogContent || newBlogContent.length === 0) {
      res.json({
        success: true,
        message: "Blog updated without content"
      });
    }else{
      res.send({
        success: true,
        message: "Blog updated",
      });
      }
  },
  createBlog: async (req, res) => {
    var user = req.user;
    let newBlog = req.body.blog;
    let newBlogContent = req.body.blogContent;
    if (
      !newBlog ||
      newBlog.length === 0 ||
      !newBlogContent ||
      newBlogContent.length === 0
    ) {
      res.json({
        success: false,
        message: "No blog (or blog content) provided",
      });
      return;
    }
    let blog = new blogModel({
      title: newBlog.title,
      subtitle: newBlog.subtitle,
      url: newBlog.url,
      category: newBlog.category._id == null ? null : newBlog.category._id,
      posted_by: user._id,
    });
    await blog.save();

    //Create new blog content
    for (let i = 0; i < newBlogContent.length; i++) {
      let blogContent = new blogContentModel({
        content: newBlogContent[i].content,
        for_blog: blog._id,
        position: newBlogContent[i].position,
        type: newBlogContent[i].type,
      });
      await blogContent.save();
    }
    res.send({
      success: true,
      message: "Blog created",
    });
  },
  deleteBlog: async (req, res) => {
    let blogId = req.params.blogId;
    if (!blogId) {
      res.json({
        error: "No blog id provided",
      });
      return;
    }
    let blog = await blogModel.findById(blogId);
    if (!blog) {
      res.json({
        error: "No blog found",
      });
      return;
    }
    await blog.remove();
    await blogContentModel.deleteMany({ for_blog: blog._id }).exec();
    res.json({
      success: true,
      message: "Blog deleted",
    });
  }
};

module.exports = BlogService;
// createDummyBlog();

const UserModel = require("../models/user_model.js");

async function createDummyBlog() {
  setTimeout(async () => {
    // Create User Skyface
    let userSkyface = new UserModel({
      username: "Skyface",
      email: "sjoerz@skyface.de",
      password: "123456",
      role: "admin",
    });
    await userSkyface.save();

    for (let i = 0; i < 10; i++) {
      let title = "Title " + i;
      let subtitle = "Subtitle " + i;
      let content = [];
      for (let j = 0; j < 10; j++) {
        var words = [
          "The sky",
          "above",
          "the port",
          "was",
          "the color of television",
          "tuned",
          "to",
          "a dead channel",
          ".",
          "All",
          "this happened",
          "more or less",
          ".",
          "I",
          "had",
          "the story",
          "bit by bit",
          "from various people",
          "and",
          "as generally",
          "happens",
          "in such cases",
          "each time",
          "it",
          "was",
          "a different story",
          ".",
          "It",
          "was",
          "a pleasure",
          "to",
          "burn",
        ];
        var text = [];
        var x = 100;
        while (--x) text.push(words[Math.floor(Math.random() * words.length)]);
        let contentItem = {
          content: "Content " + j + ": " + text.join(" "),
          position: j,
        };
        content.push(contentItem);
      }
      let posted_by = userSkyface._id;
      let categories = [];
      let url = "url-test-" + i;
      let blog = new blogModel({
        title: title,
        subtitle: subtitle,
        posted_by: posted_by,
        categories: categories,
        url: url,
      });
      await blog.save();

      for (let i = 0; i < content.length; i++) {
        let blogContent = new blogContentModel({
          content: content[i].content,
          for_blog: blog._id,
          position: content[i].position,
          type: "text",
        });
        await blogContent.save();
      }
    }
    console.log("Blogs created");
  }, 1000);
}
