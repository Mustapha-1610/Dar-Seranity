"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [landlordData, setLandlordData] = useState<any>(undefined);
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
        console.log(response.responseData);
        setLandlordData(response.responseData);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  useEffect(() => {
    fetchLandlordData();
  }, []);
  return (
    <>
      <div className="p-16 bg-gray-900 cover min-h-screen">
        <div className="p-8 bg-white shadow mt-24">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-3">
            {" "}
            <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
              {" "}
              <div>
                {" "}
                <p className="font-bold text-gray-700 text-xl">
                  {landlordData?.createdPropertyListings.length}
                </p>{" "}
                <p className="text-gray-400">Listings</p>{" "}
              </div>{" "}
              <div>
                {" "}
                <p className="font-bold text-gray-700 text-xl">
                  {
                    landlordData?.createdPropertyListings.filter(
                      (property: any) => property.rented
                    ).length
                  }
                </p>{" "}
                <p className="text-gray-400">Currently Rented</p>{" "}
              </div>{" "}
              <div>
                {" "}
                <p className="font-bold text-gray-700 text-xl">89</p>{" "}
                <p className="text-gray-400">Reviews</p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="relative">
              {" "}
              <div>
                {landlordData && (
                  <Image
                    className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500"
                    alt=""
                    src={landlordData?.profilePicture}
                    height={300}
                    width={300}
                  />
                )}
              </div>{" "}
            </div>{" "}
            <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
              <button className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
                {" "}
                Connect
              </button>{" "}
              <button className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
                {" "}
                Message
              </button>{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-20 text-center border-b pb-12">
            {" "}
            <h1 className="text-4xl font-medium text-gray-700">
              {landlordData?.name} {landlordData?.surname}
            </h1>{" "}
            <p className="font-light text-gray-600 mt-3">
              {landlordData?.email.toLowerCase()}
            </p>{" "}
            <p className="mt-10 text-gray-900 font-bold">Earnings 0$</p>{" "}
          </div>{" "}
          <div className="mt-12 flex flex-col justify-center">
            {" "}
            <p className="text-gray-600 text-center font-light lg:px-16">
              This account is intended for landlords using the Dar Seranity
              platform. By accessing and using this account, you agree to comply
              with our terms and conditions.
            </p>{" "}
            <button className="text-indigo-500 py-2 px-4  font-medium mt-4">
              {" "}
              Read Terms And Conditions
            </button>{" "}
          </div>
        </div>
      </div>
    </>
  );
}
