const express = require("express");
const router = express.Router();
const ProductModel = require("../model/Product");
const { success_response, failed_response } = require("../response");
const crypto = require("crypto");
const debug = require("debug")("app01-api:product");
const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");

const { authm } = require("./utils");
const image_path = "../img/upload/products/";

const fs2 = require("fs");
if (!fs2.existsSync(path.join(__dirname, image_path))) {
  fs2.mkdirSync(path.join(__dirname, image_path), { recursive: true });
}

router.post("/", authm, async function (req, res, next) {
  try {
    debug("Add product request recieved.");
    debug(req.body);
    const images = await Promise.all(
      req.body.images.map(async (data) => await saveImage(data))
    );
    const products = await ProductModel.create({
      ...req.body,
      images,
      created_by: req.user._id,
    });
    res.json(success_response({ data: products }));
  } catch (err) {
    debug(err);
    res.status(500).json(failed_response("Failed"));
  }
});
router.post("/order", async function (req, res, next) {
  try {
    const { list } = req.body;
    for (let i = 0; i < list.length; i++) {
      const product = await ProductModel.findById(list[i]);
      product.index = i;
      await product.save();
    }
    return res.json(success_response({}));
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Failed"));
  }
});
router.get("/nearby", async function (req, res, next) {
  try {
    const products = await ProductModel.find({});
    return res.json(success_response({ data: products }));
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Failed"));
  }
});
router.get("/", async function (req, res, next) {
  try {
    const products = await ProductModel.find({
      shop_id: mongoose.Types.ObjectId(req.query.shop_id),
      category_id: mongoose.Types.ObjectId(req.query.category_id),
    });
    return res.json(success_response({ data: products }));
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Failed"));
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const products = await ProductModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id),
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
    return res.json(success_response({ data: products }));
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Failed"));
  }
});
router.patch("/", async function (req, res, next) {
  try {
    debug(req.body);
    const product = await ProductModel.findById(req.body._id);
    for (let i = 0; i < product.images.length; i++) {
      if (!req.body.images.includes(product.images[i])) {
        const location = path.join(__dirname, image_path);
        fs.unlink(location + product.images[i]);
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

    await product.updateOne({ ...req.body, images });
    return res.json(success_response({ data: product }));
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Failed"));
  }
});
router.delete("/", async function (req, res, next) {
  try {
    const product = await ProductModel.findById(req.body._id);
    product.images.map((image) => {
      const location = path.join(__dirname, image_path);
      fs.unlink(location + image);
    });
    await product.delete();
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
