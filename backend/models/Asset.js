import mongoose from "mongoose";

/*
  Asset Schema
  -------------
  Represents a single asset owned by a user.
  Each asset is linked to exactly one user via userId.
*/

const assetSchema = new mongoose.Schema(
  {
    // Reference to the User who owns this asset
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // links Asset -> User collection
    },

    // Category/type of asset (cash, gold, FD, stock, etc.)
    assetType: {
      type: String,
      required: true,
    },

    // Human-readable name for the asset
    // Example: "SBI Savings Account", "Gold Necklace"
    name: {
      type: String,
      required: true,
    },

    // Current value of the asset (assumed INR)
    value: {
      type: Number,
      required: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);

// Create Asset model
const Asset = mongoose.model("Asset", assetSchema);

export default Asset;