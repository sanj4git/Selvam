import Liability from "../models/Liability.js";

/*
  @desc    Add a new liability
  @route   POST /liabilities
  @access  Private (Authenticated users only)
*/
export const addLiability = async (req, res) => {
  try {
    // Extract liability details from request body
    const { type, amount, interestRate, dueDate } = req.body;

    // Create new liability linked to logged-in user
    const liability = await Liability.create({
      user: req.user._id, // comes from auth middleware
      type,
      amount,
      interestRate,
      dueDate,
    });

    // Send success response
    res.status(201).json(liability);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to add liability",
    });
  }
};

/*
  @desc    Get all liabilities of the logged-in user
  @route   GET /liabilities
  @access  Private
*/
export const getLiabilities = async (req, res) => {
  try {
    // Fetch liabilities belonging only to the logged-in user
    const liabilities = await Liability.find({
      user: req.user._id,
    }).sort({ dueDate: 1 }); // nearest due date first

    res.status(200).json(liabilities);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch liabilities",
    });
  }
};

/*
  @desc    Update an existing liability
  @route   PUT /liabilities/:id
  @access  Private
*/
export const updateLiability = async (req, res) => {
  try {
    const liabilityId = req.params.id;

    // Find liability by ID
    const liability = await Liability.findById(liabilityId);

    // Check if liability exists
    if (!liability) {
      return res.status(404).json({
        message: "Liability not found",
      });
    }

    // Ensure the liability belongs to the logged-in user
    if (liability.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized to update this liability",
      });
    }

    // Update fields (fallback to existing values)
    liability.type = req.body.type ?? liability.type;
    liability.amount = req.body.amount ?? liability.amount;
    liability.interestRate =
      req.body.interestRate ?? liability.interestRate;
    liability.dueDate = req.body.dueDate ?? liability.dueDate;

    // Save updated liability
    const updatedLiability = await liability.save();

    res.status(200).json(updatedLiability);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update liability",
    });
  }
};

/*
  @desc    Delete an existing liability
  @route   DELETE /liabilities/:id
  @access  Private
*/
export const deleteLiability = async (req, res) => {
  try {
    const liabilityId = req.params.id;

    // Find liability by ID
    const liability = await Liability.findById(liabilityId);

    // Check if liability exists
    if (!liability) {
      return res.status(404).json({
        message: "Liability not found",
      });
    }

    // Ensure the liability belongs to the logged-in user
    if (liability.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized to delete this liability",
      });
    }

    // Delete liability
    await liability.deleteOne();

    res.status(200).json({
      message: "Liability deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete liability",
    });
  }
};
