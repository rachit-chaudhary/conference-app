const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("home-guest");
});

router.get("/onboarding", (req, res) => {
  res.render("onboarding");
});

module.exports = router;