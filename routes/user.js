const { Router } = require("express");
const { handleSignup, handlesignin, handleLogout, handleVerifyEmail } = require("../controller/user");
const router = Router();

router.get("/signin",(req,res)=>{
    res.render("signin");
});
router.get("/signup",(req,res)=>{
    res.render("signup");
});
router.get("/logout",handleLogout);
router.post("/signup",handleSignup);
router.post("/signin",handlesignin);
router.get("/:id/verify/:token/",handleVerifyEmail);

module.exports = router;