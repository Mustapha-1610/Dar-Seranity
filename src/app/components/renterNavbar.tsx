"use client";
import {
  getRenterLocalStorageData,
  logoutRenterLocalStorage,
  setRenterLocalStorageData,
} from "@/Helpers/frontFunctions/localStorageHandler";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MdNotifications } from "react-icons/md";
import renterSocket from "@/Helpers/socketLogic/renterSocket";
export default function RenterNavbar() {
  const [renterData, setRenterData] = useState<any>();
  const [firstLoad, setFirstLoad] = useState(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] =
    useState<number>(0);
  const [isNotificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const router = useRouter();
  const logout = async (e: any) => {
    e && e.preventDefault();
    try {
      const res: any = await fetch("/api/renter/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        logoutRenterLocalStorage();
        router.push("/");
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchRenterData = async () => {
      try {
        const res: any = await fetch("/api/renter/getData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();
        if (response.responseData) {
          setRenterLocalStorageData(response.responseData);
          const unreadCount = response.responseData.notifications.filter(
            (notification: any) => !notification.readStatus
          ).length;
          setUnreadNotificationsCount(unreadCount);
          setRenterData(response.responseData);
          await renterSocket.emit("newRenterConnected", {
            renterSocketId: response.responseData.socketId,
          });
        } else {
          await logout(null);
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    renterSocket.on("refreshData", (data: any) => {
      fetchRenterData();
    });
    if (firstLoad) {
      setRenterData(getRenterLocalStorageData());
      fetchRenterData();
      setFirstLoad(false);
    } else {
      fetchRenterData();
    }
  }, [firstLoad, router]);
  const handleNotificationChange = async (e: any) => {
    e.preventDefault();
    setNotificationMenuOpen(!isNotificationMenuOpen);
    if (unreadNotificationsCount > 0) {
      const response = await fetch("/api/renter/clearNotifications", {
        method: "POST",
      });
      const res = await response.json();
      if (res.responseData) {
        setRenterLocalStorageData(res.responseData);

        setUnreadNotificationsCount(0);
        setTimeout(() => {
          setRenterData(res.responseData);
        }, 5000);
      }
    }
  };
  return (
    <>
      <nav className="bg-gray-900 text-white w-full py-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/landlord">
            <p className="text-2xl font-bold font-heading">Dar-Seranity</p>
          </Link>
          <ul className="hidden md:flex space-x-12">
            <li>
              <Link href="/landlord">
                <p className="hover:text-gray-200">Home</p>
              </Link>
            </li>
            <li>
              <Link href="/renter/browse">
                <p className="hover:text-gray-200">Browse</p>
              </Link>
            </li>
            <li>
              <Link href="/landlord/add">
                <p className="hover:text-gray-200">My Properties</p>
              </Link>
            </li>
            <li>
              <Link href="/landlord/subscriptionPacks">
                <p className="hover:text-gray-200">Inbox</p>
              </Link>
            </li>
            <li>
              <Link href="/landlord/statistics">
                <p className="hover:text-gray-200">Due Payments</p>
              </Link>
            </li>
          </ul>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div
                  className="cursor-pointer"
                  onClick={handleNotificationChange}
                >
                  {unreadNotificationsCount > 0 && (
                    <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {unreadNotificationsCount}
                      </span>
                    </div>
                  )}
                  <MdNotifications size={25} />
                </div>
                {isNotificationMenuOpen &&
                  renterData?.notifications.length > 0 && (
                    <div className="absolute mt-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 border border-gray-300 rounded-md shadow-lg max-w-md z-10">
                      <div className="py-2 px-3 border-b border-gray-300 font-bold">
                        Notifications
                      </div>
                      <div className="h-80 w-80 overflow-y-auto">
                        {renterData?.notifications
                          .slice()
                          .reverse()
                          .map((notification: any, index: number) => {
                            const notificationDate = new Date(
                              notification.recievedAt
                            );
                            const formattedDate = `${notificationDate.toLocaleDateString()} ${notificationDate.toLocaleTimeString()}`;

                            return (
                              <div
                                key={index}
                                className="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
                              >
                                <Image
                                  height={40}
                                  width={40}
                                  data-tooltip-target="tooltip-jese"
                                  className="h-10 w-10 rounded-xl cursor-pointer"
                                  src={notification?.notificationImage}
                                  alt="Medium avatar"
                                />
                                <div className="ml-2">
                                  <p className="text-xs font-semibold">
                                    {notification.notificationsMessage}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {`Sent at: ${formattedDate}`}
                                    {notification.readStatus === false && (
                                      <div className="   bg-blue-500 text-white rounded-full w-2 h-2" />
                                    )}
                                  </p>{" "}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
              </div>
            </div>
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
                  src={renterData?.profilePicture}
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
