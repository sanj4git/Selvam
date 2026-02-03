import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*
  Auth Middleware
  ---------------
  Protects routes by verifying JWT token.
  If valid, attaches the logged-in user object to req.user.
*/

const protect = async (req, res, next) => {
  let token;

  // Check for Authorization header and Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB and attach to request (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      // If user no longer exists
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Proceed to next middleware / controller
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // No token in header
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;
