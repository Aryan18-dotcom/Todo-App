import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Todo App",
  description:
    "A modern Todo App built with Next.js, MongoDB and Framer Motion. Organize your tasks with a clean and responsive interface.",

  metadataBase: new URL("https://todo-app-ashy-three.vercel.app"),
  alternates: {
    canonical: "https://todo-app-ashy-three.vercel.app",
  },

  openGraph: {
    title: "Todo App - Manage Your Tasks Easily",
    description:
      "Track, organize, and complete your tasks using a smooth and intuitive interface.",
    url: "https://todo-app-ashy-three.vercel.app",
    siteName: "Todo App",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "Todo App Preview Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Todo App - Your Tasks, Organized.",
    description:
      "Clean and modern Todo App built with Next.js, MongoDB, and Framer Motion animations.",
    images: ["/banner.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground min-h-screen`}
        >
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
