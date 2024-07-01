const { Router } = require("express");
const {
  sendPasswordLink,
  verifyPassReset,
  setNewPass,
} = require("../controller/passReset");
const router = Router();

router.post("/", sendPasswordLink);
router.get("/:id/:token", verifyPassReset);
router.post("/:id/:token", setNewPass);
router.get("/", (req, res) => {
  res.render("forgotPassword", { url: null, error: null, msg: null });
});

module.exports = router;
