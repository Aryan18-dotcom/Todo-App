
import { connectDB } from "@/lib/connectDB";
import { Todo } from "@/models/todoModel/model";

export async function GET(request, { params }) {
	try {
		await connectDB();

		const { id } = await params;
		if (!id) {
			return Response.json({ success: false, message: "Todo id is required" }, { status: 400 });
		}

		const todo = await Todo.findById(id).populate("userId", "full_name username email");

		if (!todo) {
			return Response.json({ success: false, message: "Todo not found" }, { status: 404 });
		}

		return Response.json({ success: true, todo }, { status: 200 });
	} catch (error) {
		return Response.json({ success: false, message: error.message }, { status: 500 });
	}
}

export async function PUT(request, { params }) {
	try {
		await connectDB();

		const { id } = await params;
		if (!id) {
			return Response.json({ success: false, message: "Todo id is required" }, { status: 400 });
		}

		// Get update data from request body
		const updateData = await request.json();

		// Find and update the todo
		const updatedTodo = await Todo.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true } // Return updated document
		).populate("userId", "full_name username email");

		if (!updatedTodo) {
			return Response.json({ success: false, message: "Todo not found" }, { status: 404 });
		}

		return Response.json(
			{ 
				success: true, 
				message: "Todo updated successfully",
				todo: updatedTodo 
			}, 
			{ status: 200 }
		);

	} catch (error) {
		return Response.json({ success: false, message: error.message }, { status: 500 });
	}
}


export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return Response.json({ success: false, message: "Todo id is required" }, { status: 400 });
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return Response.json({ success: false, message: "Todo not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: "Todo deleted successfully",
    }, { status: 200 });

  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}