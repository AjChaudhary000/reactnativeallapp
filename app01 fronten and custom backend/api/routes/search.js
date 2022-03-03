const express = require("express");
const router = express.Router();
const ProductModel = require("../model/Product");
const ShopModel = require("../model/Shop");
const { success_response, failed_response } = require("../response");
const debug = require("debug")("app01-api:search");
const mongoose = require("mongoose");

router.get("/:term", async function (req, res, next) {
  try {
    const products = await ProductModel.find({
      product_name: { $regex: req.params.term },
    });
    const shops = await ShopModel.find({
      shop_name: { $regex: req.params.term },
    });
    return res.json(success_response({ data: { products, shops } }));
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Failed"));
  }
});

module.exports = router;
