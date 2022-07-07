import React from "react";
import { allTypes, Content, TextContent } from "../../contentmodels/Content";
import NewBlogBlank from "./new-blog.json";
import ShowCategoriesSelect from "../../components/showCategoriesSelect";
import apiService from "../../services/api-service";

const initContent = [
  {
    _id: "1",
    text: "New Blog Text",
    for_blog: null,
    position: 0,
    type: "text",
    createdAt: null,
    updatedAt: null,
  },
];

var content = initContent.map((item) => {
  return Content.fromJSON(item);
});
export default function CreateBlog() {
  const [posts, setPost] = React.useState(NewBlogBlank);

  const [blogContent, setBlogContent] = React.useState(content);

  // React.useEffect(() => {
  //   apiService("admin/files").then((res) => {
  //     setFiles(res.data.files);
  //     setFilesLoaded(true);
  //   });
  // });

  return (
    <div>
      <div className="title-container">
        <img
          src={require("../../img/blogs-title.png")}
          width="100%"
          alt="About-Title"
        />
        <div className="title-container-text">
          <h1>{posts["blog"].title}</h1>
          <h2>{posts["blog"].subtitle}</h2>
        </div>
      </div>
      {(() => {
        var post = posts["blog"];
        return (
          <div className="title-edit-container">
            <label htmlFor="blog-title">Title</label>
            <input
              type="text"
              id="blog-title"
              placeholder="Title"
              value={post.title}
              onChange={(e) => {
                post.title = e.target.value;
                setPost({ ...posts, blog: post });
                //console.log(posts);
              }}
            />
            <label htmlFor="blog-subtitle">Subtitle</label>
            <input
              type="text"
              id="blog-subtitle"
              placeholder="Subtitle"
              value={post.subtitle}
              onChange={(e) => {
                post.subtitle = e.target.value;
                setPost({ ...posts, blog: post });
              }}
            />
            <label htmlFor="blog-url">URL</label>
            <input
              type="text"
              id="blog-url"
              placeholder="URL"
              value={post.url}
              onChange={(e) => {
                post.url = e.target.value;
                setPost({ ...posts, blog: post });
                //console.log(posts);
              }}
            />
            <label htmlFor="blog-image">Image</label>
            <input
              type="text"
              id="blog-image"
              placeholder="Image (optional)"
              value={post.blog_image}
              onChange={(e) => {
                post.blog_image = e.target.value;
                setPost({ ...posts, blog: post });
                //console.log(posts);
              }}
            />
          </div>
        );
      })()}
      {/* Blog Content */}
      {blogContent &&
        blogContent.map((content, index) => {
          if (content != null) {
            // if (content.type === "text") {
            return (
              <div key={"blub" + content._id}>
                <select
                  defaultValue={content.type}
                  onChange={(e) => {
                    var copyableContentJSON = content.getCopyableContentJSON();
                    copyableContentJSON.type = e.target.value;
                    blogContent[index] = Content.fromJSON(copyableContentJSON);
                    setBlogContent([...blogContent]);
                  }}
                >
                  {allTypes.map((type) => {
                    return (
                      <option value={type.value} key={type.value}>
                        {type.label}
                      </option>
                    );
                  })}
                </select>
                <button
                  className="content-up-button"
                  onClick={() => {
                    if (content.position > 0) {
                      var tempContent = blogContent[index];
                      blogContent[index] = blogContent[index - 1];
                      blogContent[index - 1] = tempContent;
                      setBlogContent([...blogContent]);
                    }
                  }}
                >
                  Up
                </button>
                <button
                  className="content-down-button"
                  onClick={() => {
                    if (content.position < blogContent.length - 1) {
                      var tempContent = blogContent[index];
                      blogContent[index] = blogContent[index + 1];
                      blogContent[index + 1] = tempContent;
                      setBlogContent([...blogContent]);
                    }
                  }}
                >
                  Down
                </button>
                <button
                  className="content-delete-button"
                  onClick={() => {
                    blogContent.splice(index, 1);
                    setBlogContent([...blogContent]);
                  }}
                >
                  Delete
                </button>
                {content.showEditor(blogContent, setBlogContent, index)}
              </div>
            );
          }
        })}
      <button
        onClick={() => {
          var newContent = new TextContent(
            blogContent.length,
            null,
            "NEW" + blogContent.length,
            "text",
            null,
            null,
            "New Text"
          );
          blogContent.push(newContent);
          setBlogContent([...blogContent]);
        }}
      >
        Add Content
      </button>
      <button
        onClick={() => {
          // Save
          var json = blogContent.map((content) => {
            return content.getJSON();
          });
          //console.log(json);
        }}
      >
        Save
      </button>

      <ShowCategoriesSelect
        selectedID={
          posts["blog"].category != null ? posts["blog"].category._id : null
        }
        onChange={(e) => {
          //console.log("New Selected: " + e.target.value);
          //console.log("OLD");
          //console.log(posts);
          posts["blog"].category = { _id: e.target.value };
          setPost({ ...posts, blog: posts["blog"] });
          //console.log("NEW");
          //console.log(posts);
          // setPost({ ...posts, category: e.target.value });
        }}
      />
      <button
        className="save-blog-button"
        onClick={() => {
          if (posts["blog"].title == "" || posts["blog"].subline == "") {
            alert("Please fill in all fields");
            return;
          }
          apiService("admin/blog/create", {
            blog: posts["blog"],
            blogContent: blogContent,
          }).then((response) => {
            //console.log(response);
            if (response.data.success) {
              alert("Blog saved!");
              window.location.href = "/blogs/" + posts.blog.url;
            } else {
              alert(response.data.message);
            }
          });
        }}
      >
        Save Blog
      </button>
    </div>
  );
}
