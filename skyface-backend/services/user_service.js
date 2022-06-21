const UserModel = require("../models/user_model");
const BlogModel = require("../models/blog_model");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
var jwt = require("jsonwebtoken");
var cors = require("cors");
// jwt 30 Tage
const jwtExpirySeconds = 60 * 60 * 24 * 30;
const jwtKey = "SkyTokSecretKey!fqiwhdhuwqhdf2uhf2zgu";
const saltRounds = 11;
const bycrypt = require("bcrypt");

let UserService = {
  logout: (req, res) => {
    res.clearCookie("jwt");
    res.json({
      success: true,
      message: "Logged out",
    });
  },
  checkIfUsernameIsFree: async (req, res) => {
    var username = req.params.username;
    if (!username) {
      res.json({
        success: false,
        message: "No username provided",
      });
      return;
    }
    let user = await UserModel.findOne({ username: username });
    if (user) {
      res.json({
        success: false,
        message: "Username is already taken",
        free: false,
      });
      return;
    }
    res.json({
      success: true,
      message: "Username is free",
      free: true,
    });
  },
  changeUsername: async (req, res) => {
    var newUsername = req.body.newUsername;
    var userInReq = req.user; // From Router Middleware
    if (!newUsername) {
      res.json({
        success: false,
        message: "No new username provided",
      });
      return;
    }
    if (newUsername.length < 3 || newUsername.length > 20) {
      res.json({
        success: false,
        message: "Username must be between 3 and 20 characters",
      });
      return;
    }
    if (newUsername.match(/[^a-zA-Z0-9]/)) {
      res.json({
        success: false,
        message: "Username must only contain letters and numbers",
      });
      return;
    }
    let user = await UserModel.findOne({ username: newUsername });
    if (user) {
      res.json({
        success: false,
        message: "Username already taken",
      });
      return;
    }
    userInReq.username = newUsername;
    await userInReq.save();
    res.json({
      success: true,
      message: "Username changed",
    });
  },
  changePassword: async (req, res) => {
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var userInReq = req.user; // From Router Middleware
    if (!oldPassword || !newPassword) {
      res.json({
        success: false,
        message: "No password provided",
      });
      return;
    }
    if (newPassword.length < 6 || newPassword.length > 20) {
      res.json({
        success: false,
        message: "Password must be between 6 and 20 characters",
      });
      return;
    }
    var userFromDB = await UserModel.findOne({ _id: userInReq._id });
    if (!userFromDB) {
      res.json({
        success: false,
        message: "User not found",
      });
      return;
    }
    if (!bycrypt.compareSync(oldPassword, userFromDB.password)) {
      res.json({
        success: false,
        message: "Wrong old password",
      });
      return;
    }
    userFromDB.password = bycrypt.hashSync(newPassword, saltRounds);
    await userFromDB.save();
    res.json({
      success: true,
      message: "Password changed",
    });
  },

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
  loginManuelly: async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let user = await UserModel.findOne({
      username: username,
      provider: "Manuelly",
    });
    if (!user) {
      res.json({
        success: false,
        message: "User not found",
      });
      return;
    }
    let isPasswordCorrect = await bycrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.json({
        success: false,
        message: "Password is incorrect",
      });
      return;
    }

    let token = signToken(user._id);
    //Clear password
    user.password = undefined;
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "Strict",
    });
    res.json({
      success: true,
      user: user,
    });
  },
  registerManuelly: async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
      res.json({
        success: false,
        message: "Missing parameters",
      });
      return;
    }
    let provider = "Manuelly";
    let user = await UserModel.findOne({ username: username });
    if (user) {
      res.json({
        success: false,
        message: "User already exists",
      });
      return;
    }
    user = new UserModel({
      username: username,
      password: password,
      provider: provider,
    });
    user.password = await bycrypt.hash(password, saltRounds);
    await user.save();
    let token = signToken(user._id);
    //Clear password
    user.password = undefined;
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "Strict",
    });
    res.json({
      success: true,
      user: user,
    });
  },
  loginGitHub: async (req, res) => {
    const code = req.body.code;
    checkGitHubLogin(code).then((githubUser) => {
      if (!githubUser) {
        res.json({
          success: false,
          message: "GitHub login failed",
        });
        return;
      }
      let checkUser = UserModel.findOne({ GitHub_id: githubUser.id });
      checkUser.then(async (user) => {
        if (user) {
          let token = signToken(user._id);
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: "Strict",
          });
          res.json({
            success: true,
            user: user,
          });
        } else {
          var newRandomUsername = await getRandomUsername();
          let user = new UserModel({
            username: newRandomUsername,
            provider: "GitHub",
            GitHub_id: githubUser.id,
            picture: githubUser.avatar_url,
          });
          user.save();
          let token = signToken(user._id);
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: "Strict",
          });
          res.json({
            success: true,
            user: user,
          });
        }
      });
    });
  },
  loginGoogle: async (req, res) => {
    const { token } = req.body;
    // console.log("Client id: " + process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, picture } = ticket.getPayload();
    let checkUser = UserModel.findOne({ Google_Mail: email });
    checkUser.then(async (user) => {
      if (user) {
        let token = signToken(user._id);
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7,
          sameSite: "Strict",
        });
        res.json({
          success: true,
          user: user,
        });
      } else {
        var newRandomUsername = await getRandomUsername();
        console.log("New random username: " + newRandomUsername);
        let user = new UserModel({
          username: newRandomUsername,
          provider: "Google",
          Google_Mail: email,
          picture: picture,
        });
        user.save();
        let token = signToken(user._id);
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7,
          sameSite: "Strict",
        });
        res.json({
          success: true,
          user: user,
        });
      }
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
  // console.log("Token from request: " + token);
  if (token) {
    return userId;
  } else {
    return false;
  }
}

const axios = require("axios");

const github_client_id = process.env.GITHUB_CLIENT_ID;
const github_client_secret = process.env.GITHUB_CLIENT_SECRET;

async function checkGitHubLogin(code) {
  var access_token = await axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token?client_id=${github_client_id}&client_secret=${github_client_secret}&code=${code}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
      accept: "application/json",
    },
  })
    .then((response) => {
      return response.data.access_token;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
  if (!access_token) {
    return false;
  }
  // console.log("Access token:");
  // console.log(access_token);
  var githubUser = await axios({
    method: "get",
    url: `https://api.github.com/user`,
    headers: {
      Authorization: "token " + access_token,
    },
  })
    .then((response) => {
      // console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
  if (!githubUser) {
    return false;
  }
  return githubUser;
}

async function getRandomUsername() {
  var usernameIsFree = false;
  var username = "";
  while (!usernameIsFree) {
    var randomUsername = makeString(10);
    var user = await UserModel.findOne({ username: randomUsername }).exec();
    if (!user) {
      usernameIsFree = true;
      username = randomUsername;
    }
  }
  return username;
}

function makeString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
