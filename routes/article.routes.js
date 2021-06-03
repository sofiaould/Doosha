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
  const title = req.body.title;
  const text = req.body.text;
  const date = req.body.date;
  const image = req.file.path;
  const article = new Article({
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
  res.render("articles/articleform");
});

// // .get() route ==> to display the article form to users
// router.get("/formarticle", (req, res) => res.render("articles/articleform"));

// // .post() route ==> to process form data
// router.post("/formarticle", fileUploader.single("image"), (req, res, next) => {
//   const { title, text, date } = req.body;
//   const image = req.file.path;
//   if (!title || !text || !date) {
//     res.render("articles/articleform", {
//       errorMessage:
//         "All fields are mandatory. Please provide your title, your text, date.",
//     });
//     return;
//   }
// });

////////////////////// article selected ////////////////////////////
// router.get('/:id', (req, res, next) => {
//   Article.findOne({_id: req.params.id})
//     .then(article => res.render('articles/articleselected', {article}))
//     .catch(err => next(err));
// });

module.exports = router;
