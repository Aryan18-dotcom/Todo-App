"use client";

import Navbar from "@/components/navBar/page";
import SideBar from "@/components/sideBar/page";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CreateTodos = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Button animation states
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Dynamic message above button
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/signin", { method: "GET" });
      const data = await res.json();

      if (!data.success) {
        setTimeout(() => router.push("/login"), 800);
        return;
      }
      setUser(data.user);
    };

    checkAuth();
  }, [router]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage({ type: "", text: "" });

  if (!user) return alert("User session not loaded. Please wait.");

  setIsLoading(true);

  const newTodo = { title, description, userId: user.userId };

  try {
    const res = await fetch("/api/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });

    const data = await res.json();

    if (data.success) {
      setIsSuccess(true);
      setIsLoading(false);
      setMessage({
        type: "success",
        text: `Task "${title}" created successfully.`,
      });

      // Reset UI back to idle in 1.5 sec
      setTimeout(() => {
        setIsSuccess(false);
        setTitle("");
        setDescription("");
      }, 1500);

    } else {
      setMessage({ type: "error", text: data.message });
      setIsLoading(false);
    }

  } catch (error) {
    setMessage({ type: "error", text: "Something went wrong." });
    setIsLoading(false);
  }
};


  return (
    <div className="relative h-screen w-full flex bg-neutral-100">

      <SideBar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col">
        <Navbar user={user} setOpen={setOpen} title="Create Todo" />

        <div className="flex justify-center items-start py-12 px-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl bg-white shadow-2xl shadow-neutral-400 rounded-xl p-6"
          >
            <h1 className="text-xl font-semibold tracking-tight text-neutral-800 mb-5">
              Create New Todo
            </h1>

            <div className="mb-4">
              <label className="block text-sm text-neutral-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-md border border-neutral-300 bg-neutral-50 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                placeholder="Enter todo title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-neutral-700 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 rounded-md border border-neutral-300 bg-neutral-50 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                rows="4"
                placeholder="Enter todo description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Dynamic Message Area */}
            {message.text && (
              <p
                className={`text-sm text-center mb-2 ${
                  message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message.type === "success" ? <Link href="/todos">{message.text}</Link> : message.text}
              </p>
            )}

            {/* Submit Button */}
<button
  type="submit"
  disabled={isLoading}
  className={`w-full flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition
  ${isSuccess ? "bg-green-600 text-white" : "bg-neutral-800 text-white hover:bg-neutral-700"}
  ${isLoading ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}`}
>
  {isLoading && !isSuccess && (
    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  )}

  {isSuccess && (
    <span className="inline-block w-5 h-5 text-white animate-scaleCheck">✓</span>
  )}

  {!isLoading && !isSuccess && "Add Todo"}
  {isLoading && !isSuccess && "Creating..."}
  {isSuccess && "Created"}
</button>


          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTodos;
