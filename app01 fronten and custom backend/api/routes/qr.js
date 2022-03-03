var express = require("express");
var router = express.Router();
const OrderModel = require("../model/Order");
const ShopModel = require("../model/Shop");
const UserModel = require("../model/User");
const { success_response, failed_response } = require("../response");
const debug = require("debug")("app01-api:qr");
const QRCode = require("qrcode");

router.get("/", async (req, res) => {
  try {
    const qr = await QRCode.toDataURL(JSON.stringify({ userid: req.user._id }));
    debug("Qr generated. Sending to " + req.user._id);
    res.json(success_response({ data: qr }));
  } catch (err) {
    debug(err);
    res.json(failed_response("Failed"));
  }
});
module.exports = router;
