import Asset from "../models/Asset.js";

/*
  @desc    Create a new asset
  @route   POST /api/assets
  @access  Protected
*/
export const createAsset = async (req, res) => {
  try {
    const { assetType, name, value } = req.body;

    // Basic validation
    if (!assetType || !name || value === undefined) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Create asset linked to logged-in user
    const asset = await Asset.create({
      userId: req.user,
      assetType,
      name,
      value,
    });

    res.status(201).json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
  @desc    Get all assets of logged-in user
  @route   GET /api/assets
  @access  Protected
*/
export const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ userId: req.user });

    res.status(200).json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
  @desc    Update an existing asset
  @route   PUT /api/assets/:id
  @access  Protected
*/
export const updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    // Check if asset exists
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // Ensure asset belongs to logged-in user
    if (asset.userId.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedAsset = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedAsset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/*
  @desc    Delete an asset
  @route   DELETE /api/assets/:id
  @access  Protected
*/
export const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    // Check if asset exists
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // Ensure asset belongs to logged-in user
    if (asset.userId.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await asset.deleteOne();

    res.status(200).json({ message: "Asset removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};