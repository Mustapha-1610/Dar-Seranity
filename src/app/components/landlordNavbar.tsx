"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MdNotifications } from "react-icons/md";

export default function LandlordNavbar() {
  const [responseMessage, setResponseMessage] = useState("");
  const [renterData, setRenterData] = useState<any>(null);
  const [onlineRentersCount, setOnlineRentersCount] = useState<any>(0);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
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
    } else {
      setRenterData(JSON.parse(localStorage.getItem("renterData")!));
    }
    return () => {};
  }, [renterData]);
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
              <Link href="/landlord/statistics">
                <p className="hover:text-gray-200">Statistics</p>
              </Link>
            </li>
          </ul>
          <div className="hidden xl:flex space-x-5 items-center">
            <a
              href="/login"
              className="bg-transparent text-white hover:bg-gray-700 hover:text-white font-semibold py-2 px-4 rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 26"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </a>
          </div>
          <div className="xl:hidden flex items-center">
            <a
              href="/login"
              className="bg-transparent text-white  hover:text-white font-semibold py-1 px-3 rounded-lg"
            >
              <MdNotifications size={25} />
            </a>

            <div className=" xl:flex space-x-5 items-center">
              <Image
                onClick={toggleDropdown}
                className="object-cover cursor-pointer object-center w-6 h-6 rounded-full"
                src="https://firebasestorage.googleapis.com/v0/b/tunibids.appspot.com/o/Windows_10_Default_Profile_Picture.svg.png?alt=media&token=e7aca30d-6eea-45ff-8522-db048fcb8c38"
                alt="User Image"
                width={24}
                height={24}
              />
              {isOpen && (
                <div
                  onMouseLeave={() => setIsOpen(false)}
                  className="absolute right-0 mt-2 bg-white border rounded shadow-lg"
                >
                  <button
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                    onClick={() => {
                      router.push("/landlord/profile");
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
