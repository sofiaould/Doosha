/** @format */

const { Schema, model } = require("mongoose");
const articleSchema = new Schema(
  {
    // _id: {
    //   type: String,
    //   trim: true,
    //   required: [true, "Id is required."],
    //   unique: true,
    // },
    // user_id: {
    //   type: String,
    //   trim: true,
    //   required: [true, "UserId is required."],
    //   unique: true,
    // },
    title: {
      type: String,
      trim: true,
      required: [true, "title  is required."],
    },
    text: {
      type: String,
      trim: true,
      required: [true, "text is required."],
    },
    date: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Article", articleSchema);
