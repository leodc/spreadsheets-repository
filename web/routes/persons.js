var express = require("express");
var router = express.Router();

// index
router.get("/:name_slug", function (req, res) {
  res.render("person", {person_name: req.params.name_slug});
});

module.exports = router;
