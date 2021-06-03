/** @format */

const express = require("express");
const router = express.Router();
const Video = require("../models/video.model");
const fileUploader = require("../configs/cloudinary.config");

/////////////////////////// article home ////////////////////////////////
router.get("/homevideos", (req, res, next) => {
  Video.find()
    .then((videos) => res.render("videosfile/videohome", { videos }))
    .catch((err) => next(err));
});

router.post("/homevideos", fileUploader.single("image"), (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;
  const date = req.body.date;
  const image = req.file.path;
  const video = req.body.video;
  const videoSecondary = new Video({
    title,
    text,
    video,
    date,
    image,
  });
  videoSecondary
    .save()
    .then((videoSecondary) => {
      res.redirect("/homevideos");
    })
    .catch((err) => {
      res.render("videosfile/videoform");
    });
});

////////////////////// video form ////////////////////////////
router.get("/formvideo", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/signup"); // ici proteger /la route video
  }
  res.render("videosfile/videoform", {
    userInSession: req.session.currentUser,
  });
});

////////////////////// video selected ////////////////////////////
router.get("/videosfile/:id", (req, res, next) => {
  Video.findOne({ _id: req.params.id })
    .then((video) => res.render("videosfile/videoselected", { video }))
    .catch((err) => next(err));
});

module.exports = router;
