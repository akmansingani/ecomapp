const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema(
  {
    product: {
      type: ObjectId,
      ref: "Products"
    },
    name: String,
    price: Number,
    count:Number,
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart",cartSchema)

const orderSchema = new mongoose.Schema(
  {
    products: [cartSchema],
    transactionid: {},
    amount: Number,
    address: String,
    status: {
      type: String,
      default: "Not processed",
      enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"] // enum means string objects
    },
    updated: Date,
    user: {
      type: ObjectId,
      ref: "Users"
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, Cart };
