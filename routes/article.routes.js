/** @format */

const express = require("express");
const router = express.Router();
const Article = require("../models/article.model");
const fileUploader = require("../configs/cloudinary.config");

/////////////////////////// article home ////////////////////////////////
router.get("/homearticles", (req, res, next) => {
  Article.find()
    .populate("user")
    .then((articles) => res.render("articles/articlehome", { articles }))
    .catch((err) => next(err));
});

router.post("/homearticles", fileUploader.single("image"), (req, res, next) => {
  const user = req.session.currentUser._id;
  const title = req.body.title;
  const text = req.body.text;
  const date = req.body.date;
  const image = req.file.path;
  const article = new Article({
    user,
    title,
    text,
    date,
    image,
  });
  article
    .save()
    .then((article) => {
      res.redirect("/homearticles");
    })
    .catch((err) => {
      res.render("articles/articleform");
    });
});

////////////////////// article form ////////////////////////////
router.get("/formarticle", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/loginOrSignUp"); // ici proteger /la route article
  }
  res.render("articles/articleform", {
    userInSession: req.session.currentUser,
  });
});

////////////////////// article selected ////////////////////////////
router.get("/articles/:id", (req, res, next) => {
  Article.findOne({ _id: req.params.id })
    .populate("user")
    .then((article) => res.render("articles/articleselected", { article, user : req.session.user }))
    .catch((err) => next(err));
});

/////////////////////////////////////////////////////////////////////
///////////////////////EDIT UPDATE DELETE article///////////////////////////
////////////////////////////////////////////////////////////////////

router.get("/articles/:id/delete", (req, res, next) => {
  res.render("articles/delete");
});

router.post("/articles/:id/delete", (req, res, next) => {
  Article.findByIdAndRemove(req.params.id)
    .then((article) => res.redirect("/homearticles"))
    .catch((err) => next(err));
});

router.get("/articles/:id/edit", (req, res, next) => {
  Article.findOne({ _id: req.params.id })
    .then((article) => res.render("articles/edit", { article }))
    .catch((err) => next(err));
});

router.post("/articles/:id", (req, res, next) => {
  Article.update(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        text: req.body.text,
        image: req.file.path,
      },
    }
  )
    .then((article) => res.redirect("/homearticles"))
    .catch((err) => next(err));
});

module.exports = router;
