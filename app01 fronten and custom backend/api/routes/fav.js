const express = require("express");
const router = express.Router();
const { success_response, failed_response } = require("../response");
const debug = require("debug")("app01-api:fav");
const mongoose = require("mongoose");
const ShopModel = require("../model/Shop");
const ProductModel = require("../model/Product");

router.post("/", async function (req, res, next) {
  try {
    const { data } = req.body;
    let response = {
      shops: [],
      products: [],
    };
    for (let i = 0; i < data.length; i++) {
      let shop = await ShopModel.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(data[i]),
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
      ]);

      const product = await ProductModel.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(data[i]),
          },
        },
        {
          $lookup: {
            from: "shops",
            localField: "shop_id",
            foreignField: "_id",
            as: "shop",
          },
        },

        { $unwind: "$shop" },
        {
          $lookup: {
            from: "categories",
            localField: "shop.category_id",
            foreignField: "_id",
            as: "shop.category",
          },
        },
        { $unwind: "$shop.category" },
        {
          $lookup: {
            from: "product_categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category",
          },
        },

        { $unwind: "$category" },
      ]);
      if (shop.length !== 0) {
        response.shops.push(shop[0]);
      }
      if (product.length !== 0) {
        response.products.push(product[0]);
      }
    }
    debug(response);
    res.json(success_response({ data: response }));
  } catch (err) {
    debug(err);
    res.status(500).json(failed_response("Failed"));
  }
});
module.exports = router;
