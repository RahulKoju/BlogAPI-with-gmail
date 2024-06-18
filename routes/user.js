const { Router } = require("express");
const { handleSignup, handlesignin, handleLogout } = require("../controller/user");
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


module.exports = router;