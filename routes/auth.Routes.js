import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Google Auth Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Auth Callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
    (req, res) => {
      // Ensure req.user is available (set by passport)
      const user = req.user;
      // Sign the JWT with the user details
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      // Redirect to your frontend dashboard with the token in the query string
      res.redirect(`http://localhost:3000/dashboard?token=${token}`);
    }
  );

// Logout Route
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // Clear session cookie
      res.json({ message: "Logged out successfully" });
    });
  });
});

// Get User Data Route
router.get("/user", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  res.json(req.user);
});

export default router;
