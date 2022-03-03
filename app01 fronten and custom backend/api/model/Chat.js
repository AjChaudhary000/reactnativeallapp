const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  image: String,
  from: mongoose.ObjectId,
  to: mongoose.ObjectId,
  created: { type: Date, default: Date.now },
  message: String,
});
const ChatSchema = new Schema({
  messages: [MessageSchema],
  customer_id: mongoose.ObjectId,
  shop_id: mongoose.ObjectId,
});
const ChatModel = mongoose.model("chat", ChatSchema);
module.exports = ChatModel;
