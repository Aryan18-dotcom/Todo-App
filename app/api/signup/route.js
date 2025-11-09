import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/userModel.js/model";

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const user = await User.create(data);

    return Response.json(
      { success: true, message: "User created successfully!", user },
      { status: 201 }
    );

  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
