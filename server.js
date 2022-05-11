// Website for www.skyface.de

var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const config = require('./config.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var uri = "mongodb://" + config.mongodb.host + ":27017/skyfacedb";

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

app.use(express.static(__dirname + '/public'));


const blogModel = require('./models/blog_model.js');
const blogCategoryModel = require('./models/blog_category_model.js');
app.get('/test',async function(req, res) {
    
    // Create a new blog category
    var blogCategory = new blogCategoryModel({
        name: 'name 1',
        description: 'description 1'
    });
    await blogCategory.save();

    // Create a new blog category
    var blogCategory2 = new blogCategoryModel({
        name: 'name 2',
        description: 'description 2',
        parent_category: blogCategory._id
    });
    await blogCategory2.save();
    // Create a new blog 
    var blog = new blogModel({
        title: 'title 1',
        subtitle: 'subtitle 1',
        content: 'content 1',
        posted_by: 'Skyface',
        categories: [blogCategory._id, blogCategory2._id],
        url: 'url-1'
    });
    await blog.save();
    // Create a new blog
    var blog2 = new blogModel({
        title: 'title 2',
        subtitle: 'subtitle 2',
        content: 'content 2',
        posted_by: 'Skyface',
        categories: [blogCategory2._id],
        url: 'url-2'
    });
    await blog2.save();
    // Get all blogs
    blogModel.find(function(err, blogs) {
        if (err) {console.log(err);}
        else {
            // Get all blog categories and populate the parent category and shot the name of the parent category
            blogCategoryModel.find(function(err, blogCategories) {
                if (err) {console.log(err);}
                else {res.json(
                    {
                        blogs: blogs,
                        blogCategories: blogCategories
                    }
                );}
            }).populate('parent_category', 'name');
        }
    });


});

const routes = require('./routes');
app.use('/', routes);

// Start the server
http.listen(port, function() {
    console.log('Server started on port ' + port);
});