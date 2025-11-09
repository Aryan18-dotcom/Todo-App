"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="h-screen w-full flex flex-col justify-center items-center bg-white relative">

      {/* Animated 404 Illustration */}
      <div
        className="w-full max-w-xl h-80 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
        }}
      />

      {/* Content */}
      <div className="flex flex-col items-center mt-[-40px] text-center px-6">

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-extrabold text-neutral-800"
        >
          404
        </motion.h1>

        {/* Subtitle */}
        <motion.h3
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl font-semibold text-neutral-700 mt-4"
        >
          Looks like you're lost
        </motion.h3>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-neutral-500 mt-2"
        >
          The page you are looking for is not available!
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6 flex gap-4"
        >
          <Link
            href="/"
            className="px-6 py-3 bg-neutral-600 text-white rounded-md hover:bg-neutral-700 transition"
          >
            Go Home
          </Link>

          <Link
            href="/dashboard"
            className="px-6 py-3 border border-neutral-700 text-neutral-700 rounded-md hover:bg-neutral-200 transition"
          >
            Dashboard
          </Link>
        </motion.div>
      </div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.75, duration: 0.6 }}
        className="absolute bottom-8 flex gap-6 text-sm text-neutral-500"
      >
        <Link href="/login" className="hover:text-neutral-700 transition">Login</Link>
        <Link href="/signup" className="hover:text-neutral-700 transition">Signup</Link>
        <Link href="/contact" className="hover:text-neutral-700 transition">Contact</Link>
      </motion.div>
    </section>
  );
}


// "use client";
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";

// export default function NotFound() {
//   const [mouse, setMouse] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const handleMove = (e) => {
//       setMouse({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", handleMove);
//     return () => window.removeEventListener("mousemove", handleMove);
//   }, []);

//   return (
//     <div className="relative h-screen w-full overflow-hidden bg-neutral-100 flex items-center justify-center text-neutral-800">

//       {/* Blobby Background */}
//       <motion.div
//         animate={{
//           x: mouse.x / 25 - 40,
//           y: mouse.y / 25 - 40
//         }}
//         transition={{ type: "spring", stiffness: 60, damping: 12 }}
//         className="absolute w-[480px] h-[480px] bg-neutral-300/60 blur-3xl rounded-full"
//       />

//       {/* Main Text */}
//       <motion.h1
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.8 }}
//         style={{
//           transform: `translate(${mouse.x / 60}px, ${mouse.y / 60}px)`
//         }}
//         className="relative z-20 text-[16vw] leading-none font-black tracking-tight select-none"
//       >
//         404
//       </motion.h1>

//       {/* Subtitle */}
//       <motion.p
//         initial={{ opacity: 0, y: 18 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.4, duration: 0.7 }}
//         className="absolute bottom-40 text-center text-lg text-neutral-600 tracking-wide select-none"
//       >
//         Looks like you took a wrong turn.
//       </motion.p>

//       {/* CTA Buttons */}
//       <div className="absolute bottom-20 flex items-center gap-4">
//         <Link
//           href="/"
//           className="px-6 py-2 rounded-full bg-neutral-800 text-neutral-100 hover:bg-neutral-700 transition text-sm"
//         >
//           Go Home
//         </Link>

//         <Link
//           href="/dashboard"
//           className="px-6 py-2 rounded-full border border-neutral-700 text-neutral-700 hover:bg-neutral-200 transition text-sm"
//         >
//           Dashboard
//         </Link>
//       </div>

//       {/* Quick Links */}
//       <div className="absolute bottom-6 flex gap-6 text-neutral-500 text-sm">
//         <Link href="/login" className="hover:text-neutral-700 transition">Login</Link>
//         <Link href="/signup" className="hover:text-neutral-700 transition">Signup</Link>
//       </div>
//     </div>
//   );
// }