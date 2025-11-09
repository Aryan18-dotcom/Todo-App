'use client';
import { motion } from "framer-motion";
import Link from "next/link";

const Page = () => {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-neutral-200 px-6 py-8">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 1 }}
        className="max-w-3xl text-center"
      >

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold text-neutral-900 tracking-tight"
        >
          TaskFlow <span className="text-neutral-700">Task Manager</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-4 text-neutral-700 text-lg leading-relaxed"
        >
          Organize your day. Track your goals. Complete tasks with ease.
          <br/>Built with <span className="font-semibold">Next.js + MongoDB</span>.
        </motion.p>

        {/* Animated Feature Bubbles */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          {["Fast", "Secure", "Real-time", "Clean UI"].map((item, idx) => (
            <motion.span
              key={idx}
              variants={{
                hidden: { scale: 0, opacity: 0 },
                show: { scale: 1, opacity: 1 }
              }}
              className="px-5 py-2 text-sm font-medium rounded-full bg-neutral-300 text-neutral-800 shadow"
            >
              {item}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring", duration: 0.8 }}
        >
          <Link
            href="/login"
            className="inline-block mt-10 px-8 py-3 rounded-xl bg-neutral-900 text-neutral-100 font-semibold text-lg shadow hover:bg-neutral-800 transition"
          >
            Get Started →
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Page;
