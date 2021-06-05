/** @format */

const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/user.model");
const mongoose = require("mongoose");

/////////// protection + cloudinary ///////////////////////

const routeGuard = require("../configs/route-guard.config");
const fileUploader = require("../configs/cloudinary.config");

////////////////// get user profil////////////////////////
router.get("/userProfile", routeGuard, (req, res) => {
  res.render("users/userProfile",{user:req.session.currentUser});
});

////////////////////////////////////////////////////////////////////////
///////////////////////////// SIGNUP //////////////////////////////////
////////////////////////////////////////////////////////////////////////

// .get() route ==> to display the signup form to users
router.get("/signup", (req, res) => res.render("auth/signup"));

// .post() route ==> to process form data
router.post("/signup", fileUploader.single("image"), (req, res, next) => {
  const { username, firstname, name, email, password } = req.body;
  const imageURL = req.file.path;
  if (!username || !firstname || !name || !email || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, your first name, your name, email and password.",
    });
    return;
  }

  // make sure passwords are strong:
  // const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (!regex.test(password)) {
  //   res
  //     .status(500)
  //     .render("auth/signup", {
  //       errorMessage:
  //         "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
  //     });
  //   return;
  // }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        // username: username
        username,
        firstname,
        name,
        email,
        // passwordHash => this is the key from the User model
        //     ^
        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        passwordHash: hashedPassword,
        imageURL,
      });
    })
    .then((user) => {
      console.log("Newly created user is: ", user);
      req.session.currentUser = user;
      res.redirect("/userProfile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Either username or email is already used.",
        });
      } else {
        next(error);
      }
    });
});

////////////////////////////////////////////////////////////////////////
///////////////////////////// LOGIN ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// .get() route ==> to display the login form to users
router.get("/login", (req, res) => res.render("auth/login"));

//.post() login route ==> to process form data
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

////////////////////////////////////////////////////////////////////////
///////////////////////////// LOGOUT ////////////////////////////////////
////////////////////////////////////////////////////////////////////////
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

///////////////////////////////////////////////////////////////////////
////////////////////////// EDIT / DELETE/ UPDATE USER //////////////
////////////////////////////////////////////////////////////////

// router.post('/:id/delete', (req, res, next) => {
//   Celebrity.findByIdAndRemove(req.params.id)
//     .then(celebrity => res.redirect('/'))
//     .catch(err => next(err))
//   ;
// });
router.get("/users/edit", (req, res, next) => {
  User.findOne({ user: req.session.currentUser })
    .then((user) => res.render("users/edit", { user: req.session.currentUser }))
    .catch((err) => next(err));
});
// router.post("/users/edit", (req, res, next) => {
//   User.update(
//     { user: req.session.currentUser },
//     { $set: {        name: req.body.name,
//       firstname: req.body.firstname,
//       username: req.body.username,
//       email: req.body.email,
//       // password: req.body.password,
//       // imageURL: req.body.image,}
      

     
//     },
//   )
//     .then((user) => res.redirect("/"))
//     .catch((err) => next(err));
// });

router.post('/users/edit', (req, res, next) => {
  User.update({ user: req.session.currentUser }, { $set : {
    name: req.body.name,
    firstname: req.body.firstname,
    username: req.body.username,
    email: req.body.email,
    // passwordHash: user.passwordHash,
    // imageURL: user.imageURL,
  }
  },{ new: true })
    .then(user => res.redirect('/'))
    .catch(err => next(err))
  ;
});

module.exports = router;
