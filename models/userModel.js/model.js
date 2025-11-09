import mongoose from "mongoose";
import { Todo } from "../todoModel/model";

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

// ✅ Cascade delete todos when a user is deleted
UserSchema.pre("findOneAndDelete", async function (next) {
  try {
    const user = await this.model.findOne(this.getFilter());
    if (user) {
      await Todo.deleteMany({ userId: user._id });
    }
    next();
  } catch (err) {
    next(err);
  }
});

export const User =
  mongoose.models.User || mongoose.model("User", UserSchema);
