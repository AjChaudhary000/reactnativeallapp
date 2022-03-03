const express = require("express");
const router = express.Router();
const ChatModel = require("../model/Chat");
const ShopModel = require("../model/Shop");
const { success_response, failed_response } = require("../response");
const debug = require("debug")("app01-api:chat");
const mongoose = require("mongoose");
const UserModel = require("../model/User");

router.post("/user", async function (req, res, next) {
  try {
    debug(req.body);
    const find = await ChatModel.findOne({
      customer_id: mongoose.Types.ObjectId(req.body.to),
      shop_id: mongoose.Types.ObjectId(req.body.from),
    });
    if (find) {
      find.messages.push({
        to: mongoose.Types.ObjectId(req.body.to),
        from: mongoose.Types.ObjectId(req.body.from),
        message: req.body.message,
      });
      await find.save();
      return res.json(success_response({ data: [] }));
    }
    const chat = new ChatModel({});
    chat.customer_id = req.body.to;
    chat.shop_id = req.body.from;
    chat.messages.push({
      to: mongoose.Types.ObjectId(req.body.to),
      from: mongoose.Types.ObjectId(req.body.from),
      message: req.body.message,
    });
    await chat.save();
    res.json(success_response({ data: [] }));
  } catch (err) {
    debug(err);
    res.status(500).json(failed_response("Failed"));
  }
});
router.post("/", async function (req, res, next) {
  try {
    debug(req.body);
    const find = await ChatModel.findOne({
      customer_id: mongoose.Types.ObjectId(req.user._id),
      shop_id: mongoose.Types.ObjectId(req.body.to),
    });
    if (find) {
      find.messages.push({
        to: mongoose.Types.ObjectId(req.body.to),
        from: mongoose.Types.ObjectId(req.user._id),
        message: req.body.message,
      });
      await find.save();
      return res.json(success_response({ data: [] }));
    }
    const chat = new ChatModel({});
    chat.customer_id = req.user._id;
    chat.shop_id = req.body.to;
    chat.messages.push({
      to: mongoose.Types.ObjectId(req.body.to),
      from: mongoose.Types.ObjectId(req.user._id),
      message: req.body.message,
    });
    await chat.save();
    res.json(success_response({ data: [] }));
  } catch (err) {
    debug(err);
    res.status(500).json(failed_response("Failed"));
  }
});

router.get("/user/:id", async function (req, res, next) {
  try {
    const chat = await ChatModel.aggregate([
      {
        $match: {
          customer_id: mongoose.Types.ObjectId(req.params.id),
          shop_id: mongoose.Types.ObjectId(req.query.shop_id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "customer_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          "user.password": 0,
        },
      },
    ]);
    debug(chat);
    if (chat.length === 0) {
      const fallback = {};
      fallback.user = await UserModel.findById(req.params.id);
      fallback.messages = [];
      return res.json(success_response({ data: fallback }));
    } else {
      res.json(success_response({ data: chat[0] }));
    }
  } catch (err) {
    debug(err);
    res.status(500).json(failed_response("Failed"));
  }
});
router.get("/:id", async function (req, res, next) {
  try {
    const chat = await ChatModel.aggregate([
      {
        $match: {
          customer_id: mongoose.Types.ObjectId(req.user._id),
          shop_id: mongoose.Types.ObjectId(req.params.id),
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
    ]);
    debug(chat);
    if (chat.length === 0) {
      const fallback = {};
      fallback.shop = await ShopModel.findById(req.params.id);
      fallback.messages = [];
      return res.json(success_response({ data: fallback }));
    } else {
      res.json(success_response({ data: chat[0] }));
    }
  } catch (err) {
    debug(err);
    res.status(500).json(failed_response("Failed"));
  }
});

router.get("/shop/:id", async function (req, res, next) {
  try {
    const chat = await ChatModel.aggregate([
      {
        $match: {
          shop_id: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "customer_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          "user.password": 0,
        },
      },
    ]);
    debug(chat);
    res.json(success_response({ data: chat }));
  } catch (err) {
    debug(err);
    res.status(500).json(failed_response("Failed"));
  }
});
router.get("/", async function (req, res, next) {
  try {
    const chat = await ChatModel.aggregate([
      {
        $match: {
          customer_id: mongoose.Types.ObjectId(req.user._id),
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
    ]);
    res.json(success_response({ data: chat }));
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
  var uniqueRandomImageName = "product-" + uniqueSHA1String;
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
