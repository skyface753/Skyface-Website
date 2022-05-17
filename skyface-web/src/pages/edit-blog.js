import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import TextareaAutosize from "react-textarea-autosize";

const baseURL = "http://localhost:5000/blog/";

export default function EditBlogPost() {
  var loggedInUser = reactLocalStorage.getObject("loggedInUser", null);
  var jwt = reactLocalStorage.get("jwt", null);
  console.log("jwt: " + jwt);
  console.log("loggedInUser: " + loggedInUser);
  //   if (loggedInUser == null || jwt == null) {
  //     console.log("User not logged in");
  //     alert("Please login to edit blog");
  //     window.location.href = "/";
  //   }
  //   if (loggedInUser.user.role != "admin") {
  //     console.log("User is not an Admin");
  //     alert("You are not an Admin");
  //     window.location.href = "/";
  //   }
  let { blogUrl } = useParams();
  // console.log(id);
  const [posts, setPost] = React.useState(null);

  React.useEffect(() => {
    // setTimeout(() => {
    axios.post(baseURL + blogUrl).then((response) => {
      setPost(response.data);
      // console.log(response.data);
    });
  }, []);

  if (!posts) return <div className="loader" />;

  return (
    <div
    // style={
    // 	{
    // 		width: '80%',
    // 		margin: '0 auto',
    // 		textAlign: 'center',
    // 		border: '1px solid #e0e0e0',
    // 		padding: '5%',
    // 	}
    // }
    >
      <div className="title-container">
        <img
          src={require("../img/blogs-title.png")}
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
                    e.target.selectionStart = e.target.selectionEnd = caret + 4;

                    // setText({value: newText, caret: caret, target: e.target});
                  }
                }}
              />
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
      <button
        className="save-blog-button"
        onClick={() => {
          axios
            .post(
              baseURL + "edit/" + posts.blog._id,
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
