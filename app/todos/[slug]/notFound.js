"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFoundTodo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center justify-center text-center py-24"
    >
      <motion.div
        initial={{ scale: 0.4, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 140 }}
        className="text-6xl mb-6"
      >
        😕
      </motion.div>

      <h2 className="text-lg md:text-xl font-semibold text-neutral-700 mb-2">
        Todo Not Found
      </h2>

      <p className="text-neutral-500 text-sm max-w-xs mb-8">
        The todo you are looking for may have been deleted or never existed.
      </p>

      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="px-4 py-2 text-sm rounded-md bg-neutral-900 text-white hover:bg-neutral-700 transition"
        >
          Go to Dashboard
        </Link>

        <Link
          href="/todos"
          className="px-4 py-2 text-sm rounded-md border border-neutral-400 text-neutral-700 hover:bg-neutral-200 transition"
        >
          View All Todos
        </Link>
      </div>
    </motion.div>
  );
}
