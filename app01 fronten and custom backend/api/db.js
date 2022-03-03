const mongoose = require("mongoose");
const debug = require("debug")("app01-api : db");

// Exit application on error
mongoose.connection.on("error", (err) => {
  debug(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

exports.connect = () => {
  mongoose.connect("mongodb://127.0.0.1:27017/app-01", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
};
