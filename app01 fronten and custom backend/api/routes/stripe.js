var express = require("express");
var router = express.Router();
const stripe = require("stripe")(
  "sk_test_51GyJ7MEathSqKpVQBQKgHmjQjAXKCNsz7abC67hWtq7PPMhCzJUU5I8X3h3yomA3M3Hmcd6gHe0jjse23VBSyCRn00JnjUTSTb"
);
const debug = require("debug")("app01-api:stripe");
const User = require("../model/User");
const Shop = require("../model/Shop");
const { success_response, failed_response } = require("../response");
async function checkAndFetchCustomerId(userid) {
  const user = await User.findById(userid).exec();
  if (!user.stripe_customer_id) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.first_name + " " + user.last_name,
    });
    user.stripe_customer_id = customer.id;
    console.log("New customer created " + customer.id);
    user.save();
    return customer.id;
  } else {
    return user.stripe_customer_id;
  }
}
async function transferToConnect(amount, destination) {
  const transfer = await stripe.transfers.create({
    amount: (amount * 100).toFixed(0),
    currency: "eur",
    destination: destination,
  });
}
async function createConnectAccount() {
  const account = await stripe.accounts.create({
    type: "express",
    country: "IT",
  });
  return account.id;
}
function getConnectAccountMiddleware(req, res, next) {
  User.findById(req.user._id, (err, user) => {
    if (err) res.status(500).send(err);
    else {
      if (!user.connect_id) {
        createConnectAccount()
          .then((id) => {
            user.connect_id = id;
            req.connect_id = id;
            user.save();
            next();
          })
          .catch((err) => {
            res
              .status(500)
              .send({ err: err, message: "Account cannot be created." });
          });
      } else {
        req.connect_id = user.connect_id;
        next();
      }
    }
  });
}

router.get("/onboarding", getConnectAccountMiddleware, (req, res, next) => {
  stripe.accountLinks
    .create({
      account: req.connect_id,
      refresh_url: "https://example.com/reauth",
      return_url: "https://example.com/return",
      type: "account_onboarding",
    })
    .then((accountLink) => {
      res.json(accountLink);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ error: err, message: "Error generating onboarding link" });
    });
});

router.get("/checkOnboardingStatus", async function (req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const account = await stripe.accounts.retrieve(user.connect_id);
    debug(account);
    if (account) {
      user.onboarded = true;
      await user.save();
      return res.json(
        success_response({ message: "Charges enabled for user!" })
      );
    } else {
      return res
        .status(500)
        .json(failed_response("Charges not enabled for user!"));
    }
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Error"));
  }
});

router.get("/loginlink", async function (req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const loginLink = await stripe.accounts.createLoginLink(user.connect_id);
    return res.json({ url: loginLink.url });
  } catch (e) {
    debug(e);
    res.status(500).json(failed_response("Error"));
  }
});

router.post("/transfer-intent", async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  try {
    const id = await checkAndFetchCustomerId(req.user._id);
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: id },
      { apiVersion: "2020-08-27" }
    );
    const amount = (parseFloat(req.body.total) * 100).toFixed(0);
    const dest = await User.findById(req.body.user_id);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "eur",
      customer: id,
      transfer_data: {
        destination: dest.connect_id,
      },
      application_fee_amount: (parseFloat(req.body.total) * 100 * 0.1).toFixed(
        0
      ),
    });
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: id,
    });
  } catch (e) {
    debug(e);
    res.json(failed_response("Error"));
  }
});
router.post("/payment-sheet", async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  try {
    const id = await checkAndFetchCustomerId(req.user._id);
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: id },
      { apiVersion: "2020-08-27" }
    );
    const amount = (parseFloat(req.body.total) * 100).toFixed(0);
    const shop = await Shop.findById(req.body.shop_id);
    const shop_owner = await User.findById(shop.created_by);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "eur",
      customer: id,
      transfer_data: {
        destination: shop_owner.connect_id,
      },
      application_fee_amount: (parseFloat(req.body.total) * 100 * 0.1).toFixed(
        0
      ),
    });
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: id,
      id: paymentIntent.id,
    });
  } catch (e) {
    debug(e);
    res.json(failed_response("Error"));
  }
});
module.exports = { router, transferToConnect };
