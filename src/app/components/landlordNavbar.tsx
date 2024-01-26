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
          <div className="xl flex items-center">
            <a
              href="/login"
              className="bg-transparent text-white  hover:text-white font-semibold py-1 px-3 rounded-lg"
            >
              <MdNotifications size={25} />
            </a>

            <div className=" xl:flex space-x-5 items-center">
              <div>
                <img
                  data-tooltip-target="tooltip-jese"
                  className="w-10 h-10 rounded"
                  src="https://firebasestorage.googleapis.com/v0/b/tunibids.appspot.com/o/Windows_10_Default_Profile_Picture.svg.png?alt=media&token=e7aca30d-6eea-45ff-8522-db048fcb8c38"
                  alt="Medium avatar"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
