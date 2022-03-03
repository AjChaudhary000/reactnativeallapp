var express = require("express");
var router = express.Router();
const UserModel = require("../model/User");
const { success_response, failed_response } = require("../response");
const debug = require("debug")("app01-api:user");
const crypto = require("crypto");
const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");

const image_path = "../img/upload/avatar/";

const fs2 = require("fs");
const AssistantModel = require("../model/Assistant");
if (!fs2.existsSync(path.join(__dirname, image_path))) {
  fs2.mkdirSync(path.join(__dirname, image_path), { recursive: true });
}
router.get("/", async function (req, res, next) {
  try {
    let userDetails = null;
    if (req.user.type === "ass") {
      const assData = await AssistantModel.findById(req.user.ass_id);
      userDetails = await UserModel.findById(req.user._id).select("-password");
      userDetails.first_name = assData.first_name;
      userDetails.last_name = assData.last_name;
      userDetails.avatar = assData.avatar;
    } else {
      userDetails = await UserModel.findById(req.user._id).select("-password");
    }
    res.json(success_response({ data: userDetails }));
  } catch (err) {
    debug(err);
    res.status(500).json(failed_response("Failed"));
  }
});
router.get("/:id", async function (req, res, next) {
  try {
    const userDetails = await UserModel.findById(req.params.id);
    res.json(success_response({ data: userDetails }));
  } catch (err) {
    debug(err);
    res.status(500).json(failed_response("Failed"));
  }
});
router.patch("/", async function (req, res, next) {
  try {
    if (req.body.image) {
      req.body.avatar = await saveImage(req.body.image);
    }
    await UserModel.findByIdAndUpdate(req.user._id, { ...req.body });
    const userDetails = await UserModel.findById(req.user._id);
    res.json(success_response({ data: userDetails }));
  } catch (err) {
    debug(err);
    res.status(500).json(failed_response("Failed"));
  }
});
router.patch("/changePassword", async function (req, res, next) {
  try {
    const user = await UserModel.findById(req.user._id);
    console.log(req.body);
    const validation = await user.isValidPassword(req.body.old_pass);
    if (validation && req.body.new_pass) {
      user.password = req.body.new_pass;
      await user.save();
      res.json(success_response({ message: "Success" }));
    } else {
      res.json(failed_response("Wrong Password"));
    }
  } catch (err) {
    debug(err);
    res.status(500).json(failed_response("Failed"));
  }
});

router.post("/reset/:uid", async function (req, res, next) {
  try {
    const user = await UserModel.findById(req.params.uid);
    user.password = req.body.password;
    await user.save();
    res.json(success_response({ message: "Success" }));
  } catch (err) {
    debug(err);
    res.status(500).json(failed_response("Failed"));
  }
});

const saveImage = async (imageBuffer) => {
  // Generate random string
  var seed = crypto.randomBytes(20);
  var uniqueSHA1String = crypto.createHash("sha1").update(seed).digest("hex");
  var userUploadedFeedMessagesLocation = path.join(__dirname, image_path);
  var imageTypeRegularExpression = /\/(.*?)$/;
  var uniqueRandomImageName = "user-" + uniqueSHA1String;
  var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);
  var filename = uniqueRandomImageName + "." + imageTypeDetected[1];
  var userUploadedImagePath = userUploadedFeedMessagesLocation + filename;

  await fs.writeFile(
    userUploadedImagePath,
    new Buffer(imageBuffer.base64, "base64")
  );
  console.log(
    "DEBUG - feed:message: Saved to disk image attached by user:",
    userUploadedImagePath
  );
  return filename;
};

module.exports = router;
