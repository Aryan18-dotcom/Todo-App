"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "../sideBar/page";
import Navbar from "../navBar/page";
import Loader from "@/app/loader/page";

const DashboardClient = () => {
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

    const fetchTodos = async () => {
      // Start loading message
      setLoading({ state: true, message: "Just a min, you got there..." });

      try {
        const res = await fetch("/api/todo", {
          method: "GET",
          headers: { "userId": user.userId }
        });

        const data = await res.json();

        if (data.success) {
          // Set todos
          setTodos(data.todos.reverse());

          // Small delay for smooth UI transition
          setTimeout(() => {
            setLoading({ state: false, message: "" });
          }, 1500);

          return; // prevents running the next setLoading below
        }

        // If no success
        setLoading({ state: false, message: "" });

      } catch (err) {
        console.error("Error fetching todos:", err);
        setLoading({ state: false, message: "Failed to load todos" });
      }
    };

    fetchTodos();
  }, [user]);


  // ✅ Compute Dynamic Stats (OUTSIDE useEffect so we can use them in JSX)
  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;

  if (loading.state) return <Loader message={loading.message} />;

  return (
    <div className="h-screen w-full flex bg-neutral-100">

      <SideBar open={open} setOpen={setOpen} />

      {/* Main */}
      <div className="flex-1 flex flex-col">

        <Navbar user={user} setOpen={setOpen} />

        <div className="flex-1 overflow-y-auto p-6">

          {/* ✅ Stats Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-5"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } }
            }}
          >
            {[
              { label: "Total Tasks", value: totalTasks, color: "text-neutral-900" },
              { label: "Completed", value: completedTasks, color: "text-green-700" },
              { label: "Pending", value: pendingTasks, color: "text-red-600" }
            ].map((card, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  show: { opacity: 1, y: 0, scale: 1 }
                }}
                className="bg-neutral-200 rounded-xl p-6 shadow"
              >
                <p className="text-neutral-600 text-sm">{card.label}</p>
                <h2 className={`text-3xl font-bold mt-2 ${card.color}`}>{card.value}</h2>
              </motion.div>
            ))}
          </motion.div>

          {/* ✅ Todos Section */}
          <div className="mt-10">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-neutral-800">Your Todos</h2>
              <Link href="/todos" className="text-sm text-neutral-700 underline hover:text-neutral-900">View All</Link>
            </div>

            {todos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-neutral-100 border border-neutral-300 p-6 rounded-xl text-center text-neutral-700"
              >
                <p>You currently have <strong>0 tasks</strong>.</p>
                <p className="mt-1">Click below to create your first one 👇</p>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92, y: 4 }}>
                  <Link
                    href="/dashboard/create-todo"
                    className="inline-block mt-4 bg-neutral-900 text-neutral-200 px-4 py-2 rounded-md hover:bg-neutral-800 transition"
                  >
                    + Create Task
                  </Link>
                </motion.div>

              </motion.div>
            ) : (
              <>
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0, scale: 0.97 },
                    show: {
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.4, staggerChildren: 0.12 }
                    }
                  }}
                  className="bg-neutral-200 rounded-xl px-4 py-2 shadow divide-y divide-neutral-300"
                >
                  {todos.slice(0, 3).map((task) => (
                    <motion.div
                      key={task._id}
                      variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.8 },
                        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } }
                      }}
                    >
                      <Link href={`/todos/todo-${task._id}`} className="flex md:gap-0 gap-3 items-center justify-between rounded-lg mb-2 px-6 py-4 cursor-pointer hover:bg-neutral-300/50 transition">
                        <div className="flex flex-col text-neutral-800">
                          <h3
                            className={`font-bold text-neutral-600 md:text-base text-sm ${task.isCompleted ? "line-through text-neutral-400" : ""
                              }`}
                          >
                            {task.title}
                          </h3>

                          <p className="text-neutral-400 text-[0.6rem] md:text-xs line-clamp-5">{task.description}</p>
                        </div>

                        <motion.span
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className={`
                            text-[10px] md:text-sm 
                            py-[3px] px-2.5 md:px-3 
                            rounded-lg font-medium
                            ${task.isCompleted ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}
                          `}
                        >
                          {task.isCompleted ? "Completed" : "Pending"}
                        </motion.span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Link
                    href="/dashboard/create-todo"
                    className="inline-block mt-8 bg-neutral-900 text-neutral-200 px-5 py-3 rounded-lg font-semibold hover:bg-neutral-800 transition shadow"
                  >
                    + Create Task
                  </Link>
                </motion.div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
