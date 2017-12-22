"use strict";

//==================
// home router
//==================

const Express = require("express");
const router = Express.Router();
const mongoose = require("mongoose");
const {User} = require("./../models");
const passport = require("passport");

//for making requests to apis
const request = require("request");
const fetch = require("node-fetch");

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

// ----------------------------------------
// DashBoard Home
// ----------------------------------------

//main view
router.get("/home", async (req, res, next) => {
  try {
    if (req.user) {
      //getting the user
      const email = req.user.email;
      const user = await User.findOne({email}, function(err, user) {
        return user;
      });

      //grabbing the list of coins
      const coinsList = await fetch("https://api.coinmarketcap.com/v1/ticker/")
        .then(function(res) {
          return res.json();
        })
        .then(function(json) {
          return json;
        });

      //grabbing the coins of the user
      const userCoins = coinsList.filter(coinObj => {
        return user.coinsSym.includes(coinObj.symbol);
      });

      //setting up the url for the news
      let coinNamesForURL = userCoins.map(obj => obj.name.toLowerCase());
      if (coinNamesForURL.length === 0) {
        coinNamesForURL = ["bitcoin"];
      } else {
        coinNamesForURL = coinNamesForURL.splice(0, 2);
      }

      let articles = await fetch(
        `https://newsapi.org/v2/everything?q=${coinNamesForURL.join(
          ","
        )}&domains=google.com,yahoo.com,wsj.com,nytimes.com&from=2017-12-01&to=2017-12-21&apiKey=76cba483de7544e48b095c1965cca39f`
      )
        .then(function(res) {
          return res.json();
        })
        .then(function(json) {
          return json.articles;
        });

      res.render("home", {
        articles: articles,
        coinsList: coinsList,
        userCoins: userCoins
      });
    } else {
      res.redirect("/login");
    }
  } catch (e) {
    console.log(e);
  }
});

//adding a new coin
router.post("/home/addcoin", async (req, res, next) => {
  try {
    //finding the user
    const email = req.user.email;
    const user = await User.findOne({email}, function(err, user) {
      return user;
    });

    //grabbing the list of coins
    const coinsList = await fetch("https://api.coinmarketcap.com/v1/ticker/")
      .then(function(res) {
        return res.json();
      })
      .then(function(json) {
        return json;
      });

    //making sure the coin hasn't been added and then adding it note: req.body.coin is a symbol like BTC
    if (!user.coinsSym.includes(req.body.coin)) {
      await user.coinsSym.push(req.body.coin);
      await user.save();
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  } catch (e) {
    console.log(e);
  }
});

//removing a coin
router.post("/home/removecoin", async (req, res, next) => {
  try {
    //finding the user
    const email = req.user.email;
    const user = await User.findOne({email}, function(err, user) {
      return user;
    });

    //making sure the coin hasn't been added and then adding it note: req.body.coin is a symbol like BTC
    user.coinsSym = await user.coinsSym.filter(string => {
      if (string === req.user.coin) {
        return false;
      }
      return true;
    });

    await user.save;
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
