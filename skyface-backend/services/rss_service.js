const BlogModel = require("../models/blog_model");
const BlogContentModel = require("../models/blog_content_model");
const Feed = require("feed").Feed;

const frontendURL = "http://localhost:3000";

let RssService = {
  getRss: async (req, res) => {
    const feed = new Feed({
      title: "SkyBlog",
      description: "Blog feed",
      id: frontendURL,
      link: frontendURL,
      language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
      image: frontendURL + "/static/media/blogs-title.686ff20cf19f7b156b76.png",
      //   favicon: "http://example.com/favicon.ico",
      copyright: "All rights reserved 2022, Sebastian Jörz",
      //   updated: new Date(2013, 6, 14), // optional, default = today
      generator: "SkyBlog - RSSCreator", // optional, default = 'Feed for Node.js'
      //   feedLinks: {
      //     json: "https://example.com/json",
      //     atom: "https://example.com/atom",
      //   },
      author: {
        name: "Sebastian Jörz",
        email: "seppel8426@gmail.com",
        link: frontendURL + "/users/skyface",
      },
    });
    var blogPosts = await BlogModel.find({}).populate("posted_by");
    for (let blogPost of blogPosts) {
      var content = "";
      var blogContents = await BlogContentModel.find({
        for_blog: blogPost._id,
        type: "text",
      }).sort({
        position: 1,
      });
      for (let blogContent of blogContents) {
        content += " " + blogContent.content;
      }
      blogPost.content = content;
    }

    blogPosts.forEach(async (post) => {
      feed.addItem({
        title: post.title,
        id: post.url,
        link: frontendURL + "/blogs/" + post.url,
        subtitle: post.subtitle,
        content: post.content,
        author: [
          {
            name: post.posted_by.username,
            // email: "janedoe@example.com",
            // link: "https://example.com/janedoe",
          },
          //   {
          //     name: "Joe Smith",
          //     email: "joesmith@example.com",
          //     link: "https://example.com/joesmith",
          //   },
        ],
        // contributor: [
        //   {
        //     name: "Shawn Kemp",
        //     email: "shawnkemp@example.com",
        //     link: "https://example.com/shawnkemp",
        //   },
        //   {
        //     name: "Reggie Miller",
        //     email: "reggiemiller@example.com",
        //     link: "https://example.com/reggiemiller",
        //   },
        // ],
        date: post.created_at,
        // image: post.image,
      });
    });

    feed.addCategory("Technologie");

    feed.addContributor({
      name: "Johan Cruyff",
      email: "johancruyff@example.com",
      link: "https://example.com/johancruyff",
    });
    res.header("Content-Type", "text/xml").send(feed.rss2());
  },
};

module.exports = RssService;
