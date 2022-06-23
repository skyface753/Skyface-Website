const UserService = require("./services/user_service.js");
const UserModel = require("./models/user_model.js");
const Middleware = {
  getUserIfCookie: async (req, res, next) => {
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
  },
  authUser: async (req, res, next) => {
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
  },
  authAdmin: async (req, res, next) => {
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
  },
};

module.exports = Middleware;
