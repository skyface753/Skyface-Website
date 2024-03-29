const UserModel = require('../models/user_model');
const BlogModel = require('../models/blog_model');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
var jwt = require('jsonwebtoken');
const config = require('../config');
var cors = require('cors');
// jwt 30 Tage
const jwtExpirySeconds = 60 * 60 * 24 * 30;
const jwtKey = config.jwt.secret;
const saltRounds = config.jwt.rounds;
const bycrypt = require('bcrypt');

console.log('Secret: ' + config.jwt.secret);
console.log('Rounds: ' + saltRounds);

var failures = {};
function onLoginFail(remoteIp) {
  var f = (failures[remoteIp] = failures[remoteIp] || {
    count: 0,
    nextTry: new Date(),
  });
  ++f.count;
  if (f.count % 3 == 0) {
    f.nextTry.setTime(Date.now() + 1000 * 60 * 1); // 2 minutes
    // f.nextTry.setTime(Date.now() + 1000 * f.count); // Wait another two seconds for every failed attempt
  }
}

function onLoginSuccess(remoteIp) {
  delete failures[remoteIp];
}

// Clean up people that have given up
var MINS10 = 600000,
  MINS30 = 3 * MINS10;
setInterval(function () {
  for (var ip in failures) {
    if (Date.now() - failures[ip].nextTry > MINS10) {
      delete failures[ip];
    }
  }
}, MINS30);

let UserService = {
  logout: (req, res) => {
    res.clearCookie('jwt');
    res.json({
      success: true,
      message: 'Logged out',
    });
  },
  getAllUsers: async (req, res) => {
    var users = await UserModel.find({}).exec();
    res.json({
      success: true,
      users: users,
    });
  },
  checkIfUsernameIsFree: async (req, res) => {
    var username = req.params.username;
    if (!username) {
      res.json({
        success: false,
        message: 'No username provided',
      });
      return;
    }
    let user = await UserModel.findOne({ username: username });
    if (user) {
      res.json({
        success: false,
        message: 'Username is already taken',
        free: false,
      });
      return;
    }
    res.json({
      success: true,
      message: 'Username is free',
      free: true,
    });
  },
  changeUsername: async (req, res) => {
    var newUsername = req.body.newUsername;
    var userInReq = req.user; // From Router Middleware
    if (!newUsername) {
      res.json({
        success: false,
        message: 'No new username provided',
      });
      return;
    }
    if (newUsername.length < 3 || newUsername.length > 20) {
      res.json({
        success: false,
        message: 'Username must be between 3 and 20 characters',
      });
      return;
    }
    if (newUsername.match(/[^a-zA-Z0-9]/)) {
      res.json({
        success: false,
        message: 'Username must only contain letters and numbers',
      });
      return;
    }
    let user = await UserModel.findOne({ username: newUsername });
    if (user) {
      res.json({
        success: false,
        message: 'Username already taken',
      });
      return;
    }
    userInReq.username = newUsername;
    await userInReq.save();
    res.json({
      success: true,
      message: 'Username changed',
    });
  },
  changePassword: async (req, res) => {
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var userInReq = req.user; // From Router Middleware
    if (!oldPassword || !newPassword) {
      res.json({
        success: false,
        message: 'No password provided',
      });
      return;
    }
    if (newPassword.length < 6 || newPassword.length > 20) {
      res.json({
        success: false,
        message: 'Password must be between 6 and 20 characters',
      });
      return;
    }
    var userFromDB = await UserModel.findOne({ _id: userInReq._id });
    if (!userFromDB) {
      res.json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    if (!bycrypt.compareSync(oldPassword, userFromDB.password)) {
      res.json({
        success: false,
        message: 'Wrong old password',
      });
      return;
    }
    userFromDB.password = bycrypt.hashSync(newPassword, saltRounds);
    await userFromDB.save();
    res.json({
      success: true,
      message: 'Password changed',
    });
  },

  getUserProfile: async (req, res) => {
    var username = req.params.username;
    //User without password
    let user = await UserModel.findOne({ username: username }, { password: 0 });
    if (!user) {
      res.json({
        success: false,
        message: 'User not found',
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
    if (!username || !password) {
      res.json({
        success: false,
        message: 'No Username or Password provided',
      });
      return;
    }
    const remoteIp = req.ip;
    var f = failures[remoteIp];
    if (f && Date.now() < f.nextTry) {
      // Throttled. Can't try yet.
      return res.json({
        success: false,
        message:
          'Too many failed attempts. Try again in ' +
          Math.round((f.nextTry - Date.now()) / 1000 / 60) +
          ' minutes.',
      });
    }

    let user = await UserModel.findOne({
      username: username,
      provider: 'Manuelly',
    });
    if (!user) {
      onLoginFail(remoteIp);
      res.json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    let isPasswordCorrect = await bycrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      onLoginFail(remoteIp);
      res.json({
        success: false,
        message: 'Password is incorrect',
      });
      return;
    }

    let token = signToken(user._id);
    //Clear password
    user.password = undefined;
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'Strict',
    });
    onLoginSuccess(remoteIp);
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
        message: 'Missing parameters',
      });
      return;
    }
    let provider = 'Manuelly';
    let user = await UserModel.findOne({ username: username });
    if (user) {
      res.json({
        success: false,
        message: 'User already exists',
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
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'Strict',
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
          message: 'GitHub login failed',
        });
        return;
      }
      let checkUser = UserModel.findOne({ GitHub_id: githubUser.id });
      checkUser.then(async (user) => {
        if (user) {
          let token = signToken(user._id);
          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: 'Strict',
          });
          res.json({
            success: true,
            user: user,
          });
        } else {
          var newRandomUsername = await getRandomUsername();
          let user = new UserModel({
            username: newRandomUsername,
            provider: 'GitHub',
            GitHub_id: githubUser.id,
            picture: githubUser.avatar_url,
          });
          user.save();
          let token = signToken(user._id);
          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: 'Strict',
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
        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7,
          sameSite: 'Strict',
        });
        res.json({
          success: true,
          user: user,
        });
      } else {
        var newRandomUsername = await getRandomUsername();
        console.log('New random username: ' + newRandomUsername);
        let user = new UserModel({
          username: newRandomUsername,
          provider: 'Google',
          Google_Mail: email,
          picture: picture,
        });
        user.save();
        let token = signToken(user._id);
        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7,
          sameSite: 'Strict',
        });
        res.json({
          success: true,
          user: user,
        });
      }
    });
  },
  deleteUser: async (req, res) => {
    let userId = req.params.userID;
    if (!userId) {
      res.json({
        success: false,
        message: 'Missing parameters',
      });
      return;
    }
    // Requesting user must be admin
    let requestingUser = await UserModel.findById(req.user._id);
    if (requestingUser.role !== 'admin') {
      res.json({
        success: false,
        message: 'You are not authorized to delete users',
      });
      return;
    }
    let user = await UserModel.findById(userId);
    if (!user) {
      res.json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    // User can't delete himself
    if (requestingUser._id.equals(user._id)) {
      res.json({
        success: false,
        message: 'You can not delete yourself',
      });
      return;
    }

    await UserModel.deleteOne({
      _id: userId,
    });

    // Rewrite all Refs to this user
    // Blog Likes
    await blog_likes_model.updateMany(
      {
        by_user: userId,
      },
      {
        by_user: requestingUser._id,
      }
    );
    // Blogs
    await blog_model.updateMany(
      {
        posted_by: userId,
      },
      {
        posted_by: requestingUser._id,
      }
    );
    // Views
    await blog_views_model.updateMany(
      {
        userId: userId,
      },
      {
        userId: requestingUser._id,
      }
    );

    // Comments
    await comment_model.updateMany(
      {
        by_user: userId,
      },
      {
        by_user: requestingUser._id,
      }
    );

    // Contacts
    await contact_model.updateMany(
      {
        from_user: userId,
      },
      {
        from_user: requestingUser._id,
      }
    );

    // Deleted Blogs
    await deleted_blog_model.updateMany(
      {
        posted_by: userId,
      },
      {
        posted_by: requestingUser._id,
      }
    );
    await deleted_blog_model.updateMany(
      {
        deleted_by: userId,
      },
      {
        deleted_by: requestingUser._id,
      }
    );
    // Files
    await file_model.updateMany(
      {
        uploaded_by: userId,
      },
      {
        uploaded_by: requestingUser._id,
      }
    );
    // Self tracker - DELETE
    await self_tracker_model.deleteMany({
      stateUserId: userId,
    });
    await self_tracker_model.deleteMany({
      cookieUserId: userId,
    });

    res.json({
      success: true,
      message: 'User deleted',
    });
  },
  signTokenExport: signToken,
  verifyTokenExport: verifyToken,
};

// async function deleteCommentRecursive(commentId) {
//   let comment = await comment_model.findById(commentId);
//   if (!comment) {
//     return;
//   }
//   let replies = await comment_model.find({
//     reply_to: commentId,
//   });
//   for (let i = 0; i < replies.length; i++) {
//     await deleteCommentRecursive(replies[i]._id);
//   }
//   await comment_model.deleteOne({
//     _id: commentId,
//   });
// }

async function initDefaultAdmin() {
  let user = await UserModel.findOne({
    role: 'admin',
  });
  if (!user) {
    let hashedPassword = await bycrypt.hash('admin', saltRounds);
    user = new UserModel({
      username: 'admin',
      password: hashedPassword,
      provider: 'Manuelly',
      role: 'admin',
    });
    user.save();
  }
}

initDefaultAdmin();

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
    algorithm: 'HS256',
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

const axios = require('axios');
const blog_likes_model = require('../models/blog_likes_model');
const blog_views_model = require('../models/blog_views_model');
const blog_model = require('../models/blog_model');
const comment_model = require('../models/comment_model');
const contact_model = require('../models/contact_model');
const deleted_blog_model = require('../models/deleted_blog_model');
const file_model = require('../models/file_model');
const self_tracker_model = require('../models/self_tracker_model');

const github_client_id = process.env.GITHUB_CLIENT_ID;
const github_client_secret = process.env.GITHUB_CLIENT_SECRET;

async function checkGitHubLogin(code) {
  var access_token = await axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${github_client_id}&client_secret=${github_client_secret}&code=${code}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
      accept: 'application/json',
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
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + access_token,
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
  var username = '';
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
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
