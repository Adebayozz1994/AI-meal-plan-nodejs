import express from "express";
import { generateMealPlan, getMealPlansByUser } from "../controllers/meal.Controller.js";
import { authenticateUser } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Protect the generate route with authentication middleware
router.post("/generate", authenticateUser, generateMealPlan);

// Get meal plans for a specific user (by userId)
router.get("/:userId", getMealPlansByUser);

export default router;
