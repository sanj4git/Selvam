import Asset from "../models/Asset.js";
import Liability from "../models/Liability.js";
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import { calculateCurrentAssetValue } from "../utils/financeCalculator.js";
import { getGoldPrice } from "../services/marketService.js";

/*
  @desc    Get dashboard summary (assets, liabilities, net worth)
  @route   GET /api/dashboard/summary
  @access  Protected
*/
export const getDashboardSummary = async (req, res) => {
  try {

    const familyMembers = await User.find({ familyId: req.user.familyId }).select('_id');
    const familyUserIds = familyMembers.map(m => m._id);

    // Fetch all assets of family
    const assets = await Asset.find({ userId: { $in: familyUserIds } });

    // Fetch live gold price
    const goldPrice = await getGoldPrice();

    let totalAssets = 0;

    // Calculate dynamic asset value
    assets.forEach((asset) => {

      let currentValue;

      if (asset.assetType && asset.assetType.toLowerCase() === "gold") {
        currentValue = calculateCurrentAssetValue(asset, goldPrice);
      } else {
        currentValue = calculateCurrentAssetValue(asset);
      }

      totalAssets += currentValue;

    });

    // Liabilities remain unchanged
    const liabilityAgg = await Liability.aggregate([
      { $match: { user: { $in: familyUserIds } } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    const totalLiabilities = liabilityAgg[0]?.total || 0;

    res.status(200).json({
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch dashboard summary" });
  }
};


/*
  @desc    Get expense breakdown (category-wise & month-wise)
  @route   GET /api/dashboard/expenses
  @access  Protected
*/
export const getExpenseSummary = async (req, res) => {
  try {

    const familyMembers = await User.find({ familyId: req.user.familyId }).select('_id');
    const familyUserIds = familyMembers.map(m => m._id);

    const byCategory = await Expense.aggregate([
      { $match: { user: { $in: familyUserIds } } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1
        }
      }
    ]);

    const byMonth = await Expense.aggregate([
      { $match: { user: { $in: familyUserIds } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          total: 1
        }
      },
      { $sort: { month: 1 } }
    ]);

    res.status(200).json({ byCategory, byMonth });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch expense summary" });
  }
};


/*
  @desc    Get liability breakdown (for pie chart)
  @route   GET /api/dashboard/liabilities
  @access  Protected
*/
export const getLiabilityBreakdown = async (req, res) => {
  try {

    const familyMembers = await User.find({ familyId: req.user.familyId }).select('_id');
    const familyUserIds = familyMembers.map(m => m._id);

    const liabilities = await Liability.aggregate([
      { $match: { user: { $in: familyUserIds } } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1
        }
      }
    ]);

    res.status(200).json(liabilities);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch liability breakdown" });
  }
};