import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.db;
  }

  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve) => {
      mongoose.connection.once("connected", resolve);
    });
    return mongoose.connection.db;
  }

  try {
    await mongoose.connect(process.env.DB_URI, {
      dbName: "MongoDB-Test",
    });
    console.log("✅ MongoDB Connected (fresh)");
    return mongoose.connection.db;

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    throw new Error("Cannot connect to database");
  }
}
