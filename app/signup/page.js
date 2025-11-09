'use client';
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Loader from "../loader/page";

const PASSWORD_RULES = {
  length: { test: (p) => p.length >= 8, label: "At least 8 characters" },
  upper: { test: (p) => /[A-Z]/.test(p), label: "One uppercase letter" },
  number: { test: (p) => /[0-9]/.test(p), label: "One number" },
  special: { test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p), label: "One special character" },
};

const Signup = () => {
  const router = useRouter()
  const [loader, setloader] = useState(false)
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  // Field-level errors/messages
  const [errors, setErrors] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
    submit: "",
  });

  // Availability state from server check
  const [availability, setAvailability] = useState({
    usernameExists: false,
    emailExists: false,
    checkingUsername: false,
    checkingEmail: false,
  });

  // Password rule pass/fail
  const [pwdChecks, setPwdChecks] = useState({
    length: false,
    upper: false,
    number: false,
    special: false,
  });

  // debounce refs
  const usernameTimer = useRef(null);
  const emailTimer = useRef(null);

  // Utility input class
  const inputClass = (error) =>
    `w-full rounded-lg border px-4 py-2.5 text-neutral-800 bg-neutral-100 shadow-sm focus:outline-none ${error ? "border-red-500" : "border-neutral-400 focus:border-neutral-700"
    }`;

  // Validate password live
  useEffect(() => {
    const p = form.password || "";
    const newChecks = {};
    for (const key of Object.keys(PASSWORD_RULES)) {
      newChecks[key] = PASSWORD_RULES[key].test(p);
    }
    setPwdChecks(newChecks);

    // set password error if completely failing (optional)
    if (p.length > 0) {
      const allOk = Object.values(newChecks).every(Boolean);
      setErrors((prev) => ({ ...prev, password: allOk ? "" : "" })); // leave message blank — we show criteria
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }

    // live confirm check
    if (form.confirm.length > 0) {
      setErrors((prev) => ({
        ...prev,
        confirm: form.confirm !== p ? "Passwords do not match" : "",
      }));
    }
  }, [form.password, form.confirm]);

  // Live check username availability (debounced)
  useEffect(() => {
    // clear old timer
    if (usernameTimer.current) clearTimeout(usernameTimer.current);

    // quick client-side username checks
    if (!form.username) {
      setErrors((prev) => ({ ...prev, username: "" }));
      setAvailability((prev) => ({ ...prev, usernameExists: false }));
      return;
    }

    // set small client-side error for length
    if (form.username.length < 3) {
      setErrors((prev) => ({ ...prev, username: "Username must be at least 3 characters" }));
      setAvailability((prev) => ({ ...prev, usernameExists: false }));
      return;
    } else {
      setErrors((prev) => ({ ...prev, username: "" }));
    }

    usernameTimer.current = setTimeout(async () => {
      try {
        setAvailability((prev) => ({ ...prev, checkingUsername: true }));
        const url = `/api/checkUser?username=${encodeURIComponent(form.username.toLowerCase())}`;
        const res = await fetch(url);
        const data = await res.json();
        // expected: { usernameExists: boolean, emailExists: boolean }
        if (res.ok) {
          setAvailability((prev) => ({ ...prev, usernameExists: !!data.usernameExists }));
          // show error if exists
          setErrors((prev) => ({
            ...prev,
            username: data.usernameExists ? "Username already exists" : "",
          }));
        } else {
          // don't block user if endpoint not available
          setAvailability((prev) => ({ ...prev, usernameExists: false }));
        }
      } catch (err) {
        // ignore network error for live check
        setAvailability((prev) => ({ ...prev, usernameExists: false }));
      } finally {
        setAvailability((prev) => ({ ...prev, checkingUsername: false }));
      }
    }, 600);

    return () => clearTimeout(usernameTimer.current);
  }, [form.username]);

  // Live check email availability (debounced & basic format check)
  useEffect(() => {
    if (emailTimer.current) clearTimeout(emailTimer.current);

    if (!form.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
      setAvailability((prev) => ({ ...prev, emailExists: false }));
      return;
    }

    // basic email regex
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailValid) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      setAvailability((prev) => ({ ...prev, emailExists: false }));
      return;
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }

    emailTimer.current = setTimeout(async () => {
      try {
        setAvailability((prev) => ({ ...prev, checkingEmail: true }));
        const url = `/api/checkUser?email=${encodeURIComponent(form.email.toLowerCase())}`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setAvailability((prev) => ({ ...prev, emailExists: !!data.emailExists }));
          setErrors((prev) => ({
            ...prev,
            email: data.emailExists ? "Email already registered" : "",
          }));
        } else {
          setAvailability((prev) => ({ ...prev, emailExists: false }));
        }
      } catch (err) {
        setAvailability((prev) => ({ ...prev, emailExists: false }));
      } finally {
        setAvailability((prev) => ({ ...prev, checkingEmail: false }));
      }
    }, 600);

    return () => clearTimeout(emailTimer.current);
  }, [form.email]);

  // Called on submit
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setloader(true);
  //   setErrors((prev) => ({ ...prev, submit: "" }));

  //   // Client-side checks before hitting create:
  //   const preErrors = {};
  //   if (!form.full_name.trim()) preErrors.full_name = "Full name is required";
  //   if (!form.username.trim()) preErrors.username = "Username is required";
  //   if (!form.email.trim()) preErrors.email = "Email is required";
  //   if (!form.password) preErrors.password = "Password is required";
  //   if (!form.confirm) preErrors.confirm = "Please confirm your password";

  //   // password strength enforcement before submit
  //   const allPwdOk = Object.values(pwdChecks).every(Boolean);
  //   if (!allPwdOk) preErrors.password = "Password must meet all strength requirements";

  //   if (form.confirm !== form.password) preErrors.confirm = "Passwords do not match";

  //   if (Object.keys(preErrors).length > 0) {
  //     setErrors((prev) => ({ ...prev, ...preErrors }));
  //     return;
  //   }

  //   // If live checks already flagged username/email as existing, include them in errors immediately
  //   const immediateErrors = {};
  //   if (availability.usernameExists) immediateErrors.username = "Username already exists";
  //   if (availability.emailExists) immediateErrors.email = "Email already registered";

  //   if (Object.keys(immediateErrors).length > 0) {
  //     setErrors((prev) => ({ ...prev, ...immediateErrors }));
  //     return;
  //   }

  //   // Submit to server
  //   try {
  //     const res = await fetch("/api/signup", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         user: form.username,
  //         full_name: form.full_name,
  //         username: form.username,
  //         email: form.email,
  //         password: form.password,
  //       }),
  //     });
  //     const data = await res.json();

  //     if (!data.success) {
  //       setloader(false);
  //       const fieldErrors = {};

  //       // If API returns a structured `errors` object — use it.
  //       if (data.errors && typeof data.errors === "object") {
  //         for (const k of Object.keys(data.errors)) {
  //           fieldErrors[k] = data.errors[k];
  //         }
  //       } else if (data.message && typeof data.message === "string") {
  //         // fallback parsing for messages (best-effort)
  //         if (/username/i.test(data.message)) fieldErrors.username = fieldErrors.username || "Username already exists";
  //         if (/email/i.test(data.message)) fieldErrors.email = fieldErrors.email || "Email already registered";
  //         // attach general message
  //         if (!fieldErrors.username && !fieldErrors.email) fieldErrors.submit = data.message;
  //       } else {
  //         fieldErrors.submit = data.message || "Something went wrong";
  //       }

  //       setErrors((prev) => ({ ...prev, ...fieldErrors }));
  //       return;
  //     }

  //     // Success — redirect to login
  //     router.push('/verify-email');

  //   } catch (err) {
  //     setloader(false);
  //     console.error(err);
  //     setErrors((prev) => ({ ...prev, submit: "Network error. Try again." }));
  //   }
  // };
const handleSubmit = async (e) => {
  e.preventDefault();
  setloader(true);
  setErrors((prev) => ({ ...prev, submit: "" }));

  // Client-side validations
  const preErrors = {};
  if (!form.full_name.trim()) preErrors.full_name = "Full name is required";
  if (!form.username.trim()) preErrors.username = "Username is required";
  if (!form.email.trim()) preErrors.email = "Email is required";
  if (!form.password) preErrors.password = "Password is required";
  if (!form.confirm) preErrors.confirm = "Please confirm your password";

  const allPwdOk = Object.values(pwdChecks).every(Boolean);
  if (!allPwdOk) preErrors.password = "Password must meet all strength requirements";
  if (form.confirm !== form.password) preErrors.confirm = "Passwords do not match";

  if (Object.keys(preErrors).length > 0) {
    setloader(false);
    setErrors((prev) => ({ ...prev, ...preErrors }));
    return;
  }

  // Block if username/email exists
  if (availability.usernameExists || availability.emailExists) {
    setloader(false);
    setErrors((prev) => ({
      ...prev,
      username: availability.usernameExists ? "Username already exists" : prev.username,
      email: availability.emailExists ? "Email already registered" : prev.email,
    }));
    return;
  }

  try {
    // STEP 1 → FIRST: Send Verification Email
    const verifyRes = await fetch("/api/verificationEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        username: form.username,
      }),
    });

    const verifyData = await verifyRes.json();
    console.log("Verification API Response:", verifyData);

    if (!verifyData.success) {
      setloader(false);
      setErrors((prev) => ({ ...prev, submit: verifyData.message || "Unable to send verification email" }));
      return;
    }

    // STEP 2 → THEN: Create Account Only if email was sent successfully
    const signupRes = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: form.username,
        full_name: form.full_name,
        username: form.username,
        email: form.email,
        password: form.password,
      }),
    });

    const signupData = await signupRes.json();
    console.log("Signup API Response:", signupData);

    if (!signupData.success) {
      setloader(false);
      setErrors((prev) => ({ ...prev, submit: signupData.message || "Signup failed" }));
      return;
    }

    // STEP 3 → Redirect to Verify Email Page
    router.push(`/verify-email?email=${encodeURIComponent(form.email)}&username=${encodeURIComponent(form.username)}`);

  } catch (err) {
    console.error(err);
    setErrors((prev) => ({ ...prev, submit: "Network error. Please try again." }));
    setloader(false);
  }
};


  if (loader) return <Loader message='Creating your account...' />;

  return (
    <div className="w-full h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.88, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-lg bg-neutral-200 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.25)] p-6 px-8 flex flex-col justify-center"
      >


        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-extrabold text-3xl tracking-tight text-neutral-900">
            Create Account ✨
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Sign up to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

          {/* Full Name + Username Row */}
          <div className="flex flex-col sm:flex-row gap-5">

            {/* Full Name */}
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="name" className="text-sm font-medium text-neutral-800">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className={inputClass(errors.full_name)}
              />
              {errors.full_name && <p className="text-xs text-red-500">{errors.full_name}</p>}
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="username" className="text-sm font-medium text-neutral-800">Username</label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  placeholder="yourusername"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className={inputClass(errors.username)}
                  autoComplete="off"
                />
                {availability.checkingUsername && (
                  <span className="absolute right-3 top-2 text-xs text-neutral-600">checking...</span>
                )}
              </div>
              {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
            </div>

          </div>


          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-neutral-800">Email</label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="yourname@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass(errors.email)}
                autoComplete="off"
              />
              {availability.checkingEmail && (
                <span className="absolute right-3 top-2 text-xs text-neutral-600">checking...</span>
              )}
            </div>
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-neutral-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full rounded-lg px-4 py-2.5 text-neutral-800 bg-neutral-100 shadow-sm focus:outline-none
      ${form.password.length === 0
                  ? "border-neutral-400 focus:border-neutral-700"
                  : Object.values(pwdChecks).every(Boolean)
                    ? "border-green-600 focus:border-green-700"
                    : "border-red-500 focus:border-red-600"
                }
    `}
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="confirm" className="text-sm font-medium text-neutral-800">
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              placeholder="Re-enter password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className={`w-full rounded-lg px-4 py-2.5 text-neutral-800 bg-neutral-100 shadow-sm focus:outline-none
      ${form.confirm.length === 0
                  ? "border-neutral-400 focus:border-neutral-700"
                  : form.confirm === form.password
                    ? "border-green-600 focus:border-green-700"
                    : "border-red-500 focus:border-red-600"
                }
    `}
            />
            {errors.confirm && <p className="text-xs text-red-500">{errors.confirm}</p>}
          </div>


          {/* submit error */}
          {errors.submit && <p className="text-sm text-red-500 text-center">{errors.submit}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-neutral-800 px-4 py-2.5 font-semibold text-neutral-200 hover:bg-neutral-900 transition shadow-sm"
          >
            Create Account
          </button>
        </form>

        <div className="flex items-center gap-3 w-full my-2">
          <div className="flex-1 h-['1px'] bg-neutral-400"></div>
          <span className="text-neutral-500 text-sm">or</span>
          <div className="flex-1 h-['1px'] bg-neutral-400"></div>
        </div>

        <p className="text-center text-sm text-neutral-700">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-neutral-900 hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
