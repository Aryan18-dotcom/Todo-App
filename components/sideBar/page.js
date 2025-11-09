"use client";
import Loader from "@/app/loader/page";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function SideBar({ open, setOpen }) {
  const router = useRouter();
  const [loading, setLoading] = useState({ state: false, message: "Loading..." });
  const pathname = usePathname();

  const linkClasses = (path) =>
    `py-2 px-3 rounded-md transition ${pathname === path ? "bg-neutral-800 text-white" : "hover:bg-neutral-800 hover:text-white"
    }`;

  const handleLogout = async () => {
    setLoading({ state: true, message: "Logging you out..." });
    const res = await fetch("/api/signout", { method: "POST" });
    const data = await res.json();
    if (data.success) return router.push("/login");
    else setLoading({ state: false, message: "" });
  };

  if (loading.state) return <Loader message={loading.message} />;

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden z-30"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:sticky top-0 left-0 z-40 
          h-full md:h-screen
          bg-neutral-900 text-neutral-200 flex flex-col py-6 px-4
          w-64 transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <h2 className="text-xl font-extrabold tracking-wide mb-8">TaskFlow</h2>

        <Link href="/dashboard" className={linkClasses("/dashboard")}>
          Dashboard
        </Link>

        <Link href="/create-todo" className={linkClasses("/create-todo")}>
          Create Todo
        </Link>

        <Link href="/todos" className={linkClasses("/todos")}>
          All Todos
        </Link>

        <div className="flex-1"></div>

        <button
          onClick={() =>{handleLogout()}}
          className="py-2 px-3 rounded-md bg-red-600 hover:bg-red-700 transition cursor-pointer"
        >
          Logout
        </button>
      </div>
    </>
  );
}
