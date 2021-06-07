/** @format */

const { Schema, model } = require("mongoose");
const articleSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId, // recuperer id du user qui poste video
      ref: "User",
    },
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
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Article", articleSchema);
