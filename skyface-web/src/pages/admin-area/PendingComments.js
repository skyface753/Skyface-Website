import React from "react";
import apiService from "../../services/api-service";
import { useState } from "react";
import { SkyCloudLoader } from "../../components/Loader";
import "../../styles/pending_comments.css";
export default function PendingComments() {
  const [pendingComments, setPendingComments] = useState(null);
  React.useEffect(() => {
    apiService("admin/comments/pending").then((response) => {
      if (response.data.success) {
        setPendingComments(response.data.comments);
      }
    });
  }, []);

  if (!pendingComments) return <SkyCloudLoader />;
  console.log(pendingComments);
  /* comment.by_user.username
  comment.by_user.picture
  comment.for_blog.title
  comment.comment_text
  comment.reply_to
  */
  return (
    <div>
      <button
        onClick={() => {
          apiService("admin/comments/all/approve").then((response) => {
            if (response.data.success) {
              setPendingComments(response.data.remainingComments);
            }
          });
        }}
      >
        Approve All
      </button>
      <button
        onClick={() => {
          if (
            window.confirm(
              "Are you sure you want to delete all PENDING comments?"
            )
          ) {
            apiService("admin/comments/all/delete").then((response) => {
              if (response.data.success) {
                setPendingComments(response.data.remainingComments);
              }
            });
          }
        }}
      >
        Delete All
      </button>

      <table className="pending-comments-table">
        <thead>
          <tr>
            <th>User</th>
            {/* <th>Picture</th> */}
            <th>Blog</th>
            <th>Comment</th>
            <th>Reply To</th>
            <th>Action</th>
          </tr>
        </thead>
        {pendingComments.length === 0 ? (
          <tr>
            <td colSpan="5">No pending comments</td>
          </tr>
        ) : (
          <tbody>
            {pendingComments.map((comment) => (
              <PendingCommentItem
                comment={comment}
                setPendingComments={setPendingComments}
              />
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}

const PendingCommentItem = ({ comment, setPendingComments }) => {
  return (
    <tr key={comment._id}>
      <td className="pending-comment-user">
        <img
          src={comment.by_user.picture}
          alt="user"
          className="pending-comment-user-picture"
        />

        {comment.by_user.username}
      </td>
      <td>{comment.for_blog.title}</td>
      <td>{comment.comment_text}</td>
      <td>{comment.reply_to}</td>
      <td>
        <button
          className="pending-comment-approve"
          onClick={() => {
            console.log(comment);
            apiService("admin/comments/approve/" + comment._id).then(
              (response) => {
                if (response.data.success) {
                  setPendingComments(response.data.remainingComments);
                } else {
                  alert(response.data.message);
                }
              }
            );
          }}
        >
          Approve
        </button>
        <button
          className="pending-comment-delete"
          onClick={() => {
            if (
              window.confirm("Are you sure you want to delete this comment?")
            ) {
              apiService("admin/comments/delete/" + comment._id).then(
                (response) => {
                  if (response.data.success) {
                    setPendingComments(response.data.remainingComments);
                  } else {
                    alert(response.data.message);
                  }
                }
              );
            }
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};
