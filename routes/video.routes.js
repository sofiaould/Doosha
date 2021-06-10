/** @format */

const express = require("express");
const router = express.Router();
const Video = require("../models/video.model");
const fileUploader = require("../configs/cloudinary.config");

/////////////////////////// video home ////////////////////////////////
router.get("/homevideos", (req, res, next) => {
  Video.find()
    .then((videos) => res.render("videos/videohome", { videos }))
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
      res.render("videos/videoform");
    });
});

////////////////////// video form ////////////////////////////
router.get("/formvideo", (req, res, next) => {
  if (!req.session.currentUser) {
    // alert("Log in or sign up)");
    res.redirect("/loginOrSignUp"); // ici proteger /la route video
  }
  res.render("videos/videoform", {
    userInSession: req.session.currentUser,
  });
});

////////////////////// video selected ////////////////////////////
router.get("/videos/:id", (req, res, next) => {
  Video.findOne({ _id: req.params.id })
    .then((video) => res.render("videos/videoselected", { video }))
    .catch((err) => next(err));
});

/////////////////////////////////////////////////////////////////////
///////////////////////EDIT UPDATE DELETE video///////////////////////////
////////////////////////////////////////////////////////////////////

router.get("/videos/:id/delete", (req, res, next) => {
  res.render("videos/delete");
});

router.post("/videos/:id/delete", (req, res, next) => {
  Video.findByIdAndRemove(req.params.id)
    .then((video) => res.redirect("/homevideos"))
    .catch((err) => next(err));
});

router.get("/videos/:id/edit", (req, res, next) => {
  Video.findOne({ _id: req.params.id })
    .then((video) => res.render("videos/edit", { video }))
    .catch((err) => next(err));
});

router.post("/videos/:id", (req, res, next) => {
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
