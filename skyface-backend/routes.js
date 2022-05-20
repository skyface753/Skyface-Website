const express = require("express");
const router = express.Router();

const BlogService = require("./services/blog_service.js");
const BlogCategoryService = require("./services/blog_category_service.js");
const UserService = require("./services/user_service.js");
const UserModel = require("./models/user_model.js");

router.post("/blogs", BlogService.getAllBlogs);
router.post("/blogs/last5", BlogService.getLast5Blogs);
router.post("/blog-categories", BlogCategoryService.getBlogCategories);
//Get Block by url param
router.post("/blog/:url", BlogService.getSingleBlogByUrl);
router.post(
  "/blog-categories/:categoryUrl",
  BlogCategoryService.getSingleCategoryAndAllBlogs
);
//Authentication for admin routes
router.use(async (req, res, next) => {
  var userId = UserService.verifyTokenExport(req);
  console.log("UserId: " + userId);
  if (!userId) {
    console.log("Unauthorized in Router");
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  console.log("Authorized in Router");
  var user = await UserModel.findById(userId);
  if (user.role !== "admin") {
    console.log("Not an admin in Router");
    res.status(401).json({
      message: "Not an admin",
    });
    return;
  }
  req.user = user;
  console.log("Admin in Router");
  next();
});
router.post("/blog/edit/:id", BlogService.updateBlog);

module.exports = router;
