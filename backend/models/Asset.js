import mongoose from "mongoose";

/*
  Asset Schema
  -------------
  Represents a single asset owned by a user.
*/

const assetSchema = new mongoose.Schema(
  {
    /*
      User Reference
    */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    /*
      Type of asset
      Example:
      cash, gold, fd, stock
    */
    assetType: {
      type: String,
      required: true,
    },

    /*
      Asset name
      Example:
      SBI FD
      Gold Necklace
    */
    name: {
      type: String,
      required: true,
    },

    /*
      Original value entered by user
      (principal amount)
    */
    value: {
      type: Number,
      required: true,
    },

    /*
      Interest rate for FD / savings
    */
    interestRate: {
      type: Number,
      default: 0,
    },

    /*
      Compounding frequency
      yearly / monthly / daily
    */
    compoundingFrequency: {
      type: String,
      enum: ["yearly", "monthly", "daily"],
      default: "yearly",
    },

    /*
      Purchase or investment date
      Used to calculate growth
    */
    purchaseDate: {
      type: Date,
      default: Date.now,
    },

    /*
      Quantity for market assets
      Example:
      gold grams
      stock shares
    */
    quantity: {
      type: Number,
      default: 1,
    },

    /*
      Flag to track live market prices (Mutual Funds, Gold)
    */
    isMarketLinked: {
      type: Boolean,
      default: false,
    },

    /*
      Symbol or scheme code for market tracking
    */
    symbol: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;