import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    full_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isLoggedIn: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    sessionToken: { type: String, default: null },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model("User", UserSchema);
