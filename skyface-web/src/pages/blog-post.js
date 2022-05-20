import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import apiService from "../services/api-service";

const baseURL = "http://localhost:5000/blog/";

const copyButtonLabel = "Copy Code";

function copyCode(code) {
  navigator.clipboard.writeText(code);
}

export default function BlogPost() {
  var loggedInUser = reactLocalStorage.getObject("loggedInUser");
  let { blogUrl } = useParams();
  // console.log(id);
  const [posts, setPost] = React.useState(null);

  React.useEffect(() => {
    apiService("blog/" + blogUrl, {}).then((response) => {
      // setTimeout(() => {
      // axios.post(baseURL + blogUrl).then((response) => {
      //Order response.data["blogContent"] by position
      var blogContent = response.data["blogContent"];
      console.log(response.data);
      blogContent.sort(function (a, b) {
        return a.position - b.position;
      });
      setPost(response.data);
      // });
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
      {(() => {
        if (loggedInUser != null) {
          if (loggedInUser.user.role == "admin") {
            return (
              <div className="admin-edit-container" key="admin-edit-container">
                <div
                  className="admin-edit-button"
                  onClick={() => {
                    window.location.href = "/edit-blog/" + blogUrl;
                  }}
                >
                  <img
                    src={require("../img/edit-icon.png")}
                    width="40px"
                    alt="Edit-Icon"
                  />
                </div>
              </div>
            );
          }
        }
      })()}
      <div className="title-container">
        <img
          src={require("../img/blogs-title.png")}
          width="100%"
          alt="About-Title"
        />
        <div className="title-container-text">
          <h1>{posts["blog"].title}</h1>
          <h2>{posts["blog"].subtitle}</h2>
          <h3>{posts["blog"].updatedAt.substring(0, 10)}</h3>
          {(() => {
            if (posts["blog"].category != null) {
              return (
                <a
                  className="categories-link"
                  href={"/category/" + posts["blog"].category.url}
                >
                  {posts["blog"].category.name}
                </a>
              );
            }
          })()}
        </div>
      </div>

      {/* Blog Posts */}
      {(() => {
        const contentDivs = [];
        var content = posts["blogContent"];
        for (let i = 0; i < content.length; i++) {
          if (content[i].type === "text") {
            contentDivs.push(
              <div key={content[i]._id} className="content-div">
                <p>{content[i].content}</p>
              </div>
            );
          } else if (content[i].type == "code") {
            contentDivs.push(
              // <div key={content[i]._id} >
              <pre className="pre-code" key={content[i]._id}>
                <code>{content[i].content}</code>
                <button
                  className="copy-code-button"
                  onClick={() => copyCode(content[i].content)}
                >
                  {copyButtonLabel}
                </button>
              </pre>
              // </div>
            );
            //TODO: CHANGE
          } else if (content[i].type == "image") {
            contentDivs.push(
              <div key={content[i]._id}>
                <img src={content[i].content} alt="image" />
              </div>
            );
          } else if (content[i].type == "subline") {
            contentDivs.push(
              // <div key={content[i]._id} >
              <h3 key={content[i]._id} className="sublines">
                {content[i].content}
              </h3>
              // </div>
            );
          } else if (content[i].type == "link") {
            contentDivs.push(
              <div key={content[i]._id} className="content-link-div">
                <a href={content[i].content} target="_blank">
                  {content[i].content}
                </a>
              </div>
            );
          }
        }
        return contentDivs;
      })()}
    </div>
  );
}
