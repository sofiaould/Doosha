/** @format */

const express = require("express");
const router = express.Router();
const Article = require("../models/article.model");
const fileUploader = require("../configs/cloudinary.config");

/////////////////////////// article home ////////////////////////////////
router.get("/homearticles", (req, res, next) => {
  Article.find()
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
    .then((article) => res.render("articles/articleselected", { article }))
    .catch((err) => next(err));
});

module.exports = router;
