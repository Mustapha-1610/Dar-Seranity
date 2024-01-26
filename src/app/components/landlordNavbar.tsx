"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MdNotifications } from "react-icons/md";

export default function LandlordNavbar() {
  const [landlordData, setLandlordata] = useState<any>(undefined);
  const router = useRouter();
  const logout = async (e: any) => {
    e.preventDefault();
    try {
      const res: any = await fetch("/api/landlord/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success!) {
        localStorage.removeItem("landlordData");
        router.push("/");
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (landlordData) {
    } else {
      setLandlordata(JSON.parse(localStorage.getItem("landlordData")!));
    }
    return () => {};
  }, [landlordData]);
  return (
    <>
      <nav className="bg-gray-900 text-white w-full py-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <p className="text-2xl font-bold font-heading">Dar-Seranity</p>
          </Link>
          <ul className="hidden md:flex space-x-12">
            <li>
              <Link href="/landlord">
                <p className="hover:text-gray-200">My Properties</p>
              </Link>
            </li>
            <li>
              <Link href="/landlord/add">
                <p className="hover:text-gray-200">Add</p>
              </Link>
            </li>
            <li>
              <Link href="/landlord/subscriptionPacks">
                <p className="hover:text-gray-200">Packages</p>
              </Link>
            </li>
            <li>
              <Link href="/landlord/statistics">
                <p className="hover:text-gray-200">Statistics</p>
              </Link>
            </li>
          </ul>
          <div className="xl flex items-center">
            <a
              href="/login"
              className="bg-transparent text-white  hover:text-white font-semibold py-1 px-3 rounded-lg"
            >
              <MdNotifications size={25} />
            </a>

            <div className="xl:flex space-x-5 items-center">
              <div
                onClick={() => {
                  router.push("/landlord/profile");
                }}
                className="relative"
              >
                <img
                  data-tooltip-target="tooltip-jese"
                  className="w-9 h-9 rounded cursor-pointer"
                  src="https://firebasestorage.googleapis.com/v0/b/tunibids.appspot.com/o/Windows_10_Default_Profile_Picture.svg.png?alt=media&token=e7aca30d-6eea-45ff-8522-db048fcb8c38"
                  alt="Medium avatar"
                />
              </div>
            </div>
            <div
              onClick={logout}
              className="relative px-2 cursor-pointer items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f60f0f"
                strokeWidth="3"
                strokeLinecap="square"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
              </svg>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
