const User = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcryptjs");

async function sendPasswordLink(req, res) {
  try {
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label("Email"),
    });
    const { error } = emailSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(409)
        .send({ message: "User with given email does not exist!" });
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
    const url = `${process.env.BASE_URL}password-reset/${user._id}/${token.token}/`;
    await sendEmail(user.email, "password reset", url);
    res
      .status(200)
      .send({ message: "Password reset link sent to your email account" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
}

async function verifyPassReset(req, res) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    if (user) {
        res.render("passwordReset", { validUrl: true, url: `/password-reset/${req.params.id}/${req.params.token}`, error: null, msg: null });
    } else {
        res.render("passwordReset", { validUrl: false, url: null, error: null, msg: null });
    }
  } catch (error) {
    console.log(error)
    res.render("passwordReset", { validUrl: false, url: null, error: "Internal Server Error", msg: null });
  }
}

async function setNewPass(req, res) {
  try {
    const passwordSchema = Joi.object({
      password: passwordComplexity().required().label("Password"),
    });
    const { error } = passwordSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    if (!user.verified) user.verified = true;

    user.password = req.body.password;
    await user.save();
    await token.deleteOne({ _id: token._id });

    if (user) {
        res.send({ msg: "Password reset successfully" });
    } else {
        res.render("passwordReset", { validUrl: true, url: `/password-reset/${id}/${token}`, error: "Invalid link", msg: null });
    }
  } catch (error) {
    res.render("passwordReset", { validUrl: true, url: `/password-reset/${id}/${token}`, error: "Internal Server Error", msg: null });
  }
}

module.exports = {
  sendPasswordLink,
  verifyPassReset,
  setNewPass
};
