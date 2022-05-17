const UserModel = require("../models/user_model");
var jwt = require("jsonwebtoken");
var cors = require("cors");
// jwt 30 Tage
const jwtExpirySeconds = 60 * 60 * 24 * 30;
const jwtKey = "SkyTokSecretKey!fqiwhdhuwqhdf2uhf2zgu";
const saltRounds = 11;
let UserService = {
  async createUser(req, res) {
    return;
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
  console.log("Token from request: " + token);
  if (token) {
    return userId;
  } else {
    return false;
  }
}
