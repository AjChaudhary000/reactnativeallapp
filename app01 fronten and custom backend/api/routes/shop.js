const express = require("express");
const router = express.Router();
const ShopModel = require("../model/Shop");
const { success_response, failed_response } = require("../response");
const crypto = require("crypto");
const debug = require("debug")("app01-api:shop");
const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const UserModel = require("../model/User");
const passport = require("passport");

const image_path = "../img/upload/shop/";

const fs2 = require("fs");
const { authm } = require("./utils");
if (!fs2.existsSync(path.join(__dirname, image_path))) {
  fs2.mkdirSync(path.join(__dirname, image_path), { recursive: true });
}

router.post("/", authm, async function (req, res, next) {
  try {
    debug("Add shop request recieved.");
    const images = await Promise.all(
      req.body.images.map(async (data) => await saveImage(data))
    );
    const shop = await ShopModel.create({
      ...req.body,
      images,
      created_by: req.user._id,
    });
    res.json(success_response({ data: shop }));
  } catch (err) {
    debug(err);
    res.status(500).json(failed_response("Failed"));
  }
});
router.delete("/", authm, async function (req, res, next) {
  try {
    const shop = await ShopModel.findById(req.body._id);
    shop.images.map((image) => {
      const location = path.join(__dirname, image_path);
      fs.unlink(location + image);
    });
    await shop.delete();
    res.json(success_response({}));
  } catch (e) {
    res.status(500).json({ message: "An error occured!" });
  }
});
router.patch("/", authm, async function (req, res, next) {
  debug(req.body);
  try {
    const shop = await ShopModel.findById(req.body._id);
    for (let i = 0; i < shop.images.length; i++) {
      if (!req.body.images.includes(shop.images[i])) {
        const location = path.join(__dirname, image_path);
        fs.unlink(location + shop.images[i]);
      }
    }
    const images = await Promise.all(
      req.body.images.map(async (image) => {
        if (typeof image === "object") {
          return await saveImage(image);
        } else {
          return image;
        }
      })
    );

    await shop.update({ ...req.body, images });
    return res.json(success_response({ data: shop }));
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Failed"));
  }
});
router.get("/nearby", async function (req, res, next) {
  try {
    const shops = await ShopModel.aggregate([
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
    return res.json(success_response({ data: shops }));
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Failed"));
  }
});

router.post("/order", async function (req, res, next) {
  try {
    const { list } = req.body;
    for (let i = 0; i < list.length; i++) {
      const shop = await ShopModel.findById(list[i]);
      shop.index = i;
      await shop.save();
    }
    return res.json(success_response({}));
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Failed"));
  }
});
router.get("/", authm, async function (req, res, next) {
  try {
    const shops = await ShopModel.aggregate([
      {
        $match: {
          created_by: mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "shop_id",
          as: "orders",
        },
      },
      {
        $sort: {
          index: 1,
        },
      },
    ]);
    return res.json(success_response({ data: shops }));
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Failed"));
  }
});

router.get("/all", async function (req, res, next) {
  try {
    const { category_id } = req.query;
    const query = {};
    if (category_id) {
      query.category_id = mongoose.Types.ObjectId(category_id);
    }
    const shops = await ShopModel.aggregate([
      {
        $match: query,
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
    return res.json(success_response({ data: shops }));
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Failed"));
  }
});
router.get("/:id", async function (req, res, next) {
  debug(req.params.id);
  try {
    const shops = await ShopModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id),
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
    return res.json(success_response({ data: shops }));
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Failed"));
  }
});
const saveImage = async (imageBuffer) => {
  // Generate random string
  var seed = crypto.randomBytes(20);
  var uniqueSHA1String = crypto.createHash("sha1").update(seed).digest("hex");

  var userUploadedFeedMessagesLocation = path.join(__dirname, image_path);
  var imageTypeRegularExpression = /\/(.*?)$/;
  var uniqueRandomImageName = "shop-" + uniqueSHA1String;
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
