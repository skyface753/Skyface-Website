const CommentModel = require("../models/comment_model");
const UserModel = require("../models/user_model");
const MailService = require("./mail_service");

let CommentService = {
  createComment: async (req, res) => {
    var user = req.user;
    var userFromDb = await UserModel.findById(user._id);
    let comment = new CommentModel({
      by_user: user._id,
      for_blog: req.params.blogID,
      comment_text: req.body.comment_text,
      reply_to: req.body.reply_to,
      approved: userFromDb.role === "admin" ? true : false,
    });
    await comment.save();
    res.json({
      success: true,
      message: "Comment created",
      comment: comment,
    });
    if (userFromDb.role !== "admin") {
      await MailService.sendMail(
        req,
        "New comment",
        `A new comment has been posted by ${userFromDb.username}`
      );
    }
  },
  getPendingComments: async (req, res) => {
    let comments = await getPendingComments();
    res.json({
      success: true,
      comments: comments,
    });
  },
  approveComment: async (req, res) => {
    let commentID = req.params.commentID;
    if (!commentID) {
      res.json({
        success: false,
        message: "No comment ID provided",
      });
      return;
    }

    let comment = await CommentModel.findById(commentID);
    if (!comment) {
      res.json({
        success: false,
        message: "Comment not found",
      });
      return;
    }

    comment.approved = true;
    await comment.save();
    let remainingComments = await getPendingComments();

    res.json({
      success: true,
      message: "Comment approved",
      remainingComments: remainingComments,
    });
  },
  deleteComment: async (req, res) => {
    let commentID = req.params.commentID;
    if (!commentID) {
      res.json({
        success: false,
        message: "No comment ID provided",
      });
      return;
    }
    await CommentModel.deleteOne({ _id: commentID });
    let remainingComments = await getPendingComments();

    res.json({
      success: true,
      message: "Comment deleted",
      remainingComments: remainingComments,
    });
  },

  deleteAllCommentsPending: async (req, res) => {
    let pendingComments = await getPendingComments();
    for (let comment of pendingComments) {
      await CommentModel.deleteOne({ _id: comment._id });
    }
    let remainingComments = await getPendingComments();
    res.json({
      success: true,
      message: "All comments deleted",
      remainingComments: remainingComments,
    });
  },
  approveAllCommentsPending: async (req, res) => {
    let pendingComments = await getPendingComments();
    for (let comment of pendingComments) {
      comment.approved = true;
      await comment.save();
    }
    let remainingComments = await getPendingComments();
    res.json({
      success: true,
      message: "All comments approved",
      remainingComments: remainingComments,
    });
  },
};

module.exports = CommentService;

async function getPendingComments() {
  let comments = await CommentModel.find({
    approved: { $in: [false, null] },
  }).populate("for_blog by_user");
  return comments;
}
