const express = require("express");
const router = express.Router();
const CatModel = require("../model/ProductCategories");
const { success_response } = require("../response");
const mongoose = require("mongoose");
router.get("/", async function (req, res, next) {
  const cats = await CatModel.find({
    created_by: mongoose.Types.ObjectId(req.user._id),
    shop_id: mongoose.Types.ObjectId(req.query.shop_id),
  }).sort({ index: 1 });
  res.json(success_response({ categories: cats }));
});
router.get("/:shopid", async function (req, res, next) {
  const cats = await CatModel.find({
    shop_id: mongoose.Types.ObjectId(req.params.shopid),
  });
  res.json(success_response({ data: cats }));
});

router.post("/order", async function (req, res, next) {
  try {
    const { list } = req.body;
    for (let i = 0; i < list.length; i++) {
      const cat = await CatModel.findById(list[i]);
      cat.index = i;
      await cat.save();
    }
    return res.json(success_response({}));
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Failed"));
  }
});
router.post("/", async function (req, res, next) {
  try {
    await CatModel.create({
      name: req.body.name,
      created_by: mongoose.Types.ObjectId(req.user._id),
      shop_id: mongoose.Types.ObjectId(req.body.shop_id),
    });
    const cats = await CatModel.find({
      shop_id: mongoose.Types.ObjectId(req.body.shop_id),
    });
    res.json(success_response({ categories: cats }));
  } catch (e) {
    res.status(500).json({ message: "An error occured!" });
  }
});
router.delete("/", async function (req, res, next) {
  try {
    await CatModel.findByIdAndDelete(req.body._id);
    const cats = await CatModel.find({
      created_by: mongoose.Types.ObjectId(req.user._id),
    });
    res.json(success_response({ categories: cats }));
  } catch (e) {
    res.status(500).json({ message: "An error occured!" });
  }
});
router.patch("/", async function (req, res, next) {
  try {
    await CatModel.findByIdAndUpdate(req.body._id, { name: req.body.name });
    const cats = await CatModel.find({
      created_by: mongoose.Types.ObjectId(req.user._id),
    });
    res.json(success_response({ categories: cats }));
  } catch (e) {
    res.status(500).json({ message: "An error occured!" });
  }
});
module.exports = router;
