const express = require("express");
const router = express.Router();
const CatModel = require("../model/Categories");
const { success_response } = require("../response");
router.get("/", async function (req, res, next) {
  const cats = await CatModel.find();
  res.json(success_response({ categories: cats }));
});

router.post("/", async function (req, res, next) {
  await CatModel.create({ name: req.body.name });
  const cats = await CatModel.find();
  res.json(success_response({ categories: cats }));
});

module.exports = router;
