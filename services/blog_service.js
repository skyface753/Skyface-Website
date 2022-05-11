const blogModel = require('../models/blog_model.js');
const blogCategoryModel = require('../models/blog_category_model.js');

let BlogService = {
    getAllBlogs: async (req, res) => {
        let blogs = await blogModel.find().sort({ createdAt: -1 });
        res.json(blogs);
    },
    getSingleBlog: async (req, res) => {
        var blogUrl = req.body.blogUrl;
        // console.log(blogUrl);
        // console.log(req.body);
        let blog = await blogModel.findOne({url: blogUrl});
        res.json(blog);
    },
    getLast5Blogs: async (req, res) => {
        let blogs = await blogModel.find().sort({ createdAt: -1}).limit(5);
        res.json(blogs);
    }
}

module.exports = BlogService;