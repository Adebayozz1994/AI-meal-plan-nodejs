import mongoose from "mongoose";

const MealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  goal: { type: String, required: true },
  allergies: { type: [String], default: [] },
  meals: { type: Array, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MealPlan", MealPlanSchema);
