// Website for www.skyface.de
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

var express = require("express");
var cors = require("cors");
csrf = require("csurf");
var app = express();
//CORS
// app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:19006",
      "http://127.0.0.1:3000",
      "http://skyface.de",
      "http://skyface.de:3000",
      process.env.FRONTEND_URL || "https://skyface.de",
    ],
    credentials: true,
  })
);
// set up rate limiter: maximum of five requests per minute
var RateLimit = require("express-rate-limit");
var limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 400000,
});

// apply rate limiter to all requests
app.use(limiter);

var port = process.env.PORT || 5000;
var bodyParser = require("body-parser");
var expressSession = require("express-session");
var cookieParser = require("cookie-parser");
var mongoose = require("mongoose");
const config = require("./config.js");
// const multer = require("multer");
const UserService = require("./services/user_service");

// var allowCrossDomain = function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', "*");
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// };

// app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(
//   expressSession({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: false,
//   })
// );
app.use(cookieParser());
// app.use(csrf({ cookie: true }));
var uri = "mongodb://" + config.mongodb.host + ":27017/skyfacedb";

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

const UserModel = require("./models/user_model.js");

// var client_id = process.env.CLIENT_ID;
// var redirect_uri = process.env.REDIRECT_URI;
// var client_secret = process.env.CLIENT_SECRET;

// const axios = require('axios')

// async function createProvidedAccount(provider, user, res) {
//   const userModel = new UserModel({
//     givenName: user.givenName,
//     familyName: user.familyName,
//     username: user.username,
//     email: user.email,
//     picture: user.picture,
//     provider: provider,
//   });
//   await userModel.save();
//   var jwt = UserService.signTokenExport(userModel._id);
//   res.cookie("jwt", jwt, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: "Strict" })
//   res.json({
//     user: userModel,
//   });
// }

// app.post("/api/v1/auth/github", async (req, res) => {
//   console.log("Github auth code:");
//   console.log(req.body.code);
//   const code = req.body.code;

//   var access_token = await axios({
//     method: 'post',
//     url: `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
//     // Set the content type header, so that we get the response in JSON
//     headers: {
//          accept: 'application/json'
//     }
//   }).then((response) => {
//     console.log(response.data);
//     return response.data.access_token;
//   }).catch((error) => {
//     console.log(error);
//   });
//     console.log("Access token:");
//     console.log(access_token);
//     var githubUser = await axios({
//       method: 'get',
//       url: `https://api.github.com/user`,
//       headers: {
//         Authorization: 'token ' + access_token
//       }
//     }).then((response) => {
//       console.log(response.data);
//       return response.data;
//     }).catch((error) => {
//       console.log(error);
//     });
//     var checkUser = await UserModel.findOne({
//       username: githubUser.login,
//     }).exec();
//     if (checkUser && checkUser.provider === "github") {
//       console.log("User already exists");
//       var jwt = UserService.signTokenExport(checkUser._id);
//       res.cookie("jwt", jwt, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: "Strict" })
//       res.json({
//         success: true,
//         user: checkUser,
//       });
//     } else if(checkUser && checkUser.provider !== "github") {
//       console.log("User already exists but not with github");
//       res.json({
//         success: false,
//         message: "User already exists but not with github",
//       });
//     }else{
//       console.log("User does not exist");
//       var newUser = {
//         username: githubUser.login,
//         email: githubUser.login + "@from.github.com",
//         picture: githubUser.avatar_url,

//       }
//       await createProvidedAccount("github", newUser, res);

//     }
//     // .then(async (response, req, res) => {
//     //   // res.render('pages/success',{ userData: response.data });
//     //   console.log("Github user data:");
//     //   console.log(response.data);
//     //   const checkUser = await UserModel.findOne({
//     //     username: response.data.login,
//     //   });
//     //   if (checkUser && checkUser.provider === "github"){
//     //     console.log("User already exists");
//     //     var jwt = UserService.signTokenExport(checkUser._id);
//     //     res.cookie("jwt", jwt, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: "Strict" })
//     //     res.json({
//     //       user: checkUser,
//     //     });
//     //   }else if(checkUser && checkUser.provider !== "github"){
//     //     console.log("User already exists but not from Github");
//     //     res.json({
//     //       error: "User already exists but not from Github",
//     //     });
//     //   }else{
//     //     var newUser = {
//     //       givenName: response.data.login,
//     //       familyName: response.data.login,
//     //       username: response.data.login,
//     //       email: response.data.email || response.data.login + "@github.com",
//     //       picture: response.data.avatar_url
//     //     }
//     //     await createProvidedAccount("github", newUser, res);
//     //   }

//     // })
//   })

// app.post("/api/v1/auth/google", async (req, res) => {
//   const { token } = req.body;
//   console.log("Client id: " + process.env.GOOGLE_CLIENT_ID);
//   const ticket = await client.verifyIdToken({
//     idToken: token,
//     audience: process.env.GOOGLE_CLIENT_ID,
//   });
//   const { given_name, family_name, name, email, picture } = ticket.getPayload();
//   console.log("Payload:");
//   console.log(ticket.getPayload());
//   const user = await UserModel.findOne({ email });

//   console.log("Name: " + name + " Email: " + email + " Picture: " + picture);
//   if (user && user.provider === "google") {
//     // Update the user in the database
//     user.username = name;
//     user.picture = picture;
//     user.givenName = given_name;
//     user.familyName = family_name;
//     await user.save();
//     // req.session.userId = user.id;
//     var jwt = UserService.signTokenExport(user._id);
//     res.
//     cookie("jwt", jwt, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: "Strict" }).
//          json({
//       user: user,
//     });
//   } else if (user && user.provider !== "google") {
//     res.status(400).send("User already exists with different provider");
//   } else {
//     await createProvidedAccount("google", {
//       given_name,
//       family_name,
//       name,
//       email,
//       picture,
//     }, res);
//     // const user = new UserModel({
//     //   givenName: given_name,
//     //   familyName: family_name,
//     //   username: name,
//     //   email: email,
//     //   picture: picture,
//     //   provider: "google",
//     // });
//     // await user.save();
//     // // req.session.userId = user.id;
//     // var jwt = UserService.signTokenExport(user._id);
//     // res.
//     // cookie("jwt", jwt, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: "Strict" }).
//     // res.json({
//     //   user: user,
//     // });
//   }
// });

app.use("/uploaded-files", express.static(__dirname + "/uploaded-files"));

// RSS
const RssService = require("./services/rss_service.js");
app.get("/rss", RssService.getRss);
app.get("/rss.xml", RssService.getRss);

// React Integration
if (process.env.NODE_ENV !== "development") {
  const path = __dirname + "/react_build/";
  app.use(express.static(path));

  app.get("*", function (req, res) {
    res.sendFile(path + "index.html");
  });
}

const { response } = require("express");
const routes = require("./routes");
app.use("/", routes);

var http = require("http").Server(app);
// Start the server
http.listen(port, function () {
  console.log("Server started on port " + port);
});
