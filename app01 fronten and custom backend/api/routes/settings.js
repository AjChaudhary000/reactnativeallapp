const express = require("express");
const router = express.Router();
const SettingsModel = require("../model/Settings");
const { success_response, failed_response } = require("../response");
const debug = require("debug")("app01-api:settings");
const mongoose = require("mongoose");

router.get("/legal", async function (req, res, next) {
  try {
    const item = await SettingsModel.find({});
    if (item.length === 0) {
      return res.json(success_response({ html: "<div></div>" }));
    }
    return res.json(success_response({ html: item[0].legal }));
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Failed"));
  }
});

module.exports = router;
