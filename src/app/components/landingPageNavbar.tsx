"use client";
import Link from "next/link";
import React from "react";
export default function LandingPageNavbar() {
  return (
    <nav className="flex items-center justify-between py-4 px-4 bg-black relative top-0 w-full">
      <Link href="/">
        <p className="text-white font-bold">Home</p>
      </Link>
      <div className="space-x-4">
        <Link href="/login">
          <button className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200">
            Login
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200">
            Signup
          </button>
        </Link>
      </div>
    </nav>
  );
}
