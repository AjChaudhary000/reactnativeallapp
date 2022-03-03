const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
  name: {
    type: String,
  },
});
const CategoryModel = mongoose.model("category", CategoriesSchema);

module.exports = CategoryModel;
