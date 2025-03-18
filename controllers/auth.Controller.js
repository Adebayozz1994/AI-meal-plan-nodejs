import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const SECRET = process.env.JWT_SECRET;

// Login & Generate JWT Token
export const login = (req, res) => {
  const { id, name, email } = req.body; // Get user data from request

  if (!id || !name || !email) {
    return res.status(400).json({ message: "Missing user details" });
  }

  const token = jwt.sign(
    { id, name, email }, 
    SECRET, 
    { expiresIn: "1h" } // Token expires in 1 hour
  );

  res.json({ token }); // Send token to frontend
};

// Verify JWT Token Middleware
export const verifyToken = (req, res) => {
  const token = req.query.token; // Get token from request

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    res.json({ valid: true, user: decoded }); // Send decoded user data
  } catch (error) {
    res.status(401).json({ valid: false, message: "Invalid or expired token" });
  }
};
