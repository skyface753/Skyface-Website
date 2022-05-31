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
    origin: ["http://localhost:3000", "http://localhost:19006"],
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

// app.use(async (req, res, next) => {
//   const user = await UserModel.findOne({
//     _id: req.session.userId,
//   });
//   if (user) {
//     req.user = user;
//   } else {
//     req.user = null;
//   }
//   next();
// });


app.post("/api/v1/auth/google", async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { given_name, family_name, name, email, picture } = ticket.getPayload();
  const user = await UserModel.findOne({ email: email });

  console.log("Name: " + name + " Email: " + email + " Picture: " + picture);
  if (user && user.provider === "google") {
    // Update the user in the database
    user.username = name;
    user.picture = picture;
    user.givenName = given_name;
    user.familyName = family_name;
    await user.save();
    req.session.userId = user.id;
    var jwt = UserService.signTokenExport(user._id);
    res.
    cookie("jwt", jwt, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: "Strict" }).
         json({
      user: user,
    });
  } else if (user && user.provider !== "google") {
    res.status(400).send("User already exists with different provider");
  } else {
    const user = new UserModel({
      givenName: given_name,
      familyName: family_name,
      username: name,
      email: email,
      picture: picture,
      provider: "google",
    });
    await user.save();
    req.session.userId = user.id;
    var jwt = UserService.signTokenExport(user._id);
    res.
    cookie("jwt", jwt, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: "Strict" }).
    res.json({
      user: user,
    });
  }
});
app.use("/uploaded-files", express.static(__dirname + "/uploaded-files"));
const routes = require("./routes");
app.use("/", routes);
var http = require("http").Server(app);
// Start the server
http.listen(port, function () {
  console.log("Server started on port " + port);
});
