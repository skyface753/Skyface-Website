const blogModel = require('../models/blog_model.js');
const blogContentModel = require('../models/blog_content_model.js');
const blogCategoryModel = require('../models/blog_category_model.js');

let BlogService = {
    getAllBlogs: async (req, res) => {
        let blogs = await blogModel.find().sort({ createdAt: -1 });
        res.json(blogs);
    },
    getSingleBlogByUrl: async (req, res) => {
        var blogUrl = req.params.url;
        console.log(blogUrl);
        // console.log(req.body);
        let blog = await blogModel.findOne({url: blogUrl});
        let blogContent = await blogContentModel.find({for_blog: blog._id}).sort({position: 1});
        res.json({
            blog: blog,
            blogContent: blogContent
        });
    },
    getLast5Blogs: async (req, res) => {
        let blogs = await blogModel.find().sort({ createdAt: -1}).limit(5);
        res.json(blogs);
    },
}

module.exports = BlogService;
// createDummyBlog();

const UserModel = require('../models/user_model.js');

async function createDummyBlog(){
    setTimeout(async () => {
    
    // Create User Skyface
    let userSkyface = new UserModel({
        username: 'Skyface',
        email: 'sjoerz@skyface.de',
        password: '123456',
        role: 'admin'
    });
    await userSkyface.save();

    for(let i = 0; i < 10; i++){
    let title = 'Title ' + i;
    let subtitle = 'Subtitle ' + i;
    let content = [];
    for(let j = 0; j < 10; j++){
        var words =["The sky", "above", "the port","was", "the color of television", "tuned", "to", "a dead channel", ".", "All", "this happened", "more or less","." ,"I", "had", "the story", "bit by bit", "from various people", "and", "as generally", "happens", "in such cases", "each time", "it", "was", "a different story","." ,"It", "was", "a pleasure", "to", "burn"];
var text = [];
var x = 100;
while(--x) text.push(words[Math.floor(Math.random() * words.length)]);
        let contentItem = {
            content: 'Content ' + j + ': ' + text.join(' '),
            position: j
        }
        content.push(contentItem);
    }
    let posted_by = userSkyface._id;
    let categories = [];
    let url = 'url-test-' + i;
    let blog = new blogModel({
        title: title,
        subtitle: subtitle,
        posted_by: posted_by,
        categories: categories,
        url: url
    });
    await blog.save();
    
    for (let i = 0; i < content.length; i++) {
        let blogContent = new blogContentModel({
            content: content[i].content,
            for_blog: blog._id,
            position: content[i].position,
            type: 'text'
        });
        await blogContent.save();
    }
}
console.log("Blogs created");
}, 1000);
}