const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const createError = require("http-errors");
const debug = require("debug")("app01-api: assistant");
const { success_response, failed_response } = require("../response");
const AssistantModel = require("../model/Assistant");
const mongoose = require("mongoose");
const crypto = require("crypto");
const fs = require("fs").promises;
const path = require("path");
const image_path = "../img/upload/avatar/";

const fs2 = require("fs");
if (!fs2.existsSync(path.join(__dirname, image_path))) {
  fs2.mkdirSync(path.join(__dirname, image_path), { recursive: true });
}
router.post("/", async (req, res, next) => {
  const { email, password, first_name, last_name, shop_id, image } = req.body;
  debug(req.body);

  let user = await AssistantModel.findOne({ email });
  if (user) {
    return res.json(failed_response("User already present!"));
  }
  let avatar = "";
  if (image) {
    avatar = await saveImage(image);
  }
  user = await AssistantModel.create({
    email,
    password,
    first_name,
    last_name,
    shop_id,
    avatar,
    created_by: req.user._id,
  });
  return res.json(success_response({ data: [] }));
});

router.get("/", async (req, res, next) => {
  const users = await AssistantModel.find({
    created_by: mongoose.Types.ObjectId(req.user._id),
  });
  return res.json(success_response({ data: users }));
});

router.delete("/", async (req, res, next) => {
  try {
    const ass = await AssistantModel.findById(req.body._id);
    if (ass.image) {
      const location = path.join(__dirname, image_path);
      fs.unlink(location + ass.image);
    }
    await ass.delete();
    res.json(success_response({}));
  } catch (e) {
    res.status(500).json({ message: "An error occured!" });
  }
});

const saveImage = async (imageBuffer) => {
  // Generate random string
  var seed = crypto.randomBytes(20);
  var uniqueSHA1String = crypto.createHash("sha1").update(seed).digest("hex");

  var userUploadedFeedMessagesLocation = path.join(__dirname, image_path);
  var imageTypeRegularExpression = /\/(.*?)$/;
  var uniqueRandomImageName = "avatar-" + uniqueSHA1String;
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
