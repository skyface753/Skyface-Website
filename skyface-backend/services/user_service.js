const UserModel = require("../models/user_model");
const BlogModel = require("../models/blog_model");
var jwt = require("jsonwebtoken");
var cors = require("cors");
// jwt 30 Tage
const jwtExpirySeconds = 60 * 60 * 24 * 30;
const jwtKey = "SkyTokSecretKey!fqiwhdhuwqhdf2uhf2zgu";
const saltRounds = 11;
const bycrypt = require("bcrypt");

let UserService = {
  getUserProfile: async (req, res) => {
    var username = req.params.username;
    //User without password
    let user = await UserModel.findOne({ username: username }, { password: 0 });
    if (!user) {
      res.json({
        success: false,
        message: "User not found",
      });
      return;
    }
    let userBlogs = await BlogModel.find({ posted_by: user._id });
    res.json({
      success: true,
      user: user,
      blogs: userBlogs,
    });
  },
  login: async (req, res) => {
    let usernameOrMail = req.body.usernameOrMail;
    let password = req.body.password;
    let user = await UserModel.findOne({
      $or: [{ username: usernameOrMail }, { email: usernameOrMail }],
    });
    if (!user) {
      res.json({
        success: false,
        message: "User not found",
      });
      return;
    }
    if (user.password) {
      let isPasswordCorrect = await bycrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        res.json({
          success: false,
          message: "Password is incorrect",
        });
        return;
      }
    }
    let token = signToken(user._id);
    //Clear password
    user.password = undefined;
    res.json({
      success: true,
      token: token,
      user: user,
    });
  },
  register: async (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let givenName = req.body.givenName;
    let familyName = req.body.familyName;
    if (!username || !email || !password || !givenName || !familyName) {
      res.json({
        success: false,
        message: "Missing parameters",
      });
      return;
    }
    let provider = "manuelly";
    let user = await UserModel.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (user) {
      res.json({
        success: false,
        message: "User already exists",
      });
      return;
    }
    user = new UserModel({
      username: username,
      email: email,
      password: password,
      givenName: givenName,
      familyName: familyName,
      provider: provider,
    });
    user.password = await bycrypt.hash(password, saltRounds);
    await user.save();
    let token = signToken(user._id);
    //Clear password
    user.password = undefined;
    res.json({
      success: true,
      token: token,
      user: user,
    });
  },

  signTokenExport: signToken,
  verifyTokenExport: verifyToken,
};

module.exports = UserService;

function getUserIdFromToken(req) {
  var token = getToken(req);
  if (!token) {
    return false;
  }
  var payload;
  try {
    payload = jwt.verify(token, jwtKey);
  } catch (e) {
    return false;
  }
  var userId = payload.user_id;
  return userId;
}

function getToken(req) {
  var token = req.headers.authorization;
  if (!token) {
    if (req.cookies.token) {
      token = req.cookies.token;
    } else {
      return false;
    }
  }
  return token;
}

function signToken(user_id) {
  const token = jwt.sign({ user_id }, jwtKey, {
    algorithm: "HS256",
    expiresIn: jwtExpirySeconds,
  });
  return token;
}

function verifyToken(req) {
  // var tokenFromCookie = req.cookies.jwt
  // console.log("FromCookie" + tokenFromCookie)
  var token = req.cookies.jwt;
  if (!token) {
    return false;
  }
  var payload;
  try {
    payload = jwt.verify(token, jwtKey);
  } catch (e) {
    return false;
  }
  var userId = payload.user_id;
  console.log("Token from request: " + token);
  if (token) {
    return userId;
  } else {
    return false;
  }
}
