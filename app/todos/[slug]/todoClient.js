"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/loader/page";
import SideBar from "@/components/sideBar/page";
import Navbar from "@/components/navBar/page";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export default function TodoClient({ todo }) {
    const router = useRouter();

    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description);
    const [isCompleted, setisCompleted] = useState(todo.isCompleted)
    const [loading, setLoading] = useState({ state: true, message: "Loading..." });
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

    if (loading.state) return <Loader message={loading.message} />;

    const updateTodo = async () => {
        try {
            setLoading({ state: true, message: "Updating..." });
            const res = await fetch(`/api/todo/${todo._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, isCompleted }),
            });
            const data = await res.json();

            if (!data.success) {
                setLoading({ state: false, message: "Loading..." });
                return;
            }

            setLoading({ state: true, message: "Todo Updated successfully! Redirecting..." });
            setTimeout(() => router.push("/todos"), 3000);
        } catch (error) {
            console.error("Update Todo Error:", error);
            setLoading({ state: false, message: "Loading..." });
        }

    };

    return (
        <div className="h-screen w-full flex bg-neutral-100">

            <SideBar open={open} setOpen={setOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <Navbar user={user} setOpen={setOpen} title="Edit Todo" />
                <div className="flex-1 overflow-y-auto p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="max-w-3xl mx-auto py-14 px-6 w-full"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all"
                        >
                            <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight mb-6">
                                Edit Todo
                            </h1>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm text-neutral-700 mb-1">Title</label>
                                    <input
                                        className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-neutral-800 transition"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-neutral-700 mb-1">Description</label>
                                    <textarea
                                        className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 h-32 focus:outline-none focus:border-neutral-800 transition"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-1">
                                    <div
                                        onClick={() => setisCompleted(!isCompleted)}
                                        className="w-6 h-6 border-2 border-neutral-700 rounded cursor-pointer flex items-center justify-center"
                                    >
                                        <AnimatePresence>
                                            {isCompleted && (
                                                <motion.span
                                                    key="check"
                                                    initial={{ scale: 0, opacity: 0, rotate: -45 }}
                                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                    exit={{ scale: 0, opacity: 0, rotate: 45 }}
                                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                                    className="text-neutral-700 text-lg leading-none"
                                                >
                                                    ✓
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <label className="block text-sm text-neutral-700">IsCompleted</label>
                                </div>

                                <button
                                    onClick={updateTodo}
                                    disabled={loading.state}
                                    className="px-2.5 py-2 md-px-5 md-py-2.5 rounded-md bg-neutral-900 text-white hover:bg-neutral-700 transition disabled:opacity-60"
                                >
                                    {loading.state ? "Saving..." : "Save Changes"}
                                </button>
                                <Link href="/todos" className="ml-4 px-5 py-2.5 rounded-md bg-neutral-700 text-white hover:bg-neutral-900">Cancel</Link>
                            </div>

                            <div className="mt-10 text-sm text-neutral-600 border-t border-neutral-200 pt-6 space-y-1">
                                <p><span className="text-neutral-800 font-medium">Created:</span> {new Date(todo.createdAt).toLocaleString()}</p>
                                <p><span className="text-neutral-800 font-medium">Last Updated:</span> {new Date(todo.updatedAt).toLocaleString()}</p>
                                <p><span className="text-neutral-800 font-medium">ID:</span> {todo._id}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div >
    );
}
