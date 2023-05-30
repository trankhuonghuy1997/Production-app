const express = require("express");

const authControllers = require("../controllers/auth");

const router = express.Router();

router.get("/login", authControllers.getLogin);

router.post("/login", authControllers.postLogin);

router.get("/signup", authControllers.getSignUp);

router.post("/signup", authControllers.postSignUp);

router.post("/logout", authControllers.postLogout);

module.exports = router;
