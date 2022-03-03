const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
  name: {
    type: String,
  },
  created_by: mongoose.ObjectId,
  shop_id: mongoose.ObjectId,
  index: Number,
});
const CategoryModel = mongoose.model("product_categories", CategoriesSchema);

module.exports = CategoryModel;
