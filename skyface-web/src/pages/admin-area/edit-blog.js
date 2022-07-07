import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import ShowCategoriesSelect from "../../components/showCategoriesSelect";
import apiService from "../../services/api-service";
import { AuthContext } from "../../App";
import { SeriesSelect } from "../../components/SeriesSelect";
// import TextContent from "../../contentmodels/Text";
import { SkyCloudLoader } from "../../components/Loader";
import { allTypes, Content, TextContent } from "../../contentmodels/Content";

export default function EditBlogPost() {
  // textClasses();
  const { state, dispatch } = useContext(AuthContext);
  if (!state.isLoggedIn) {
    alert("You must be logged in to edit a blog post");
  }
  if (state.user.role !== "admin") {
    alert("You must be an admin to edit a blog post");
  }
  let { blogUrl } = useParams();
  const [posts, setPost] = React.useState(null);
  const [blogContent, setBlogContent] = React.useState(null);

  React.useEffect(() => {
    apiService("blog/" + blogUrl).then((response) => {
      setPost(response.data);
      var tempContent = response.data["blogContent"].map((content) => {
        return Content.fromJSON(content);
      });
      setBlogContent(tempContent);
      //console.log(response.data);
    });
  }, []);

  if (!posts) return <SkyCloudLoader />;

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
                //console.log(posts);
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
          blogContent.map((content) => {
            return content.getJSON();
          });
          //console.log(json);
        }}
      >
        Save
      </button>
      {/* Blog Posts */}

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
      <SeriesSelect
        selectedSeries={
          posts["blog"].series != null && posts["blog"].series._id != null
            ? posts["blog"].series._id
            : null
        }
        onChange={(seriesID) => {
          //console.log("New Selected: " + seriesID);
          posts["blog"].series = { _id: seriesID };
          setPost({ ...posts, blog: posts["blog"] });
          //console.log("NEW");
          //console.log(posts);
        }}
      />
      {posts["blog"].series != null && posts["blog"].series._id != null ? (
        <input
          type="number"
          placeholder="Series Position"
          value={
            posts["blog"].series_position != null
              ? posts["blog"].series_position
              : ""
          }
          onChange={(e) => {
            posts["blog"].series_position = e.target.value;
            setPost({ ...posts, blog: posts["blog"] });
          }}
        />
      ) : null}
      <button
        className="save-blog-button"
        onClick={() => {
          if (
            posts["blog"].series != null &&
            posts["blog"].series._id != null
          ) {
            if (
              posts["blog"].series_position == null ||
              posts["blog"].series_position === "" ||
              posts["blog"].series_position === 0
            ) {
              alert("Please enter a series position > 0");
              //console.log("position: " + posts["blog"].series_position);
              //console.log(posts["blog"]);
              return;
            }
          }

          apiService("blog/edit/" + posts.blog._id, {
            blog: posts["blog"],
            blogContent: blogContent,
          }).then((response) => {
            //console.log(response);
            if (response.data.success) {
              alert("Blog saved!\n" + response.data.message);
              window.location.href = "/blogs/" + posts.blog.url;
            } else {
              alert("Error: " + response.data.message);
            }
          });
        }}
      >
        Save Blog
      </button>
    </div>
  );
}
