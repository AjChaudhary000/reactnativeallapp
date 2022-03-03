const express = require("express");
const router = express.Router();
const OrderModel = require("../model/Order");
const { success_response, failed_response } = require("../response");
const debug = require("debug")("app01-api:order");
const mongoose = require("mongoose");
router.post("/", async function (req, res, next) {
  try {
    await OrderModel.create({
      ...req.body,
      ordered_by: req.user._id,
    });
    res.json(success_response({ data: [] }));
  } catch (err) {
    debug(err);
    res.status(500).json(failed_response("Failed"));
  }
});
router.patch("/", async function (req, res, next) {
  try {
    await OrderModel.findByIdAndUpdate(req.body._id, {
      ...req.body,
    });
    res.json(success_response({ data: [] }));
  } catch (err) {
    debug(err);
    res.status(500).json(failed_response("Failed"));
  }
});
router.get("/", async function (req, res, next) {
  try {
    const orders = await OrderModel.find({
      ordered_by: mongoose.Types.ObjectId(req.user._id),
    });
    debug(orders);
    return res.json(success_response({ data: orders }));
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Failed"));
  }
});
router.get("/:id", async function (req, res, next) {
  try {
    debug(req.user._id);
    const orders = await OrderModel.aggregate([
      {
        $match: {
          shop_id: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "ordered_by",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]);
    return res.json(success_response({ data: orders }));
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Failed"));
  }
});
module.exports = router;
