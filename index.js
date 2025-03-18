import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import "./config/passport.js"; // Ensure this path is correct
import mealRoutes from "./routes/meal.Routes.js";
import authRoutes from "./routes/auth.Routes.js";
import { login, verifyToken } from "./controllers/auth.Controller.js";

dotenv.config();
const app = express();
// Login Route (Generate Token)
app.post("/auth/login", login);

// Verify Token Route
app.get("/api/verifyToken", verifyToken);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to database successfully"))
  .catch((err) => console.error("Database connection error:", err));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Middleware
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Persist sessions in DB
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/meals", mealRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Food Delivery API!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
