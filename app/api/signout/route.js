import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/userModel.js/model";

export async function POST(request) {
    try {
        await connectDB();

        const cookieHeader = request.headers.get("cookie");
        if (!cookieHeader) {
            return new Response(JSON.stringify({ success: false, message: "No session found" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const session = cookieHeader.split("; ").find(c => c.startsWith("session="))?.split("=")[1];
        if (!session) {
            return new Response(JSON.stringify({ success: false, message: "Invalid session" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const user = await User.findOne({ sessionToken: session });
        if (!user) {
            return new Response(JSON.stringify({ success: false, message: "Session expired or User not found!" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }
        user.isLoggedIn = false;
        user.sessionToken = null;
        await user.save();
        const cookie = `session=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure`;
        return new Response(
            JSON.stringify({ success: true, message: "Signout successful" }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Set-Cookie": cookie,
                },
            }
        );
    } catch (error) {
        return Response.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}