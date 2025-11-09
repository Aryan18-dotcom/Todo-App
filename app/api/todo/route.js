import { connectDB } from "@/lib/connectDB";
import { Todo } from "@/models/todoModel/model";
import { User } from "@/models/userModel.js/model";

export async function GET(request) {
  try {
    await connectDB();

    const userId = request.headers.get("userId");

    if (!userId) {
      return Response.json(
        { success: false, message: "userId is required in query params" },
        { status: 400 }
      );
    }

    const todos = await Todo.find({ userId })
      .populate("userId", "full_name username email");

    if (todos.length === 0) {
      return Response.json(
        { success: false, message: "No Todos Found for this user!" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, count: todos.length, todos },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    // ✅ check if user exists
    const userExists = await User.findById(data.userId);
    if (!userExists) {
      return Response.json(
        { success: false, message: "User not found!" },
        { status: 404 }
      );
    }

    // ✅ create todo with foreign key
    await Todo.create(data);

    return Response.json(
      { success: true, message: "Todo created successfully!" },
      { status: 201 }
    );

  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
