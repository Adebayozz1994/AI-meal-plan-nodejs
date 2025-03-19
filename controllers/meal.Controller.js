import { GoogleGenerativeAI } from "@google/generative-ai";
import MealPlan from "../models/MealPlan.js";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini AI with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateMealPlan = async (req, res) => {
  try {
    const { userId, goal, allergies } = req.body;

    if (!userId || !goal) {
      return res.status(400).json({ error: "User ID and goal are required" });
    }

    const prompt = `Generate a 7-day meal plan for a person with the goal: ${goal}. Avoid these allergies: ${allergies?.join(
      ", "
    )}. Each meal should include calories and macronutrients.`;

    console.log("🟢 Sending request to Gemini AI...");

    // Send request to Gemini AI
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("✅ Gemini AI Response:", responseText);

    if (!responseText) {
      return res.status(500).json({ error: "Failed to generate meal plan" });
    }

    const newMealPlan = new MealPlan({ userId, goal, allergies, meals: responseText });
    await newMealPlan.save();

    res.json({ success: true, mealPlan: responseText });
  } catch (error) {
    console.error("❌ Error in generateMealPlan:", error);
    res.status(500).json({ error: error.message });
  }

};
export const getMealPlansByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const mealPlans = await MealPlan.find({ userId }).populate("userId", "name email");
    res.status(200).json(mealPlans);
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
