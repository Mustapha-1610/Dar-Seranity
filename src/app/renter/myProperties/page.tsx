"use client";

import {
  getRenterLocalStorageData,
  setRenterLocalStorageData,
} from "@/Helpers/frontFunctions/localStorageHandler";
import landlordSocket from "@/Helpers/socketLogic/landlordSocket";
import { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import moment from "moment";
import RentedProperties from "./components/rentedProperties";
import RentalOffers from "./components/rentalOffers";
import SavedProperties from "./components/savedProperties";
import ScheduledViewings from "./components/scheduledViewings";

export default function MyProperties() {
  const [renterData, setRenterData] = useState<any>({});
  const { Column, ColumnGroup } = Table;
  const [activeTab, setActiveTab] = useState("rentedProperties");
  const [selectedComponent, setSelectedComponent] = useState(
    <RentedProperties />
  );

  interface DataType {
    key: React.Key;
    firstName: string;
    lastName: string;
    age: number;
    address: string;
    tags: string[];
  }

  useEffect(() => {
    setRenterData(getRenterLocalStorageData());
  }, []);
  const declineRentalOffer = async (e: any, propertyId: any) => {
    const response = await fetch("/api/renter/declineRentingOffer", {
      method: "POST",
      body: JSON.stringify({
        propertyId,
      }),
    });
    const res = await response.json();
    if (res.success) {
      setRenterLocalStorageData(res.responseData);
      setRenterData(getRenterLocalStorageData());
      const landlordSocketData = res.extraData;
      landlordSocket.emit("refLanNotis", landlordSocketData);
    } else {
      console.log(res);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50/50">
        <aside className="bg-gradient-to-br from-gray-800 to-gray-900 -translate-x-80 fixed inset-0 mt-8 my-4 w-80  h-[calc(100vh-32px)] rounded-xl transition-transform duration-300 xl:translate-x-0">
          <div className="relative border-b border-white/20">
            <a className="flex items-center mt-3 gap-4 py-6 px-8" href="#/"></a>
            <button
              className="middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-8 max-w-[32px] h-8 max-h-[32px] rounded-lg text-xs text-white hover:bg-white/10 active:bg-white/30 absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
              type="button"
            >
              <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="h-5 w-5 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
          <div className="m-4">
            <ul className="mb-4 flex flex-col gap-1">
              <li>
                <a
                  aria-current="page"
                  className={activeTab === "rentedProperties" ? "active" : ""}
                  href="#"
                >
                  <button
                    className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${
                      activeTab === "rentedProperties"
                        ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]"
                        : "text-white hover:bg-white/10 active:bg-white/30"
                    } w-full flex items-center gap-4 px-4 capitalize`}
                    type="button"
                    onClick={() => (
                      setActiveTab("rentedProperties"),
                      setSelectedComponent(<RentedProperties />)
                    )}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="w-5 h-5 text-inherit"
                    >
                      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path>
                      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path>
                    </svg>
                    <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                      Rented properties
                    </p>
                  </button>
                </a>
              </li>
              <li>
                <a
                  aria-current="page"
                  className={activeTab === "rentedProperties" ? "active" : ""}
                  href="#"
                >
                  <button
                    className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${
                      activeTab === "rentalOffers"
                        ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]"
                        : "text-white hover:bg-white/10 active:bg-white/30"
                    } w-full flex items-center gap-4 px-4 capitalize`}
                    type="button"
                    onClick={() => (
                      setActiveTab("rentalOffers"),
                      setSelectedComponent(<RentalOffers />)
                    )}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="w-5 h-5 text-inherit"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                      Rental Offers
                    </p>
                  </button>
                </a>
              </li>
              <li>
                <a
                  aria-current="page"
                  className={activeTab === "rentedProperties" ? "active" : ""}
                  href="#"
                >
                  <button
                    className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${
                      activeTab === "viewingSchedule"
                        ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]"
                        : "text-white hover:bg-white/10 active:bg-white/30"
                    } w-full flex items-center gap-4 px-4 capitalize`}
                    type="button"
                    onClick={() => (
                      setActiveTab("viewingSchedule"),
                      setSelectedComponent(<ScheduledViewings />)
                    )}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="w-5 h-5 text-inherit"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3.375 15h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h7.5a.375.375 0 00.375-.375v-1.5A.375.375 0 0010.875 9h-7.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                      Scheduled Viewings
                    </p>
                  </button>
                </a>
              </li>
              <li>
                <a
                  aria-current="page"
                  className={activeTab === "rentedProperties" ? "active" : ""}
                  href="#"
                >
                  <button
                    className={`middle none font-sans font-bold center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg ${
                      activeTab === "savedProperties"
                        ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85]"
                        : "text-white hover:bg-white/10 active:bg-white/30"
                    } w-full flex items-center gap-4 px-4 capitalize`}
                    type="button"
                    onClick={() => (
                      setActiveTab("savedProperties"),
                      setSelectedComponent(<SavedProperties />)
                    )}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="w-5 h-5 text-inherit"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3.375 15h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h7.5a.375.375 0 00.375-.375v-1.5A.375.375 0 0010.875 9h-7.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <p className="block antialiased font-sans text-base leading-relaxed text-inherit font-medium capitalize">
                      Saved Properties
                    </p>
                  </button>
                </a>
              </li>
            </ul>
          </div>
        </aside>
        <div className="p-4 xl:ml-80">
          <nav className="block w-full max-w-full bg-transparent text-white shadow-none rounded-xl transition-all px-0 py-1">
            <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center"></div>
          </nav>
          {selectedComponent}
        </div>
      </div>
    </>
  );
}
