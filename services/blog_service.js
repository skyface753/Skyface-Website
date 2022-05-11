const blogModel = require('../models/blog_model.js');
const blogCategoryModel = require('../models/blog_category_model.js');

let BlogService = {
    getAllBlogs: async (req, res) => {
        let blogs = await blogModel.find();
        res.json(blogs);
    },
    getSingleBlog: async (req, res) => {
        var blogUrl = req.body.blogUrl;
        // console.log(blogUrl);
        // console.log(req.body);
        let blog = await blogModel.findOne({url: blogUrl});
        res.json(blog);
    }
}

module.exports = BlogService;