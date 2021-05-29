
const express = require('express');
const router  = express.Router();
const Article = require("../models/article.js");

/////////////////////////// article home ////////////////////////////////
router.get('/homearticles', (req, res, next) => {
  Article.find()
    .then(articles => res.render('articles/articlehome', {articles}))
    .catch(err => next(err))
  ;
});
router.post('/homearticles', (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;
  const date = req.body.date;
  const image = req.body.image;
  const article = new Article({
    title,
    text,
    date,
    image
  });
  article.save()
    .then(article => {
      res.redirect('/articles');
    })
    .catch(err => {
      res.render('articles/articleform');
    })
  ;
});

////////////////////// article form ////////////////////////////


router.get('/formarticle', (req, res, next) => {
  res.render('articles/articleform')
});


module.exports = router;
