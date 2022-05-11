const express = require('express');
const router = express.Router();

const BlogService = require('./services/blog_service.js');
const BlogCategoryService = require('./services/blog_category_service.js');

router.post('/blogs', BlogService.getAllBlogs);
router.post('/blogs/get', BlogService.getSingleBlog);
router.post('/blogs/last5', BlogService.getLast5Blogs);
router.post('/blog-categories', BlogCategoryService.getBlogCategories);

module.exports = router;