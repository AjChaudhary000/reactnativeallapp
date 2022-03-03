const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  created_date: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" },
  products: [],
  ordered_by: mongoose.ObjectId,
  total: Number,
  note: "",
  shop_id: mongoose.ObjectId,
  charges: Number,
  charge_type: String,
  discount_percent: Number,
  payment_type: String,
  table_number: String,
  delivery_address: String,
  paymentIntentId: String,
});
const OrderModel = mongoose.model("order", OrderSchema);
module.exports = OrderModel;
