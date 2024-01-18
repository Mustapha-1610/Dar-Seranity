"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
export default function RenterNavbar() {
  const [responseMessage, setResponseMessage] = useState("");
  const router = useRouter();
  const logout = async () => {
    try {
      const res: any = await fetch("/api/renter/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!data.success!) {
        setResponseMessage(data.error!);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <nav className="flex items-center justify-between py-4 px-4 bg-black relative top-0 w-full">
      <Link href="/renter">
        <p className="text-white font-bold">Browse</p>
      </Link>
      <div className="space-x-4">
        <Link href="/renter/profile">
          <button className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200">
            Profile
          </button>
        </Link>
        <button
          className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200"
          onClick={logout}
        >
          Log Out
        </button>
      </div>
    </nav>
  );
}
