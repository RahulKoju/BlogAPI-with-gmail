const User = require("../models/user");

async function handleSignup(req, res) {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
}
async function handlesignin(req, res) {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenrateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
}
function handleLogout(req,res){
  res.clearCookie("token").redirect("/");
}
module.exports = {
  handleSignup,
  handlesignin,
  handleLogout
};
