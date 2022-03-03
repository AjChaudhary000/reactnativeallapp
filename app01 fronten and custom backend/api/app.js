const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("./db.js");
const passport = require("passport");
const debug = require("debug")("app01-api:app");
const session = require("express-session");
mongoose.connect();

require("./auth/auth");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const dashRouter = require("./routes/dashboard");
const categoryRouter = require("./routes/categories");
const productCategoriesRouter = require("./routes/product_categories");
const shopRouter = require("./routes/shop");
const productRouter = require("./routes/product");
const imageRouter = require("./routes/images");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const orderRouter = require("./routes/order");
const favRouter = require("./routes/fav");
const stripeRouter = require("./routes/stripe").router;
const hooksRouter = require("./routes/hooks");
const searchRouter = require("./routes/search");
const assistantRouter = require("./routes/assistant");
const settingsRouter = require("./routes/settings");

const app = express();
const cors = require("cors");
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
//Sets handlebars configurations (we will go through them later on)

app.use(logger("dev"));
app.use(express.json({ limit: "200MB" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRouter);
app.use("/shop", shopRouter);
app.use(
  "/product",
  // passport.authenticate("jwt", { session: false }),
  productRouter
);
app.use("/image", imageRouter);
app.use("/categories", categoryRouter);
app.use(
  "/productCategories",
  passport.authenticate("jwt", { session: false }),
  productCategoriesRouter
);
app.use("/user", passport.authenticate("jwt", { session: false }), userRouter);
app.use("/chat", passport.authenticate("jwt", { session: false }), chatRouter);
app.use(
  "/order",
  passport.authenticate("jwt", { session: false }),
  orderRouter
);
app.use("/fav", passport.authenticate("jwt", { session: false }), favRouter);
app.use(
  "/stripe",
  passport.authenticate("jwt", { session: false }),
  stripeRouter
);

app.use(
  "/search",
  passport.authenticate("jwt", { session: false }),
  searchRouter
);
app.use("/hooks", hooksRouter);
app.use(
  "/assistant",
  passport.authenticate("jwt", { session: false }),
  assistantRouter
);
app.use(
  "/settings",
  passport.authenticate("jwt", { session: false }),
  settingsRouter
);
app.use(session({ secret: "app01" }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/dashboard", dashRouter);

// catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// // app.use(function (err, req, res, next) {
//   debug(err);
//   res.json({ status: false, message: err.message });
// });

module.exports = app;
