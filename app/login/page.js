'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../loader/page";
import { motion } from "framer-motion";

const Login = () => {
  const router = useRouter();
  const [Show, setShow] = useState(false);
  const [loading, setLoading] = useState({state: false, message: "Loading..."});

  useEffect(() => {
    try {
      const checkAuth = async () => {
        setLoading({state: true, message: "Checking authentication..."});
        const res = await fetch("/api/signin", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.success) {
          router.push("/dashboard");
        } else {
          setLoading({state: false, message: "Loading..."});
        }
      };
      checkAuth();
    } catch (err) {
      setLoading({state: false, message: "Error to get the session..."});
    }
  }, [router]);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
    submit: "",
  });

  const inputClass = (error) =>
    `w-full rounded-lg border px-4 py-2.5 text-neutral-800 bg-neutral-100 placeholder-neutral-500 focus:outline-none shadow-sm
     ${error ? "border-red-500" : "border-neutral-400 focus:border-neutral-700"}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ identifier: "", password: "", submit: "" });

    if (!form.identifier.trim()) {
      return setErrors((prev) => ({ ...prev, identifier: "Enter email or username" }));
    }
    if (!form.password.trim()) {
      return setErrors((prev) => ({ ...prev, password: "Enter password" }));
    }

    try {
      setLoading({state: true, message: "Signing you in..."});
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: form.identifier,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setLoading({state: false, message: "Loading..."});
        setErrors((prev) => ({ ...prev, submit: data.message }));
        return;
      }

      // ✅ Login successful
      setLoading({state: true, message: "Signing you in..."});
      router.push("/dashboard");

    } catch (err) {
      setLoading({state: false, message: "Error signing you in..."});
      setErrors((prev) => ({ ...prev, submit: "Network error. Try again." }));
    }
  };

  if (loading.state) return <Loader message={loading.message} />

  return (
    <div className="h-screen w-full px-4 flex m-auto items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.58, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-md rounded-2xl bg-neutral-200 shadow-[0_8px_25px_rgba(0,0,0,0.25)] px-8 py-10">

        <div className="text-center mb-6">
          <h1 className="font-extrabold text-3xl tracking-tight text-neutral-900">
            Welcome Back 👋
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Login to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Identifier */}
          <div className="flex flex-col gap-1">
            <label htmlFor="identifier" className="text-sm font-medium text-neutral-800">
              Email or Username
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="yourname@example.com"
              value={form.identifier}
              onChange={(e) => setForm({ ...form, identifier: e.target.value })}
              className={inputClass(errors.identifier)}
            />
            {errors.identifier && <p className="text-xs text-red-500">{errors.identifier}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-neutral-800">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={Show ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputClass(errors.password)}
              />
              <button
                type="button"
                onClick={() => setShow(!Show)}
                className="absolute right-3 top-3 text-sm text-neutral-700"
              >
                {Show ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          {/* Submit Error */}
          {errors.submit && <p className="text-xs text-red-500 text-center">{errors.submit}</p>}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-neutral-800 px-4 py-2.5 font-semibold text-neutral-200 hover:bg-neutral-900 transition shadow-sm"
          >
            Login
          </button>
        </form>

        <div className="flex items-center gap-3 w-full mt-8 mb-4">
          <div className="flex-1 h-['1px'] bg-neutral-400"></div>
          <span className="text-neutral-500 text-sm">or</span>
          <div className="flex-1 h-['1px'] bg-neutral-400"></div>
        </div>

        <p className="text-center text-sm text-neutral-700">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-neutral-900 hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div >
  );
};

export default Login;
