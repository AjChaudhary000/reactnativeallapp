const express = require("express");
const router = express.Router();
const debug = require("debug")("app01-api:images");
const path = require("path");

router.get("/:name/:id", function (req, res, next) {
  try {
    const p = path.join(
      __dirname,
      `../img/upload/${req.params.name}/${req.params.id}`
    );
    res.sendFile(p);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

module.exports = router;
