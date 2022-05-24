const express = require("express");
const router = express.Router();
const multer = require("multer");

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
router.post("/users/profile/:username", UserService.getUserProfile);

router.post("/sign-up", UserService.register);
router.post("/sign-in", UserService.login);

//Authentication for user routes
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
  req.user = user;
  next();
});

const CommentService = require("./services/comment_service.js");
router.post("/comment/create/:blogID", CommentService.createComment);

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
router.post("/admin/blog/create", BlogService.createBlog);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploaded-files/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// router.post("/admin/upload", upload.single("file"), function (req, res) {
//   res.json({});
// });
const FileService = require("./services/file_service.js");
router.post("/admin/upload", upload.single("file"), FileService.uploadFile);
router.post("/admin/files", FileService.getAllFiles);
router.post("/admin/files/:type", FileService.getAllFilesByType);
module.exports = router;
