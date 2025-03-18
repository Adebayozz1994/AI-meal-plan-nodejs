import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: { type: String, unique: true },
  profilePicture: String,
});

export default mongoose.model("User", userSchema);
