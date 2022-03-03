var express = require("express");
var router = express.Router();
const passport = require("passport");
const CatModel = require("../model/Categories");
const mongoose = require("mongoose");
const SettingsModel = require("../model/Settings");
const {
  getCommission1,
  getCommission2,
  getCommission3,
  getLegal,
} = require("./utils");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("signIn");
});
/* GET home page. */
router.post(
  "/login",
  passport.authenticate("loginadmin", {
    failureRedirect: "/dashboard",
  }),
  function (req, res, next) {
    if (req.user) {
      console.log("login success");
      res.redirect("/dashboard/main");
    }
  }
);
const checkLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/dashboard/");
  }
};
router.get("/main", checkLogin, async function (req, res, next) {
  try {
    const cats = await CatModel.find();
    const comm1 = await getCommission1();
    const comm2 = await getCommission2();
    const comm3 = await getCommission3();
    const legal = await getLegal();
    res.render("main", {
      cats,
      layout: "dashboardLayout",
      comm1,
      comm2,
      comm3,
      legal,
    });
  } catch (e) {
    console.log(e);
    res.send("error");
  }
});

router.post("/addcategory", async function (req, res, next) {
  const newCat = await CatModel.create({ name: req.body.name });
  res.redirect("/dashboard/main");
});

router.post("/settings", async function (req, res, next) {
  const comm = await SettingsModel.findOne({});
  comm.commission1 = req.body.com1;
  comm.commission2 = req.body.com2;
  comm.commission3 = req.body.com3;
  await comm.save();
  res.redirect("/dashboard/main");
});
router.post("/legal", async function (req, res, next) {
  const comm = await SettingsModel.findOne({});
  comm.legal = req.body.legal;
  await comm.save();
  res.redirect("/dashboard/main");
});
router.get("/listCategory", async function (req, res, next) {
  res.render("main", cate);
});
router.delete("/category/:id", async function (req, res, next) {
  await CatModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) });
  res.send();
});
module.exports = router;
