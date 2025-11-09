"use client";
import { HiMenu } from "react-icons/hi";

export default function Navbar({ user = "Guest", setOpen, title = "Dashboard" }) {
    return (
        <div className="h-16 border-b bg-white px-6 flex items-center justify-between">

            {/* Mobile Menu Button */}
            <button
                className="md:hidden text-neutral-800"
                onClick={() => setOpen(true)}
            >
                <HiMenu size={28} />
            </button>

            <div className="w-full md:flex-row md:gap-4 flex-col flex items-end justify-between ">
                <h1 className="font-bold text-xl text-neutral-800">{title}</h1>

                <p className="md:text-base text-xs text-neutral-700">
                    Hello, <span className="font-medium">{user?.username}<span className="md:inline hidden">👋</span></span>
                </p>
            </div>
        </div>
    );
}
