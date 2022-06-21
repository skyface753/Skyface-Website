const express = require("express");
const router = express.Router();
const multer = require("multer");

const BlogService = require("./services/blog_service.js");
const BlogCategoryService = require("./services/blog_category_service.js");
const UserService = require("./services/user_service.js");
const UserModel = require("./models/user_model.js");
const SeriesService = require("./services/series_service.js");
const SearchService = require("./services/search_service.js");
const SelfTrackerService = require("./services/self_tracker_service.js");

// Set req.user to logged in user if user is logged in
router.use(async (req, res, next) => {
  var userId = UserService.verifyTokenExport(req);
  // console.log("UserId: " + userId);
  if (!userId) {
    next();
  } else {
    // console.log("UserId: " + userId);
    var user = await UserModel.findById(userId);
    req.user = user;
    next();
  }
});

router.post("/api/self-tracker", SelfTrackerService.receiveSelfTrackerData);
// (Get in Admin)

const ContactService = require("./services/contact_service.js");
router.post("/contact", ContactService.sendForm);

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
router.post(
  "/users/username/free/:username",
  UserService.checkIfUsernameIsFree
);

router.post("/login/manuelly", UserService.loginManuelly);
router.post("/register/manuelly", UserService.registerManuelly);
router.post("/login/github", UserService.loginGitHub);
router.post("/login/google", UserService.loginGoogle);
router.post("/logout", UserService.logout);
// router.post("/register", UserService.register);
// router.post("/sign-in", UserService.login);

router.post("/series", SeriesService.getAllSeries);
router.post("/series/:seriesUrl", SeriesService.getSeriesWithBlogs);

router.post("/search", SearchService.search);

//Authentication for user routes
router.use(async (req, res, next) => {
  var userId = UserService.verifyTokenExport(req);
  // console.log("UserId: " + userId);
  if (!userId) {
    // console.log("Unauthorized in Router");
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  // console.log("Authorized in Router");
  var user = await UserModel.findById(userId);
  req.user = user;
  next();
});

const BlogLikesService = require("./services/blog_likes_service.js");
router.post("/blog-likes/like/:blogID", BlogLikesService.likeABlog);
router.post("/blog-likes/unlike/:blogID", BlogLikesService.unlikeABlog);

const CommentService = require("./services/comment_service.js");
router.post("/comment/create/:blogID", CommentService.createComment);
router.post("/users/username/change", UserService.changeUsername);

router.post("/users/password/change", UserService.changePassword);

//Authentication for ADMIN routes
router.use(async (req, res, next) => {
  var userId = UserService.verifyTokenExport(req);
  // console.log("UserId: " + userId);
  if (!userId) {
    // console.log("Unauthorized in Router");
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  // console.log("Authorized in Router");
  var user = await UserModel.findById(userId);
  if (!user) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }
  if (user.role !== "admin") {
    // console.log("Not an admin in Router");
    res.status(401).json({
      message: "Not an admin",
    });
    return;
  }
  req.user = user;
  // console.log("Admin in Router");
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
router.post("/admin/blogs/delete/:blogId", BlogService.deleteBlog);
router.post("/admin/category/create", BlogCategoryService.createBlogCategory);
router.post("/admin/category/edit", BlogCategoryService.editBlogCategory);
router.post(
  "/admin/category/delete/:categoryId",
  BlogCategoryService.deleteBlogCategory
);
router.post(
  "/admin/category/checkFreeUrl/:categoryUrl",
  BlogCategoryService.checkIfCategoryUrlIsFree
);
router.post(
  "/admin/series/checkFreeUrl/:seriesUrl",
  SeriesService.checkIfSeriesUrlIsFree
);
router.post("/admin/files/delete/:fileId", FileService.deleteFile);

router.post("/admin/comments/pending", CommentService.getPendingComments);
router.post(
  "/admin/comments/approve/:commentID",
  CommentService.approveComment
);
router.post("/admin/comments/delete/:commentID", CommentService.deleteComment);
router.post(
  "/admin/comments/all/approve",
  CommentService.approveAllCommentsPending
);
router.post(
  "/admin/comments/all/delete",
  CommentService.deleteAllCommentsPending
);
router.post("/admin/series/create", SeriesService.createSeries);
router.post("/admin/series/update", SeriesService.updateSeries);
router.post("/admin/contact/show", ContactService.checkIfAMessageIsUnread);
router.post("/admin/self-tracker/get", SelfTrackerService.getSelfTrackerData);
module.exports = router;
