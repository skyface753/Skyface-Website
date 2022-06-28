import React, { useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import ShowCategoriesSelect from "../../components/showCategoriesSelect";
import FilesSelector from "../../components/files-selector";
import apiService from "../../services/api-service";
import ShowFilesComponent from "../../components/show-files";
import { BACKEND_FILES_URL } from "../../consts";
import { AuthContext } from "../../App";
import { SeriesSelect } from "../../components/SeriesSelect";
// import TextContent from "../../contentmodels/Text";
import { MeetupLoader, SkyCloudLoader } from "../../components/Loader";
import { allTypes, Content, TextContent } from "../../contentmodels/Content";


export default function EditBlogPost() {
  // textClasses();
  const { state, dispatch } = useContext(AuthContext);
  if (!state.isLoggedIn) {
    alert("You must be logged in to edit a blog post");
    // return <div></div>;
  }
  if (state.user.role != "admin") {
    alert("You must be an admin to edit a blog post");
    // return <div></div>;
  }
  // if (loggedInUser == null || jwt == null) {
  //   //     console.log("User not logged in");
  //   alert("Please login to edit blog");
  //   window.location.href = "/";
  // }
  // if (loggedInUser.role != "admin") {
  //   //     console.log("User is not an Admin");
  //   alert("You are not an Admin");
  //   window.location.href = "/";
  // }
  let { blogUrl } = useParams();
  // console.log(id);
  const [posts, setPost] = React.useState(null);
  const [blogContent, setBlogContent] = React.useState(null);
  const [files, setFiles] = React.useState(null);
  const [filesLoaded, setFilesLoaded] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [currentContentIndex, setCurrentContentIndex] = React.useState(0);

  React.useEffect(() => {
    apiService("blog/" + blogUrl).then((response) => {
      setPost(response.data);
      var tempContent = response.data["blogContent"].map((content) => {
        return Content.fromJSON(content);
      });
      setBlogContent(tempContent);
      console.log(response.data);
    });
    apiService("admin/files").then((res) => {
      setFiles(res.data.files);
      setFilesLoaded(true);
    });
  }, []);

  if (!posts) return <SkyCloudLoader />;

  return (
    <div>
      {/* <div id="file-selector-main" className="files-selector-overlay">
        <div className="files-selector-header">
          <h1>Select File</h1>
          <div
            className="files-selector-close-button"
            onClick={() => {
              var fileSelector = document.getElementById("file-selector-main");
              fileSelector.style.display = "none";
            }}
          >
            Close
            <i className="fas fa-times"></i>
          </div>
        </div>
        <div className="files-selector-body">
          {filesLoaded ? (
            files.length === 0 ? (
              (console.log("No files uploaded yet"),
              (<p>No files uploaded yet</p>))
            ) : (
              (console.log("files: " + files),
              files.map((file) => {
                return ShowFilesComponent(file, () => {
                  console.log("CurrentContentIndex: " + currentContentIndex);
                  posts["blogContent"][currentContentIndex].content =
                    file.generated_name;
                  setPost(posts);
                  console.log(posts);
                  setSelectedFile(file);
                  var fileSelector =
                    document.getElementById("file-selector-main");
                  fileSelector.style.display = "none";
                });
              }))
            )
          ) : (
            <div className="loader" />
          )}
        </div>
      </div> */}
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
                console.log(posts);
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
                console.log(posts);
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
                console.log(posts);
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
                console.log(posts);
              }}
            />
          </div>
        );
      })()}
      {/* Blog Content */}
      {blogContent && (
      blogContent.map((content, index) => {
        if (content != null) {
          // if (content.type === "text") {
          return(
            <div key={"blub" + content._id}>
              <select
              defaultValue={content.type}
              onChange={(e) => {
                var copyableContentJSON = content.getCopyableContentJSON();
                copyableContentJSON.type = e.target.value;
                blogContent[index] = Content.fromJSON(copyableContentJSON);
                setBlogContent([...blogContent]);
              }}>
                {allTypes.map((type) => {
                  return (
                    <option value={type.value} key={type.value}>
                      {type.label}
                    </option>
                  );
                }
                )}
              </select>
              <button 
                className="content-up-button"
                onClick={() => {
                  if(content.position > 0) {
                    var tempContent = blogContent[index];
                    blogContent[index] = blogContent[index - 1];
                    blogContent[index - 1] = tempContent;
                    setBlogContent([...blogContent]);
                  }
                }
                }>
                Up
              </button>
              <button
                className="content-down-button"
                onClick={() => {
                  if(content.position < blogContent.length - 1) {
                    var tempContent = blogContent[index];
                    blogContent[index] = blogContent[index + 1];
                    blogContent[index + 1] = tempContent;
                    setBlogContent([...blogContent]);
                  }
                }
                }>
                Down
              </button>
              <button
                className="content-delete-button"
                onClick={() => {
                  blogContent.splice(index, 1);
                  setBlogContent([...blogContent]);
                }
                }>
                Delete
              </button>
              {content.showEditor(blogContent, setBlogContent, index)}
            </div>
          );
        }
      }
      )

      )}
      <button onClick={() => {
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
      }
      }>
        Add Content
      </button>
      <button onClick={() => {
        // Save
        var json = blogContent.map((content) => {
          return content.getJSON();
        })
        console.log(json);
      }}>
        Save
      </button>
      {/* Blog Posts */}
      {/* {(() => {
        const contentDivs = [];
        var content = posts["blogContent"];
        for (let i = 0; i < content.length; i++) {
          contentDivs.push(
            <div key={content[i]._id} className="content-div">
              <select
                className="content-type-selector"
                defaultValue={content[i].type}
                onChange={(e) => {
                  content[i].type = e.target.value;
                  setPost({ ...posts, blogContent: content });
                  console.log(posts);
                  // if (e.target.value == "image") {
                  //   // currentContentIndex = i;

                  // }
                }}
              >
                <option value="text">Text</option>
                <option value="code">Code</option>
                <option value="image">Image</option>
                <option value="subline">Subline</option>
                <option value="link">Link</option>
                <option value="download">Download</option>
                <option value="pureHTML">Pure HTML (dangerous)</option>
              </select>
              <button
                className="content-up-button"
                onClick={() => {
                  if (i > 0) {
                    var temp = content[i];
                    content[i] = content[i - 1];
                    content[i - 1] = temp;
                    content[i].position = i;
                    content[i - 1].position = i - 1;
                    setPost({ ...posts, blogContent: content });
                    console.log(posts);
                  }
                }}
              >
                {" "}
                ↑{" "}
              </button>
              <button
                className="content-down-button"
                onClick={() => {
                  if (i < content.length - 1) {
                    var temp = content[i];
                    content[i] = content[i + 1];
                    content[i + 1] = temp;
                    content[i].position = i;
                    content[i + 1].position = i + 1;
                    setPost({ ...posts, blogContent: content });
                    console.log(posts);
                  }
                }}
              >
                {" "}
                ↓{" "}
              </button>
              <button
                className="content-delete-button"
                onClick={() => {
                  // Confirm Delete
                  var confirmDelete = window.confirm(
                    "Are you sure you want to delete this content?"
                  );
                  if (confirmDelete) {
                    content.splice(i, 1);
                    setPost({ ...posts, blogContent: content });
                    console.log(posts);
                  }
                }}
              >
                {" "}
                X{" "}
              </button>
              <div className="content-div-content">
                <TextareaAutosize
                  value={content[i].content}
                  className="content-textarea"
                  onChange={(e) => {
                    content[i].content = e.target.value;
                    setPost({ ...posts, blogContent: content });
                    console.log(posts);
                  }}
                  onKeyDown={(e) => {
                    let caret = e.target.selectionStart;

                    if (e.key === "Tab") {
                      e.preventDefault();

                      let newText =
                        e.target.value.substring(0, caret) +
                        " ".repeat(4) +
                        e.target.value.substring(caret);
                      e.target.value = newText;
                      content[i].content = newText;
                      setPost({ ...posts, blogContent: content });
                      // Go to position after the tab
                      e.target.selectionStart = e.target.selectionEnd =
                        caret + 4;

                      // setText({value: newText, caret: caret, target: e.target});
                    }
                  }}
                />
                {(() => {
                  if (
                    content[i].type == "image" ||
                    content[i].type == "download"
                  ) {
                    return (
                      <div className="edit-blog-image-container">
                        <img
                          src={BACKEND_FILES_URL + content[i].content}
                          alt="Blog-Image"
                          className="edit-blog-image"
                        />
                        <button
                          onClick={() => {
                            setCurrentContentIndex(i);
                            console.log(
                              "currentContentIndex onchange: " +
                                currentContentIndex
                            );
                            var fileSelector =
                              document.getElementById("file-selector-main");
                            fileSelector.style.display = "block";
                          }}
                        >
                          Select
                        </button>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          );
          // if (content[i].type === "text") {
          // 	contentDivs.push(
          // 		<div key={content[i]._id} className='content-div'>
          // 		<p>{content[i].content}</p>
          // 		</div>
          // 	);
          // }
          // else if(content[i].type == "code"){

          // 	contentDivs.push(
          // 		// <div key={content[i]._id} >
          // 			<pre key={content[i]._id} className="pre-code">
          // 				<code>{content[i].content}</code>
          // 				<button className="copy-code-button" onClick={() => copyCode(content[i].content)}>{copyButtonLabel}</button>
          // 			</pre>
          // 		// </div>
          // 	);
          // 	//TODO: CHANGE
          // }else if(content[i].type == "image"){
          // 	contentDivs.push(
          // 		<div key={content[i]._id} >
          // 			<img src={content[i].content} alt="image" />
          // 		</div>
          // 	);
          // }else if(content[i].type == "subline"){
          // 	contentDivs.push(
          // 		// <div key={content[i]._id} >
          // 			<h3 key={content[i]._id} className='sublines'>{content[i].content}</h3>
          // 		// </div>
          // 	);
          // }
        }
        return contentDivs;
      })()}
      <button
        className="add-content-button"
        onClick={() => {
          var content = posts["blogContent"];
          content.push({
            type: "text",
            content: "",
            position: content.length,
          });
          setPost({ ...posts, blogContent: content });
        }}
      >
        Add Content
      </button> */}
      <ShowCategoriesSelect
        selectedID={
          posts["blog"].category != null ? posts["blog"].category._id : null
        }
        onChange={(e) => {
          console.log("New Selected: " + e.target.value);
          console.log("OLD");
          console.log(posts);
          posts["blog"].category = { _id: e.target.value };
          setPost({ ...posts, blog: posts["blog"] });
          console.log("NEW");
          console.log(posts);
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
          console.log("New Selected: " + seriesID);
          posts["blog"].series = { _id: seriesID };
          setPost({ ...posts, blog: posts["blog"] });
          console.log("NEW");
          console.log(posts);
          // console.log("OLD");
          // console.log(posts);
          // posts["blog"].series = { _id: e.target.value };
          // setPost({ ...posts, blog: posts["blog"] });
          // console.log("NEW");
          // console.log(posts);
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
              posts["blog"].series_position == "" ||
              posts["blog"].series_position == 0
            ) {
              alert("Please enter a series position > 0");
              console.log("position: " + posts["blog"].series_position);
              console.log(posts["blog"]);
              return;
            }
          }

          apiService("blog/edit/" + posts.blog._id, {
            blog: posts["blog"],
            blogContent: blogContent,
          }).then((response) => {
            console.log(response);
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
