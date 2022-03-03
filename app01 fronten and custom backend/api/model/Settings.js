const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SettingsSchema = new Schema({
  commission1: { type: Number, default: 10 },
  commission2: { type: Number, default: 10 },
  commission3: { type: Number, default: 10 },
  legal: { type: String, default: "" },
});
const SettingsModel = mongoose.model("settings", SettingsSchema);
module.exports = SettingsModel;
