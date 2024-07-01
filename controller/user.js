const User = require("../models/user");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");


async function handleSignup(req, res) {
  const { fullName, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user)
    return res
      .status(409)
      .send({ message: "User with given email already Exist!" });
  user = await new User({ ...req.body }).save();
  const token = await new Token({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  }).save();
  const url = `${process.env.BASE_URL}user/${user.id}/verify/${token.token}`;
  await sendEmail(user.email, "Verify Email", url);
  res
    .status(201)
    .send({ message: "An Email sent to your account please verify" });
}


async function handlesignin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  try {
    const token = await User.matchPasswordAndGenrateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
}


async function handleVerifyEmail(req, res) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });
    await User.updateOne({ _id: user._id, verified: true });
    await Token.deleteOne({ _id: token._id });
    return res.render('emailVerify', { success: true });
  } catch (error) {
    res.render('emailVerify', { success: false });
  }
}


function handleLogout(req, res) {
  res.clearCookie("token").redirect("/");
}


module.exports = {
  handleSignup,
  handlesignin,
  handleLogout,
  handleVerifyEmail,
};
