/** @format */

const { Schema, model } = require("mongoose");
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required."],
      unique: true,
    },
    firstname: {
      type: String,
      trim: true,
      required: [true, "Firstname  is required."],
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required."],
    },
    imageURL: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
