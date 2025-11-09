"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SideBar from "../sideBar/page";
import Navbar from "../navBar/page";
import Loader from "@/app/loader/page";
import { motion } from "framer-motion";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState({ state: true, message: "Loading..." });
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  // ✅ Check User Session
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/signin", { method: "GET" });
      const data = await res.json();

      if (!data.success) {
        setLoading({ state: true, message: "⛔ You need to login first" });
        setTimeout(() => router.push("/login"), 800);
        return;
      }

      setUser(data.user);
      setLoading({ state: false, message: "Loading..." });
    };

    checkAuth();
  }, [router]);

  // ✅ Fetch Todos After User Loads
  useEffect(() => {
    if (!user?.userId) return;
    setLoading({ state: true, message: "Fetching your todos..." });
    const fetchTodos = async () => {
      try {
        const res = await fetch("/api/todo", {
          method: "GET",
          headers: { userId: user.userId },
        });

        const data = await res.json();
        if (data.success) {
          setTodos(data.todos.reverse());
          setLoading({ state: false });
        }
      } catch (err) {
        setLoading({ state: false });
        console.error("Error fetching todos:", err);
      }
    };

    fetchTodos();
  }, [user]);

  const toggleTodo = async (id, currentState) => {
    // Optimistic UI update (optional)
    setTodos(prev =>
      prev.map(todo =>
        todo._id === id ? { ...todo, isCompleted: !currentState } : todo
      )
    );

    try {
      const res = await fetch(`/api/todo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !currentState }),
      });

      const data = await res.json();
      if (!data.success) {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    // Step 1: Show confirmation alert
    const confirmed = window.confirm("Are you sure you want to delete this completed todo?");
    if (!confirmed) return; // User cancelled → Abort delete

    // Step 2: Show loading message
    setLoading({ state: true, message: "Deleting your completed todo..." });

    try {
      const res = await fetch(`/api/todo/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        // Step 3: Remove from UI (after backend confirms success)
        setTodos(prev => prev.filter(todo => todo._id !== id));

        // Step 4: Keep loading state for smooth UX, then remove
        setTimeout(() => {
          setLoading({ state: false, message: "" });
        }, 1500); // 1.5 seconds delay
      } else {
        console.error(data.message);
        setLoading({ state: false, message: "" });
      }

    } catch (err) {
      console.error("Failed to delete todo:", err);
      setLoading({ state: false, message: "" });
    }
  };


  // ✅ Compute Dynamic Stats (OUTSIDE useEffect so we can use them in JSX)
  if (loading.state) return <Loader message={loading.message} />;

  return (
    <div className="min-h-screen w-full flex bg-neutral-100">
      <SideBar open={open} setOpen={setOpen} />
      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Navbar user={user} setOpen={setOpen} title="All Todos" />
        <div className="w-full bg-neutral-100 flex justify-center py-10 px-5">
          <div className="max-w-5xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold text-neutral-800 tracking-tight">
                Your Todo's.
              </h1>

              <Link href="/create-todo"
                className="px-4 py-2 text-sm rounded-md bg-neutral-900 text-white hover:bg-neutral-700 transition"
              >
                + Create
              </Link>
            </div>

            {/* Empty State */}
            {todos.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-20 opacity-70">
                <div className="w-14 h-14 rounded-full border-4 border-neutral-400 flex items-center justify-center text-neutral-600 text-2xl">
                  !
                </div>
                <p className="mt-4 text-neutral-600">No tasks found for this user.</p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.15 } },
                }}
              >
                {todos.map((todo) => (
                  <motion.div
                    key={todo._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.2 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <Link
                      href={`/todos/todo-${todo._id}`}
                      className="block bg-white border border-neutral-200 rounded-xl p-5 shadow-sm 
                hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                    >
                      <h2 className="text-lg font-medium text-neutral-900 tracking-tight">
                        {todo.title}
                      </h2>

                      <p className="text-sm text-neutral-600 mt-2 leading-relaxed line-clamp-3">
                        {todo.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleTodo(todo._id, todo.isCompleted);
                          }}

                          className="mt-5 py-2 px-3 text-xs rounded-md bg-neutral-900 text-white
                      hover:bg-neutral-700 transition"
                        >
                          {todo.isCompleted ? "Mark as UnDone" : "Mark as Done"}
                        </button>
                        {todo.isCompleted && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              deleteTodo(todo._id);
                            }}
                            className="py-2 px-3 text-xs rounded-md bg-neutral-300 hover:bg-neutral-400 text-neutral-800 transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div >
  );
};

export default Page;
