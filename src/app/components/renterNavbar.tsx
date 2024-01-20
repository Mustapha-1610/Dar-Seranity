"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import renterSocket from "@/Helpers/socketLogic/renterSocket";

export default function RenterNavbar() {
  const [responseMessage, setResponseMessage] = useState("");
  const [renterData, setRenterData] = useState<any>(null);
  const [onlineRentersCount, setOnlineRentersCount] = useState<any>(0);
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
        renterSocket.emit("renterDisconnected", {
          renterMail: renterData.email,
        });
        router.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const updatingOnlineRenterCountHandler = (count: any) => {
      setOnlineRentersCount(count);
    };
    if (renterData) {
      renterSocket.connect();
      renterSocket.emit("newRenterConnected", {
        renterMail: renterData.email,
      });
      renterSocket.on(
        "connectedRentersCountUpdate",
        updatingOnlineRenterCountHandler
      );
    } else {
      setRenterData(JSON.parse(localStorage.getItem("renterData")!));
    }
    return () => {};
  }, [renterData]);
  return (
    <>
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
          <button className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200">
            {onlineRentersCount}
          </button>
        </div>
      </nav>
    </>
  );
}
