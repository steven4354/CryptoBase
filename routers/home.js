"use strict";

//==================
// home router
//==================

const Express = require("express");
const router = Express.Router();
const mongoose = require("mongoose");
const {User} = require("./../models");
const passport = require("passport");

// 1
router.get("/", (req, res) => {
  if (req.user) {
    res.redirect("/home");
  } else {
    res.redirect("/login");
  }
});

// 2
router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register", {
    hidden: "hidden"
  });
});

// 3
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

// 4

router.post("/register", (req, res, next) => {
  const {email, password} = req.body;

  const user = new User({email, password});
  user.save((err, user) => {
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  });
});

// 5
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

//Dashboard Home
router.get("/home", function(req, res) {
  if (req.user) {
    res.render("home");
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
