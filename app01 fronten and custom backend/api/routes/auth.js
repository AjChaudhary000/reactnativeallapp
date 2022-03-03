const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const createError = require("http-errors");
const debug = require("debug")("app01-api: auth");
const success_response = (data) => ({
  status: true,
  ...data,
});
const failed_response = (message) => ({
  status: false,
  message,
});

router.post("/signup", async (req, res, next) => {
  passport.authenticate("signup", async (err, user, info) => {
    try {
      if (!user) {
        return res.status(400).json(failed_response(info.message));
      }
      const { country, phone, first_name, last_name, password } = req.body;
      user.country = country;
      user.phone = phone;
      user.first_name = first_name;
      user.last_name = last_name;
      user.password = password;
      await user.save();
      const body = { _id: user._id, email: user.email };
      const token = jwt.sign({ user: body }, "my_secret_key_app01");
      return res.json(success_response({ token }));
    } catch (error) {
      debug(error);
      return res.status(400).json(failed_response(error.message));
    }
  })(req, res, next);
});
router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      console.log(user);
      if (err || !user) {
        return res.status(400).json(failed_response(info.message));
      }
      const body = { _id: user._id, email: user.email };
      const token = jwt.sign({ user: body }, "my_secret_key_app01");
      let type = "normal";
      if (user.type === "ass") {
        type = "ass";
      }
      return res.json(success_response({ token, type }));
    } catch (error) {
      debug(error);
      return res.status(400).json(failed_response(error.message));
    }
  })(req, res, next);
});

module.exports = router;
