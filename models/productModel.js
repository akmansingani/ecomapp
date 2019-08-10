const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: 35
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000
    },
    price: {
      type: Number,
      trim: true,
      required: true
    },
    category: {
      type: ObjectId,
      ref: "Categories",
      required: true
    },
    quantity: {
      type: Number,
      trim: true,
      required: true
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    shipping: {
      type: Boolean,
      required: false,
      default: false
    },
    sold: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Products", productSchema);
