import User from "../models/User.js";

/*
  requireHeadRole Middleware
  --------------------------
  Checks if the authenticated user has the "Head" role.
  Must be used AFTER the `protect` auth middleware.
*/
export const requireHeadRole = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user.role !== "Head") {
            return res.status(403).json({ message: "Access forbidden: Requires Family Head role" });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error checking role" });
    }
};
