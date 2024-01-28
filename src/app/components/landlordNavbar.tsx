"use client";
import {
  getLandlordLocalStorageData,
  logoutLandlord,
  setLandlordLocalStorageData,
} from "@/Helpers/frontFunctions/localStorageHandler";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MdNotifications } from "react-icons/md";

export default function LandlordNavbar() {
  const [landlordData, setLandlordData] = useState<any>(undefined);
  const [firstLoad, setFirstLoad] = useState(true);
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
        logoutLandlord();
        router.push("/");
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchLandlordData = async () => {
    try {
      const res: any = await fetch("/api/landlord/getData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (response.responseData) {
        setLandlordLocalStorageData(response.responseData);
        setLandlordData(response.responseData);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  useEffect(() => {
    if (firstLoad) {
      setLandlordData(getLandlordLocalStorageData());
      fetchLandlordData();
      setFirstLoad(false);
    } else {
      fetchLandlordData();
    }
  }, [firstLoad]);
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
                <Image
                  height={120}
                  width={120}
                  data-tooltip-target="tooltip-jese"
                  className="h-10 w-10 rounded-xl cursor-pointer"
                  src={landlordData?.profilePicture}
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
