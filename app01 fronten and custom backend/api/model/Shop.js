const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShopSchema = new Schema({
  created_by: mongoose.ObjectId,
  created_date: { type: Date, default: Date.now },
  address: String,
  delivery_available: Boolean,
  delivery_charges: { type: Number, default: 0 },
  delivery_distance: Number,
  description: String,
  images: [],
  payment_cash: Boolean,
  payment_pos: Boolean,
  shop_name: String,
  shop_timing: [],
  table_order: Boolean,
  table_order_charges: { type: Number, default: 0 },
  category_id: mongoose.ObjectId,
  latitude: Number,
  longitude: Number,
  pos: Boolean,
  phone: String,
  index: Number,
});
const ShopModel = mongoose.model("shop", ShopSchema);
module.exports = ShopModel;
