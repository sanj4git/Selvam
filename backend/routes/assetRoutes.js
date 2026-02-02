import express from "express";
import {
  createAsset,
  getAssets,
  updateAsset,
  deleteAsset,
} from "../controllers/assetController.js";

// Auth middleware (we will create this next)
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
  @route   POST /api/assets
  @desc    Add a new asset for logged-in user
  @access  Protected
*/
router.post("/", protect, createAsset);

/*
  @route   GET /api/assets
  @desc    Get all assets of logged-in user
  @access  Protected
*/
router.get("/", protect, getAssets);

/*
  @route   PUT /api/assets/:id
  @desc    Update an existing asset
  @access  Protected
*/
router.put("/:id", protect, updateAsset);

/*
  @route   DELETE /api/assets/:id
  @desc    Delete an asset
  @access  Protected
*/
router.delete("/:id", protect, deleteAsset);

export default router;