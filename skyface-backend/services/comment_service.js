const CommentModel = require("../models/comment_model");
const UserModel = require("../models/user_model");

let CommentService = {
  createComment: async (req, res) => {
    var user = req.user;
    let comment = new CommentModel({
      by_user: user._id,
      for_blog: req.params.blogID,
      comment_text: req.body.comment_text,
      reply_to: req.body.reply_to,
    });
    await comment.save();
    res.json({
      success: true,
      message: "Comment created",
      comment: comment,
    });
  },
};

module.exports = CommentService;
