import Asset from "../models/Asset.js";
import Liability from "../models/Liability.js";
import Expense from "../models/Expense.js";

/*
  @desc    Get dashboard summary (assets, liabilities, net worth)
  @route   GET /api/dashboard/summary
  @access  Protected
*/
export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const assetAgg = await Asset.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$value" } } }
    ]);

    const liabilityAgg = await Liability.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalAssets = assetAgg[0]?.total || 0;
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
    const userId = req.user._id;

    const byCategory = await Expense.aggregate([
      { $match: { user: userId } },
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
      { $match: { user: userId } },
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
