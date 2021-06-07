/** @format */

const express = require("express");
const router = express.Router();
const Video = require("../models/video.model");
const fileUploader = require("../configs/cloudinary.config");

/////////////////////////// video home ////////////////////////////////
router.get("/homevideos", (req, res, next) => {
  Video.find()
    .then((videos) => res.render("videosfile/videohome", { videos }))
    .catch((err) => next(err));
});

router.post("/homevideos", fileUploader.single("image"), (req, res, next) => {
  const user = req.session.currentUser._id;
  const title = req.body.title;
  const text = req.body.text;
  const date = req.body.date;
  const image = req.file.path;
  const video = req.body.video.slice(-11);
  const videoSecondary = new Video({
    user,
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
    // alert("Log in or sign up)");
    res.redirect("/loginOrSignUp"); // ici proteger /la route video
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

/////////////////////////////////////////////////////////////////////
///////////////////////EDIT UPDATE DELETE video///////////////////////////
////////////////////////////////////////////////////////////////////

router.get("/videosfile/:id/delete", (req, res, next) => {
  res.render("videosFile/delete");
});

router.post("/videosfile/:id/delete", (req, res, next) => {
  Video.findByIdAndRemove(req.params.id)
    .then((video) => res.redirect("/homevideos"))
    .catch((err) => next(err));
});

router.get("/videosfile/:id/edit", (req, res, next) => {
  Video.findOne({ _id: req.params.id })
    .then((video) => res.render("videosfile/edit", { video }))
    .catch((err) => next(err));
});

router.post("/videosfile/:id", (req, res, next) => {
  Video.update(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        text: req.body.text,
        video: req.body.video,
        image: req.file.path,
      },
    }
  )
    .then((video) => res.redirect("/homevideos"))
    .catch((err) => next(err));
});

module.exports = router;
