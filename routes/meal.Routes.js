import express from "express";
import { generateMealPlan } from "../controllers/meal.Controller.js";
import { authenticateUser } from "../middlewares/auth.middlewares.js";



const router = express.Router();
router.post("/generate", authenticateUser, generateMealPlan);

export default router;
