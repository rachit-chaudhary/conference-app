const router = require("express").Router();

router.get("/login", (req, res) => {
  res.render("home-guest");
});

router.get("/onboarding", (req, res) => {
  res.render("onboarding");
});

router.get("/", (req, res) => {
  res.render("home");
});

module.exports = router;