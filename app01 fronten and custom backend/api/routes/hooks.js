var express = require("express");
var router = express.Router();
const OrderModel = require("../model/Order");
const ShopModel = require("../model/Shop");
const UserModel = require("../model/User");

const debug = require("debug")("app01-api:hooks");

const calculateTotals = (total, charge, discount) => {
  return (total + charge - discount / 100).toFixed(2);
};
router.post("/stripe", async (request, response) => {
  const event = request.body;
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        debug("PaymentIntent was successful!");
        const order = await OrderModel.findOne({
          paymentIntentId: paymentIntent.id,
        });
        order.status = "Paid";
        await order.save();
        debug(`Order ${OrderModel._id} updated`);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (e) {
    debug(e);
  }
  // Return a 200 response to acknowledge receipt of the event
  response.json({ received: true });
});

router.get("/", (req, res) => {
  res.send("Hooks active");
});
module.exports = router;
