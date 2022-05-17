// Website for www.skyface.de
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

var express = require("express");
var app = express();

var http = require("http").Server(app);
var port = process.env.PORT || 5000;
var bodyParser = require("body-parser");
var expressSession = require("express-session");
var cookieParser = require("cookie-parser");
var mongoose = require("mongoose");
const config = require("./config.js");
var cors = require("cors");
const UserService = require("./services/user_service");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

var uri = "mongodb://" + config.mongodb.host + ":27017/skyfacedb";

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
  // const initDB = require('./services/init_db.js');
  // initDB();
});

//CORS
app.use(cors());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Authorization"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});
const UserModel = require("./models/user_model.js");

app.use(async (req, res, next) => {
  console.log(req.headers.authorization);
  const user = await UserModel.findOne({
    _id: req.session.userId,
  });
  console.log(user);
  if (user) {
    req.user = user;
  } else {
    req.user = null;
  }
  next();
});

// app.use(express.static(__dirname + '/public-old'));

// const blogModel = require('./models/blog_model.js');
// const blogCategoryModel = require('./models/blog_category_model.js');
// app.get('/test',async function(req, res) {

//     // Create a new blog category
//     var blogCategory = new blogCategoryModel({
//         name: 'name 1',
//         description: 'description 1'
//     });
//     await blogCategory.save();

//     // Create a new blog category
//     var blogCategory2 = new blogCategoryModel({
//         name: 'name 2',
//         description: 'description 2',
//         parent_category: blogCategory._id
//     });
//     await blogCategory2.save();
//     // Create a new blog
//     var blog = new blogModel({
//         title: 'title 1',
//         subtitle: 'subtitle 1',
//         content: 'content 1',
//         posted_by: 'Skyface',
//         categories: [blogCategory._id, blogCategory2._id],
//         url: 'url-1'
//     });
//     await blog.save();
//     // Create a new blog
//     var blog2 = new blogModel({
//         title: 'title 2',
//         subtitle: 'subtitle 2',
//         content: 'content 2',
//         posted_by: 'Skyface',
//         categories: [blogCategory2._id],
//         url: 'url-2'
//     });
//     await blog2.save();
//     // Get all blogs
//     blogModel.find(function(err, blogs) {
//         if (err) {console.log(err);}
//         else {
//             // Get all blog categories and populate the parent category and shot the name of the parent category
//             blogCategoryModel.find(function(err, blogCategories) {
//                 if (err) {console.log(err);}
//                 else {res.json(
//                     {
//                         blogs: blogs,
//                         blogCategories: blogCategories
//                     }
//                 );}
//             }).populate('parent_category', 'name');
//         }
//     });

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
    res.json({
      user: user,
      token: UserService.signTokenExport(user._id),
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
    res.json({
      user: user,
      token: UserService.signTokenExport(user._id),
    });
  }
});

const routes = require("./routes");
app.use("/", routes);

// Start the server
http.listen(port, function () {
  console.log("Server started on port " + port);
});
