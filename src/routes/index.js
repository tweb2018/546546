// routes/index.js

const router = require("express").Router();
const mongooser = require("mongoose");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.json({ title: "BookBook Firbase auth" });
});

module.exports = router;
