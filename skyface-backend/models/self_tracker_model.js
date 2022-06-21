const mongooose = require("mongoose");
const Schema = mongooose.Schema;

let SelfTrackerSchema = new Schema(
  {
    HOST: {
      type: String,
      required: true,
    },
    PATH: {
      type: String,
      required: true,
    },
    URL: {
      type: String,
      required: true,
    },
    SIGNATURE: {
      type: String,
      required: true,
    },
    stateUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    cookieUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongooose.model("SelfTracker", SelfTrackerSchema);
