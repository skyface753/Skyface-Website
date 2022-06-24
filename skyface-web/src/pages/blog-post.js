import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import apiService from "../services/api-service";
import { BACKEND_FILES_URL, TITLESUFFIX } from "../consts";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../App";
import { IsLikedButton, NeutralLikeButton } from "../img/like";
import { MeetupLoader, SkyCloudLoader } from "../components/Loader";
import browserSignature from "browser-signature";
import { ViewIcon } from "../img/view";
import { UserSvg } from "../img/userSvg";

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

function speakMessage(messages, PAUSE_MS = 500, utterance) {
  try {
    window.speechSynthesis.cancel();
    let currentIndex = 0;
    console.log(messages);
    const speak = () => {
      const msg = messages[currentIndex].content;
      // const utterance = new SpeechSynthesisUtterance(msg);
      utterance.text = msg;
      utterance.onend = () => {
        currentIndex += 1;
        if (currentIndex < messages.length) {
          setTimeout(speak, PAUSE_MS);
        } else {
          window.speechSynthesis.cancel();
          removeOldMarker();
        }
      };
      utterance.onerror = () => {
        console.log("error");
      };
      utterance.onboundary = function (event) {
        console.log("SpeechSynthesisUtterance.onboundary");
        onboundaryHandler(event, messages[currentIndex]._id);
      };
      window.speechSynthesis.speak(utterance);
    };
    speak();
  } catch (e) {
    console.error(e);
  }
}
var oldTextToSpeackID = null;
var oldTextToSpeackHTML = null;
function removeOldMarker() {
  if (oldTextToSpeackID != null) {
    var pTag = document.getElementById(oldTextToSpeackID);
    pTag.innerHTML = oldTextToSpeackHTML;
    oldTextToSpeackID = null;
    oldTextToSpeackHTML = null;
  }
}

function onboundaryHandler(event, contentID) {
  removeOldMarker();
  var pTag = document.getElementById(contentID);
  var value = pTag.innerHTML;
  var index = event.charIndex;
  var word = getWordAt(value, index);
  var anchorPosition = getWordStart(value, index);
  var activePosition = anchorPosition + word.length;
  console.log(word, anchorPosition, activePosition);

  oldTextToSpeackID = contentID;
  oldTextToSpeackHTML = pTag.innerHTML;
  pTag.innerHTML =
    value.substring(0, anchorPosition) +
    "<span class='highlight' >" +
    word +
    "</span>" +
    value.substring(activePosition);
  pTag.scrollIntoView({ behavior: "smooth", block: "center" });

  // textarea.focus();

  // if (textarea.setSelectionRange) {
  //   textarea.setSelectionRange(anchorPosition, activePosition);
  // } else {
  //   var range = textarea.createTextRange();
  //   range.collapse(true);
  //   range.moveEnd("character", activePosition);
  //   range.moveStart("character", anchorPosition);
  //   range.select();
  // }
}
// Get the word of a string given the string and index
function getWordAt(str, pos) {
  // Perform type conversions.
  str = String(str);
  pos = Number(pos) >>> 0;

  // Search for the word's beginning and end.
  var left = str.slice(0, pos + 1).search(/\S+$/),
    right = str.slice(pos).search(/\s/);

  // The last word in the string is a special case.
  if (right < 0) {
    return str.slice(left);
  }

  // Return the word, using the located bounds to extract it from the string.
  return str.slice(left, right + pos);
}

// Get the position of the beginning of the word
function getWordStart(str, pos) {
  str = String(str);
  pos = Number(pos) >>> 0;

  // Search for the word's beginning
  var start = str.slice(0, pos + 1).search(/\S+$/);
  return start;
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
  const [blogViewsCount, setBlogViewsCount] = React.useState(0);
  const [blogViewsCountPerUser, setBlogViewsCountPerUser] = React.useState(0);
  const [speakText, setSpeakText] = React.useState([]);

  const signature = browserSignature();
  const speekToText = new SpeechSynthesisUtterance();
  speekToText.lang = "en-US";
  // React.useEffect(() => {
  //   console.log("Speeking");
  //   window.speechSynthesis.speak(msg);
  // }, [msg]);

  speekToText.onerror = function (event) {
    console.log("SpeechSynthesisUtterance.onerror");
  };

  React.useEffect(() => {
    apiService("blog/" + blogUrl, {
      signature,
    }).then((response) => {
      var blogContent = response.data["blogContent"];
      console.log(response.data);
      blogContent.sort(function (a, b) {
        return a.position - b.position;
      });
      setPost(response.data);
      setComments(commentsParentSort(response.data["blogComments"]));
      setHasLiked(response.data["hasUserLikedBlog"]);
      setBlogLikesCount(response.data["blogLikesCount"]);
      setBlogViewsCount(response.data["blogViewsCount"]);
      setBlogViewsCountPerUser(response.data["blogViewsCountPerUser"]);
      // var contentText = "";
      for (var i = 0; i < blogContent.length; i++) {
        if (blogContent[i].type === "text") {
          speakText.push(blogContent[i]);
          // contentText += blogContent[i].content + "\n";
        }
      }
      setSpeakText(speakText);
      if (response.data["series"]) {
        setSeries(response.data["series"]);
        setSeriesBlogs(response.data["seriesBlogs"]);
      }
      // });
    });
  }, []);

  if (!posts) return <SkyCloudLoader />;

  document.title = posts["blog"].title + " - " + TITLESUFFIX;

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
        <h1 className="title-container-text">{posts["blog"].title}</h1>
        <h2
          className="title-container-text"
          style={{
            marginBottom: "3%",
          }}
        >
          {posts["blog"].subtitle}
        </h2>
      </div>
      {posts["blog"].blog_image && (
        <div className="image-container">
          <img
            className="image-container-image"
            // src={require("../img/blogs-title.png")}
            src={BACKEND_FILES_URL + posts["blog"].blog_image}
            width="100%"
            alt="About-Title"
          />
        </div>
      )}

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
      <div className="blog-speak-container">
        <button
          className="speak-button"
          onClick={() => {
            // speekToText.text = speakText;
            if (window.speechSynthesis.paused) {
              window.speechSynthesis.resume();
              return;
            }
            speakMessage(speakText, null, speekToText);
            // speekToText.lang = "en-US";
            // var voices = speechSynthesis.getVoices();
            // speekToText.voice = voices[1];

            // window.speechSynthesis.speak(speekToText);
          }}
        >
          Speak
          {/* <img
          className="speak-button-icon"
          src={require("../img/speak-icon.png")}
          width="40px"
          alt="Speak-Icon"
        /> */}
        </button>
        <button
          className="speak-button-pause"
          onClick={() => {
            window.speechSynthesis.pause();
          }}
        >
          Pause
        </button>
        {(() => {
          var voices = speechSynthesis.getVoices();

          var voicesSelect = [];
          for (var i = 0; i < voices.length; i++) {
            voicesSelect.push(
              <option key={i} value={voices[i].name}>
                {voices[i].lang}
                {" - "}
                {voices[i].name}
              </option>
            );
          }
          if (voices.length < 1) {
            return;
          }
          return (
            <div className="speak-select-container">
              <select
                className="speak-select"
                // defaultValue={voices[5].name}
                onChange={(e) => {
                  speekToText.voice = speechSynthesis
                    .getVoices()
                    .find((voice) => voice.name === e.target.value);
                  speekToText.lang = speekToText.voice.lang;
                }}
              >
                {voicesSelect}
              </select>
            </div>
          );
        })()}
      </div>
      {/* Blog Posts */}
      {(() => {
        const contentDivs = [];
        var content = posts["blogContent"];
        for (let i = 0; i < content.length; i++) {
          if (content[i].type === "text") {
            contentDivs.push(
              <div key={content[i]._id} className="content-div">
                {/* <textarea className="content-text" id={content[i]._id}>
                  {content[i].content}
                </textarea> */}
                <p id={content[i]._id}>{content[i].content}</p>
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
          } else if (content[i].type == "download") {
            contentDivs.push(
              <div key={content[i]._id} className="content-download-div">
                {content[i].content}
                <form
                  method="GET"
                  target="_blank"
                  rel="noopener noreferrer"
                  action={BACKEND_FILES_URL + content[i].content}
                >
                  <button class="btn">
                    <i class="fa fa-download"></i> Download
                  </button>
                </form>
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
      <div className="blog-stats-container">
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
        <div>{blogLikesCount} </div>
        <ViewIcon />
        <div>{blogViewsCount}</div>
        <UserSvg />
        <div>{blogViewsCountPerUser}</div>
      </div>

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
