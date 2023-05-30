const bcryptjs = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split("=")[1];
  const isLoggedIn = req.session.isLoggedIn;
  const messageArray = req.flash("error");
  let message;
  if (messageArray.length > 0) {
    message = messageArray[0];
  } else {
    message = null;
  }
  console.log(message);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Wrong email");
        return res.redirect("/login");
      }
      bcryptjs
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return res.redirect("/");
          }
          req.flash("error", "Wrong password");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          return res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getSignUp = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  const messageArray = req.flash("error");
  let message;
  if (messageArray.length > 0) {
    message = messageArray[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign Up",
    isAuthenticated: isLoggedIn,
    errorMessage: message,
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash(
          "error",
          "Email is already sign up. Please pick onother one!"
        );
        return res.redirect("/signup");
      }
      return bcryptjs
        .hash(password, 12)
        .then((password) => {
          const newUser = new User({
            email,
            name,
            password,
            cart: { items: [] },
          });
          newUser.save();
        })
        .then(() => {
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};
