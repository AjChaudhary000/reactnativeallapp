const SettingsModel = require("../model/Settings");
const passport = require("passport");
const authm = passport.authenticate("jwt", { session: false });
const getCommission1 = async () => {
  const data = await SettingsModel.find({});
  if (data.length === 0) {
    const comm = await SettingsModel.create({});
    return comm.commission1;
  } else {
    return data[0].commission1;
  }
};

const getCommission2 = async () => {
  const data = await SettingsModel.find({});
  if (data.length === 0) {
    const comm = await SettingsModel.create({});
    return comm.commission2;
  } else {
    return data[0].commission2;
  }
};

const getCommission3 = async () => {
  const data = await SettingsModel.find({});
  if (data.length === 0) {
    const comm = await SettingsModel.create({});
    return comm.commission3;
  } else {
    return data[0].commission3;
  }
};
const getLegal = async () => {
  const data = await SettingsModel.find({});
  if (data.length === 0) {
    const comm = await SettingsModel.create({});
    return comm.legal;
  } else {
    return data[0].legal;
  }
};
module.exports = {
  getCommission1,
  getCommission2,
  getCommission3,
  getLegal,
  authm,
};
