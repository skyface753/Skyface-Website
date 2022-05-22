import React from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import NewBlogBlank from "./new-blog.json";
import TextareaAutosize from "react-textarea-autosize";
import { BACKEND_FILES_URL } from "../../consts";
import ShowFilesComponent from "../../components/show-files";
import ShowCategoriesSelect from "../../components/showCategoriesSelect";
import axios from "axios";
const baseURL = "http://localhost:5000/admin/blog/";
export default function CreateBlog() {
  var loggedInUser = reactLocalStorage.getObject("loggedInUser", null);
  var jwt = reactLocalStorage.get("jwt", null);
  if (loggedInUser == null || jwt == null) {
    //     console.log("User not logged in");
    alert("Please login to edit blog");
    window.location.href = "/";
  }
  if (loggedInUser.role != "admin") {
    //     console.log("User is not an Admin");
    alert("You are not an Admin");
    window.location.href = "/";
  }

  const [posts, setPost] = React.useState(NewBlogBlank);
  const [files, setFiles] = React.useState(null);
  const [filesLoaded, setFilesLoaded] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);

  const [currentContentIndex, setCurrentContentIndex] = React.useState(0);

  return (
    <div>
      <div id="file-selector-main" className="files-selector-overlay">
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
      </div>
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
          </div>
        );
      })()}
      {/* Blog Posts */}
      {(() => {
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
                  if (content[i].type == "image") {
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
      </button>
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
      <button
        className="save-blog-button"
        onClick={() => {
          axios
            .post(
              baseURL + "create",
              {
                blog: posts["blog"],
                blogContent: posts["blogContent"],
              },
              {
                headers: {
                  Authorization: jwt,
                },
              }
            )
            .then((response) => {
              console.log(response);
              if (response.data.success) {
                alert("Blog saved!");
                window.location.href = "/blogs/" + posts.blog.url;
              }
            });
        }}
      >
        Save Blog
      </button>
    </div>
  );
}
