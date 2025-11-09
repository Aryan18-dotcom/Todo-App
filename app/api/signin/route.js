import { randomUUID } from "crypto";
import { User } from "@/models/userModel.js/model";
import { connectDB } from "@/lib/connectDB";

export async function POST(req) {
  try {
    await connectDB();
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Find user by username OR email
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    // ✅ FIRST check if user exists
    if (!user) {
      return Response.json(
        { success: false, message: "User or Email is Wrong!" },
        { status: 404 }
      );
    }

    // ✅ THEN check account status
    if (user.isLoggedIn === true) {
      return Response.json(
        { success: false, message: "User already logged in elsewhere." },
        { status: 403 }
      );
    }

    if (user.isActive === false) {
      return Response.json(
        { success: false, message: "Your account is inactive. Please contact support." },
        { status: 403 }
      );
    }

    // ✅ Password Validation
    if (user.password !== password) {
      return Response.json(
        { success: false, message: "Incorrect Credentials, Try again with the correct ones." },
        { status: 401 }
      );
    }

    // Create session token
    const sessionToken = randomUUID();
    user.sessionToken = sessionToken;
    user.isLoggedIn = true;
    await user.save();

    const cookie = `session=${sessionToken}; Path=/; Max-Age=${60 * 60 * 24 * 7}; HttpOnly; SameSite=Lax`;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Login successful",
        user: { username: user.username, email: user.email },
      }),
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


export async function GET(request) {
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

    return new Response(
      JSON.stringify({
        success: true,
        user: {
            userId: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            isLoggedIn: user.isLoggedIn,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
