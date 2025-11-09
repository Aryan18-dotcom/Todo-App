import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/userModel.js/model";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const email = searchParams.get("email");

    const result = {};

    if (username) {
      const user = await User.findOne({ username });
      result.usernameExists = !!user;
    }

    if (email) {
      const user = await User.findOne({ email });
      result.emailExists = !!user;
    }

    return Response.json(result, { status: 200 });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}