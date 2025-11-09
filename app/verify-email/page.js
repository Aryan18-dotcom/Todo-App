"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const username = searchParams.get("username");

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" }); // success/error msg

  const updateMessage = (type, text) => setMessage({ type, text });

  const handleChange = (value, index) => {
    const updated = [...code];
    updated[index] = value.slice(-1);
    setCode(updated);

    if (value && index < 5) document.getElementById(`otp-${index + 1}`).focus();
  };

  // Auto submit once all digits filled
  useEffect(() => {
    if (code.every((n) => n !== "")) verifyCode();
  }, [code]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Verify OTP
  const verifyCode = async () => {
    setLoading(true);
    updateMessage("", "");

    const res = await fetch(
      `/api/verificationEmail?code=${code.join("")}&email=${encodeURIComponent(email)}`,
      { method: "GET" }
    );
    const data = await res.json();

    if (!data.success) {
      updateMessage("error", data.message || "Invalid code");
      setLoading(false);
      return;
    }

    updateMessage("success", "Email verified successfully. Redirecting...");
    setTimeout(() => router.push("/login"), 1200);
    setLoading(false);
  };

  // Resend OTP
  const resend = async () => {
    setTimeLeft(20);
    updateMessage("", "");

    await fetch("/api/verificationEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username }),
    });

    updateMessage("success", "New verification code sent!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-neutral-100"
    >
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold text-neutral-800">Verify Your Email</h1>
        <p className="text-neutral-600 text-sm mt-2">We sent a code to:</p>
        <p className="font-medium text-neutral-800 break-words">{email}</p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2 mt-6">
          {code.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              maxLength={1}
              className="w-10 h-12 text-center border border-neutral-400 rounded-lg text-lg focus:border-black outline-none"
            />
          ))}
        </div>

        {/* Message Banner */}
        {message.text && (
          <p
            className={`mt-4 text-sm ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}

        {/* Verify Button */}
        <button
          onClick={verifyCode}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-lg bg-black text-white hover:bg-neutral-800 transition"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {/* Resend Button */}
        <button
          onClick={resend}
          disabled={timeLeft > 0}
          className="w-full mt-3 text-sm text-blue-600 disabled:opacity-40"
        >
          Resend Code {timeLeft > 0 && `(${timeLeft}s)`}
        </button>
      </div>
    </motion.div>
  );
}
