const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  created_by: mongoose.ObjectId,
  category_id: mongoose.ObjectId,
  created: { type: Date, default: Date.now },
  shop_id: mongoose.ObjectId,
  images: [],
  product_name: String,
  product_description: String,
  product_price: Number,
  selling_price: Number,
  product_available_status: { type: Boolean, default: true },
  index: Number,
});
const ProductModel = mongoose.model("product", ProductSchema);
module.exports = ProductModel;
