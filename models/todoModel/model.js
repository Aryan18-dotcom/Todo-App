import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Todo =
  mongoose.models.Todo || mongoose.model("Todo", TodoSchema);
