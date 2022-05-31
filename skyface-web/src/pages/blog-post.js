import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";
import apiService from "../services/api-service";
import { BACKEND_FILES_URL } from "../consts";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useLocation } from "react-router-dom";
// import SeriesBlogsComp from "../components/SeriesBlogsComp";
// import SidebarSeries from "../components/SidebarSeries";

const copyButtonLabel = "Copy Code";

function copyCode(code) {
  navigator.clipboard.writeText(code);
}

function gotoBlockFromSeries(seriesBlogUrl) {
  window.location.href = seriesBlogUrl
  // window.location.href = seriesBlogUrl;
}

function createSeriesBlogStepBarItem(
  id,
  url,
  active = false,
  pos,
  title
) {
  return (
    <li
      onClick={() => gotoBlockFromSeries(url)}
      key={id}
      className={`blogs-series-step-bar-item ${
        active ? "blogs-series-step-bar-item-active" : ""
      }`}
    >
      {pos + 1}
      <span className="blogs-series-step-bar-item-tooltip">{title}</span>
    </li>
  );
}

function createSeriesBlogsStepBar(seriesBlogs, currpPostId) {
  var seriesBlogsElements = [];
  for (var i = 0; i < seriesBlogs.length; i++) {
    var currentBlogsUrl = seriesBlogs[i].url;
    if (seriesBlogs[i]._id === currpPostId) {
      seriesBlogsElements.push(
        createSeriesBlogStepBarItem(
          seriesBlogs[i]._id,
          currentBlogsUrl,
          true,
          i,
          seriesBlogs[i].title
        )
      );
    } else {
      seriesBlogsElements.push(
        createSeriesBlogStepBarItem(
          seriesBlogs[i]._id,
          currentBlogsUrl,
          false,
          i,
          seriesBlogs[i].title
        )
      );
    }
  }
  return seriesBlogsElements;
}

export default function BlogPost() {
  var loggedInUser = reactLocalStorage.getObject("loggedInUser");
  let { blogUrl } = useParams();
  const location = useLocation();
  // console.log(id);
  const [posts, setPost] = React.useState(null);
  const [comments, setComments] = React.useState(null);
  const [series, setSeries] = React.useState(null);
  const [seriesBlogs, setSeriesBlogs] = React.useState(null);

  React.useEffect(() => {
    // try {
    //   const queryParams = new URLSearchParams(location.search);
    //   var seriesUrl = queryParams.get("series");
    //   if (seriesUrl) {
    //     apiService("series/" + seriesUrl).then((response) => {
    //       console.log(response.data);
    //       setSeries(response.data["series"]);
    //       setSeriesBlogs(response.data["seriesBlogs"]);
    //     });
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
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
      setComments(response.data["blogComments"]);
      if(response.data["series"]){
        setSeries(response.data["series"]);
        setSeriesBlogs(response.data["seriesBlogs"]);
      }
      // });
    });
  }, []);

  if (!posts) return <div className="loader" />;
  // console.log(seriesUrl);
  return (
    <div>
      

      {(() => {
        if (loggedInUser != null) {
          if (loggedInUser.role == "admin") {
            return (
              <div className="admin-edit-container" key="admin-edit-container">
                <div
                  className="admin-edit-button"
                  onClick={() => {
                    window.location.href = "/admin/edit-blog/" + blogUrl;
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
        </div>
      </div>

      <div className="blog-meta">
        {(() => {
          if (posts["blog"].category != null) {
            return (
              <p>
                <a
                  href={"/category/" + posts["blog"].category.url}
                  className="blog-meta-item"
                >
                  {posts["blog"].category.name}
                </a>
                {" / "}
              </p>
            );
          }
        })()}
        <p className="blog-meta-item">
          {"By "}
          <a href={"/users/" + posts["blog"].posted_by.username}>
            {posts["blog"].posted_by.username}
          </a>
          {" / "}
        </p>
        <p className="blog-meta-item">
          {posts["blog"].updatedAt.substring(0, 10)}
        </p>
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
                <img
                  src={BACKEND_FILES_URL + content[i].content}
                  alt="blog-image"
                  className="blog-image"
                />
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
                <a href={content[i].content} target="_blank" rel="noopener noreferrer">
                  {content[i].content}
                </a>
              </div>
            );
          }
        }
        return contentDivs;
      })()}
      {(() => {
        if (series && seriesBlogs) {
          return (
            <div>
              <hr className="blog-divider"></hr>
      <h3>Series</h3>
              <h4>{series.name}</h4>
              <ul className="blogs-series-step-bar">
                {createSeriesBlogsStepBar(
                  seriesBlogs,
                  posts["blog"]._id
                )}
              </ul>
            </div>
          );
        }
      })()}
      <hr className="blog-divider"></hr>
      <div className="comments-container">
        <h3>Comments</h3>
        {(() => {
          if (comments != null) {
            const commentDivs = [];
            for (let i = 0; i < comments.length; i++) {
              commentDivs.push(
                <div key={comments[i]._id} className="comment-div">
                  <div className="comment-div-header">
                    <img
                      src={
                        comments[i].by_user.picture ||
                        require("../img/default-profile-pic.png")
                      }
                      alt="comment-user-pic"
                      className="comment-user-pic"
                    />
                    <div className="comment-user-info">
                      <a href={"/users/" + comments[i].by_user.username}>
                        {comments[i].by_user.username}
                      </a>
                      <div>
                        {comments[i].updatedAt.substring(0, 10)} {"/"}{" "}
                        {comments[i].updatedAt.substring(11, 16)}
                      </div>
                    </div>
                  </div>
                  <div className="comment-div-content">
                    <p>{comments[i].comment_text}</p>
                  </div>
                  <hr className="blog-divider"></hr>
                </div>
              );
            }
            return commentDivs;
          }
        })()}
        {(() => {
          if (loggedInUser != null) {
            return (
              <div>
                <ReactTextareaAutosize className="comment-textarea" />
                <button
                  className="comment-button"
                  placeholder="Comment"
                  onClick={() => {
                    apiService("comment/create/" + posts["blog"]._id, {
                      // blog_id: posts["blog"]._id,
                      comment_text:
                        document.getElementsByClassName("comment-textarea")[0]
                          .value,
                    }).then((response) => {
                      if (response.data.success) {
                        window.location.reload();
                      } else {
                        alert("Something went wrong");
                      }
                    });
                  }}
                >
                  Comment
                </button>
              </div>
            );
          } else {
            return <h3>You must be logged in to comment</h3>;
          }
        })()}
      </div>
    </div>
  );
}
