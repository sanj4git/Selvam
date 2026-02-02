import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*
  Auth Middleware
  ---------------
  Protects routes by verifying JWT token.
  If valid, attaches user ID to req.user.
*/

const protect = async (req, res, next) => {
  let token;

  // 1️⃣ Check if Authorization header exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2️⃣ Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // 3️⃣ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4️⃣ Attach user ID to request object
      // (exclude password for safety)
      req.user = decoded.id;

      // 5️⃣ Move to next middleware/controller
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // 6️⃣ No token found
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;