import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import apiService from "../services/api-service";
import { BACKEND_FILES_URL, TITLEPREFIX } from "../consts";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../App";
import { IsLikedButton, NeutralLikeButton } from "../img/like";
import { MeetupLoader, SkyCloudLoader } from "../components/Loader";
// import SeriesBlogsComp from "../components/SeriesBlogsComp";
// import SidebarSeries from "../components/SidebarSeries";

const copyButtonLabel = "Copy Code";

function copyCode(code) {
  navigator.clipboard.writeText(code);
}

function gotoBlockFromSeries(seriesBlogUrl) {
  window.location.href = seriesBlogUrl;
  // window.location.href = seriesBlogUrl;
}

function focusCommentTextBox() {
  document.getElementById("comment-text-box").focus();
}

function commentsParentSort(fullList) {
  var sortedComments = [];
  for (var i = 0; i < fullList.length; i++) {
    if (fullList[i].reply_to == null) {
      var childs = getCommetsChilds(fullList[i]._id, fullList);
      if (childs) {
        fullList[i].children = childs;
      }
      sortedComments.push(fullList[i]);
    }
  }
  return sortedComments;
}

function getCommetsChilds(currItemId, fullList) {
  var returnList = [];
  for (var i = 0; i < fullList.length; i++) {
    if (fullList[i].reply_to === currItemId) {
      var childs = getCommetsChilds(fullList[i]._id, fullList);
      if (childs) {
        fullList[i].children = childs;
      }
      returnList.push(fullList[i]);
    }
  }
  if (returnList.length === 0) return null;
  return returnList;
}

function createSeriesBlogStepBarItem(id, url, active = false, pos, title) {
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

function getCommentAnswerButton(commentID, by_username, setCommentAnswer) {
  return (
    <button
      className="comment-answer-button"
      onClick={() => {
        console.log("setCommentAnswer", commentID);
        setCommentAnswer(commentID);
        focusCommentTextBox();
      }}
    >
      Answer to {by_username}
    </button>
  );
}

var commentsMarginValue = 30;
function commentsToHTML(
  currList,
  childMargin = commentsMarginValue,
  state,
  setCommentAnswer
) {
  var returnHTML = [];
  if (currList == null) return returnHTML;
  for (var i = 0; i < currList.length; i++) {
    var currMargin = childMargin + "px";
    returnHTML.push(
      <div
        key={currList[i]._id}
        className="comment-div"
        style={{ marginLeft: currMargin }}
      >
        <div className="comment-div-header">
          <img
            src={
              currList[i].by_user.picture ||
              require("../img/default-profile-pic.png")
            }
            alt="comment-user-pic"
            className="comment-user-pic"
          />
          <div className="comment-user-info">
            <a href={"/users/" + currList[i].by_user.username}>
              {currList[i].by_user.username}
            </a>
            <div>
              {currList[i].updatedAt.substring(0, 10)} {"/"}{" "}
              {currList[i].updatedAt.substring(11, 16)}
            </div>
          </div>
        </div>
        {state.isLoggedIn
          ? getCommentAnswerButton(
              currList[i]._id,
              currList[i].by_user.username,
              setCommentAnswer
            )
          : null}
        <div className="comment-div-content">
          <p>{currList[i].comment_text}</p>
        </div>
        <hr className="blog-divider"></hr>
        {commentsToHTML(
          currList[i].children,
          childMargin + commentsMarginValue,
          state,
          setCommentAnswer
        )}
      </div>
    );
  }
  return returnHTML;
}

export default function BlogPost() {
  const { state, dispatch } = useContext(AuthContext);
  let { blogUrl } = useParams();
  const location = useLocation();
  const [posts, setPost] = React.useState(null);
  const [comments, setComments] = React.useState(null);
  const [series, setSeries] = React.useState(null);
  const [seriesBlogs, setSeriesBlogs] = React.useState(null);
  const [commentAnswer, setCommentAnswer] = React.useState(null);
  const [hasLiked, setHasLiked] = React.useState(false);
  const [blogLikesCount, setBlogLikesCount] = React.useState(0);

  React.useEffect(() => {
    apiService("blog/" + blogUrl, {}).then((response) => {
      var blogContent = response.data["blogContent"];
      console.log(response.data);
      blogContent.sort(function (a, b) {
        return a.position - b.position;
      });
      setPost(response.data);
      setComments(commentsParentSort(response.data["blogComments"]));
      setHasLiked(response.data["hasUserLikedBlog"]);
      setBlogLikesCount(response.data["blogLikesCount"]);
      if (response.data["series"]) {
        setSeries(response.data["series"]);
        setSeriesBlogs(response.data["seriesBlogs"]);
      }
      // });
    });
  }, []);

  if (!posts) return <SkyCloudLoader />;

  document.title = TITLEPREFIX + posts["blog"].title;

  console.log(commentsParentSort(posts["blogComments"]));
  return (
    <div>
      {(() => {
        if (state.isLoggedIn) {
          if (state.user.role === "admin") {
            return (
              <div className="admin-edit-container" key="admin-edit-container">
                <div
                  className="admin-edit-button"
                  onClick={() => {
                    window.location.href = "/admin/edit-blog/" + blogUrl;
                  }}
                >
                  <img
                    className="admin-edit-button-icon"
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
          // src={require("../img/blogs-title.png")}
          src={BACKEND_FILES_URL + posts["blog"].blog_image}
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
                <a
                  href={content[i].content}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                {createSeriesBlogsStepBar(seriesBlogs, posts["blog"]._id)}
              </ul>
            </div>
          );
        }
      })()}
      <hr className="blog-divider"></hr>
      {state.isLoggedIn ? (
        hasLiked ? (
          <button
            className="unlike-button"
            onClick={() =>
              apiService("blog-likes/unlike/" + posts["blog"]._id, {}).then(
                (response) => {
                  if (response.data.success) {
                    setHasLiked(false);
                    setBlogLikesCount(blogLikesCount - 1);
                  }
                }
              )
            }
          >
            <IsLikedButton />
          </button>
        ) : (
          <button
            className="like-button"
            onClick={() =>
              apiService("blog-likes/like/" + posts["blog"]._id).then(
                (response) => {
                  if (response.data.success) {
                    setHasLiked(true);
                    setBlogLikesCount(blogLikesCount + 1);
                  }
                }
              )
            }
          >
            <NeutralLikeButton />
          </button>
        )
      ) : (
        // Redirect to login page
        <button
          className="like-button"
          onClick={() =>
            (window.location.href =
              "/login?redirect=" + window.location.pathname)
          }
        >
          <NeutralLikeButton />
        </button>
      )}
      <p>{blogLikesCount} likes</p>
      <hr className="blog-divider"></hr>
      <div className="comments-container">
        <h3>Comments</h3>
        {(() => {
          if (comments != null) {
            return comments.map((comment) => {
              return (
                <div key={comment._id} className="comment-div">
                  <div className="comment-div-header">
                    <img
                      src={
                        comment.by_user.picture ||
                        require("../img/default-profile-pic.png")
                      }
                      alt="comment-user-pic"
                      className="comment-user-pic"
                    />
                    <div className="comment-user-info">
                      <a href={"/users/" + comment.by_user.username}>
                        {comment.by_user.username}
                      </a>
                      <div>
                        {comment.updatedAt.substring(0, 10)} {"/"}{" "}
                        {comment.updatedAt.substring(11, 16)}
                      </div>
                    </div>
                  </div>
                  {state.isLoggedIn ? (
                    <button
                      className="comment-answer-button"
                      onClick={() => {
                        setCommentAnswer(comment._id);
                        focusCommentTextBox();
                      }}
                    >
                      Answer to {comment.by_user.username}
                    </button>
                  ) : null}
                  <div className="comment-div-content">
                    <p>{comment.comment_text}</p>
                  </div>
                  <hr className="blog-divider"></hr>
                  {(() => {
                    if (comment.children) {
                      return (
                        <div>
                          {commentsToHTML(
                            comment.children,
                            commentsMarginValue,
                            state,
                            setCommentAnswer
                          )}
                        </div>
                      );
                    }
                  })()}
                </div>
              );
            });
          }
        })()}
        {commentAnswer != null ? (
          <div>
            <p>Answer to {commentAnswer}</p>
            <button
              onClick={() => {
                setCommentAnswer(null);
              }}
            >
              Cancel
            </button>
          </div>
        ) : null}
        {(() => {
          if (state.isLoggedIn) {
            return (
              <div>
                <ReactTextareaAutosize
                  className="comment-textarea"
                  id="comment-text-box"
                />
                <button
                  className="comment-button"
                  placeholder="Comment"
                  onClick={() => {
                    apiService("comment/create/" + posts["blog"]._id, {
                      // blog_id: posts["blog"]._id,
                      comment_text:
                        document.getElementsByClassName("comment-textarea")[0]
                          .value,
                      reply_to: commentAnswer ? commentAnswer : null,
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
