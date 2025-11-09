import { connectDB } from "@/lib/connectDB";
import { User } from "@/models/userModel.js/model";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import { getBaseUrl } from "@/lib/getBaseUrl";

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Generate a random verification code
function generateVerificationCode() {
    return randomBytes(3).toString("hex").toUpperCase();
}

// HTML email template
function getEmailTemplate(username, verificationCode) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .header {
          background-color: #000;
          color: #fff;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 0 0 5px 5px;
        }
        .verification-code {
          font-size: 24px;
          font-weight: bold;
          color: #000;
          text-align: center;
          padding: 10px;
          margin: 20px 0;
          background-color: #eee;
          border-radius: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verification</h1>
        </div>
        <div class="content">
          <p>Hello ${username},</p>
          <p>Thank you for registering! Please use the verification code below to verify your email address:</p>
          <div class="verification-code">${verificationCode}</div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
function getWelcomeTemplate(username, baseUrl) {
    return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        background: #f5f5f5;
        margin: 0;
        padding: 0;
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        max-width: 600px;
        background: #ffffff;
        margin: 40px auto;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      }
      .header {
        background: #111;
        padding: 25px;
        text-align: center;
      }
      .header h1 {
        color: white;
        margin: 0;
        font-size: 26px;
      }
      .content {
        padding: 30px;
        color: #333;
        line-height: 1.6;
      }
      .content h2 {
        margin-top: 0;
        font-size: 22px;
        font-weight: 600;
      }
      .btn {
        display: inline-block;
        background: #111;
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        margin-top: 20px;
        text-decoration: none;
        font-weight: 500;
      }
      .footer {
        text-align: center;
        padding: 18px;
        font-size: 12px;
        color: #777;
        background: #fafafa;
        border-top: 1px solid #eee;
      }
    </style>
  </head>
  <body>
    <div class="container">

      <div class="header">
        <h1>Welcome to Our Community</h1>
      </div>

      <div class="content">
        <h2>Hello ${username},</h2>

        <p>We are excited to have you onboard. Your email has been successfully verified and your account is now active.</p>

        <p>You can now log in and start exploring the full features of our platform.</p>

        <a href="${process.env.APP_BASE_URL || {baseUrl}}/login" class="btn">Go to Dashboard</a>

        <p style="margin-top: 20px;">If you have any questions or need assistance, our support team is always here to help.</p>

        <p>Welcome once again,<br><strong>Team ${process.env.APP_NAME || "Our Service"}</strong></p>
      </div>

      <div class="footer">
        This is an automated message, please do not reply.
      </div>

    </div>
  </body>
  </html>
  `;
}


export async function POST(request) {
    try {
        await connectDB();
        const { email, username } = await request.json();

        if (!email || !username) {
            return Response.json(
                { success: false, message: "Email and username are required" },
                { status: 400 }
            );
        }

        // Generate verification code
        const verificationCode = generateVerificationCode();

        // Create verification cookie data
        const verificationData = {
            storedCode: verificationCode,
            userEmail: email,
            expires: Date.now() + 10 * 60 * 1000 // 10 minutes
        };

        // Set cookie with verification data
        const cookie = `verification=${encodeURIComponent(JSON.stringify(verificationData))}; Path=/; Max-Age=${10 * 60}; HttpOnly; SameSite=Lax`;

        // Send verification email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Email Address((NextMong(JDBS))",
            html: getEmailTemplate(username, verificationCode),
        });

        return new Response(
            JSON.stringify({
                success: true,
                message: "Verification email sent successfully"
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Set-Cookie": cookie
                }
            }
        );

    } catch (error) {
        console.error("❌ Error sending verification email:", error);
        return Response.json(
            { success: false, message: "Failed to send verification email" },
            { status: 500 }
        );
    }
}


export async function GET(request) {
    try {
        await connectDB();
        const baseUrl = getBaseUrl(request);
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const email = searchParams.get('email');

        if (!code || !email) {
            return Response.json(
                { success: false, message: "Verification code and email are required" },
                { status: 400 }
            );
        }

        // Get the verification cookie
        const cookieHeader = request.headers.get("cookie");
        const verificationCookie = cookieHeader?.split("; ")
            .find(c => c.startsWith("verification="))?.split("=")[1];

        if (!verificationCookie) {
            return Response.json(
                { success: false, message: "Verification session expired or invalid" },
                { status: 400 }
            );
        }

        // Parse the verification data from cookie
        const { storedCode, userEmail, expires } = JSON.parse(decodeURIComponent(verificationCookie));

        // Check if code is valid and not expired
        if (storedCode !== code || userEmail !== email || Date.now() > expires) {
            // Clear the expired/invalid verification cookie
            const clearCookie = "verification=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax";

            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Invalid or expired verification code"
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Set-Cookie": clearCookie
                    }
                }
            );
        }

        // Find user and update active status
        const user = await User.findOneAndUpdate(
            { email },
            { isActive: true },
            { new: true }
        );

        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Clear the verification cookie after successful verification
        const clearCookie = "verification=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax";

        // Welcome Email (optional)
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to Our Service!(NextMong(JDBS))",
            html: getWelcomeTemplate(user.username, baseUrl),
        });


        return new Response(
            JSON.stringify({
                success: true,
                message: "Email verified successfully",
                user: {
                    username: user.username,
                    email: user.email,
                    isActive: user.isActive
                }
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Set-Cookie": clearCookie
                }
            }
        );

    } catch (error) {
        console.error("❌ Error verifying email:", error);
        return Response.json(
            { success: false, message: `Failed to verify email (${error})` },
            { status: 500 }
        );
    }
}