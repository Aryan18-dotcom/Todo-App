"use client";
import { motion } from "framer-motion";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-neutral-100 text-neutral-700 overflow-hidden">

      {/* Smooth Floating Logo / Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex items-center justify-center"
      >
        {/* Animated Neutral Pulse Circle */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="h-32 w-32 rounded-full border border-neutral-400/70 shadow-sm"
        />

        {/* Inner Dot */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="h-4 w-4 rounded-full bg-neutral-600 shadow-md absolute"
        />
      </motion.div>

      {/* Text Animation */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-8 text-xl font-medium tracking-wide"
      >
        {message}
      </motion.h2>

      {/* Subtle User Interaction Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-sm text-neutral-500 mt-3 select-none"
      >
        Hold anywhere to breathe
      </motion.p>

      {/* Interactive Hover Ripple */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 px-4 py-2 rounded-full border border-neutral-400 text-neutral-600 text-sm cursor-pointer select-none transition-colors hover:bg-neutral-200"
      >
        Refresh Animation
      </motion.div>
    </div>
  );
}
