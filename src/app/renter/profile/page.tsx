"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRenterLocalStorageData } from "@/Helpers/frontFunctions/localStorageHandler";
import Image from "next/image";
export default function ProfilePage() {
  const router = useRouter();
  const [renterData, setRenterData] = useState<any>();
  const handleLoginFormSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const res: any = await fetch("/api/renter/getData", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === "Valid") {
        setRenterData(data.responseData!);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setRenterData(getRenterLocalStorageData());
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
                  {renterData?.ViewingRequests.length}
                </p>{" "}
                <p className="text-gray-400">Requested Viewing</p>{" "}
              </div>{" "}
              <div>
                {" "}
                <p className="font-bold text-gray-700 text-xl">
                  {renterData?.viewingSchedules.length}
                </p>{" "}
                <p className="text-gray-400">Scheduled Viewings</p>{" "}
              </div>{" "}
              <div>
                {" "}
                <p className="font-bold text-gray-700 text-xl">
                  {renterData?.rentedProperties.length}
                </p>{" "}
                <p className="text-gray-400">Rented Properties</p>{" "}
              </div>{" "}
            </div>{" "}
            <div className="relative">
              {" "}
              <div>
                {renterData && (
                  <Image
                    className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500"
                    alt=""
                    src={renterData?.profilePicture}
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
              {renterData?.name} {renterData?.surname}
            </h1>{" "}
            <p className="font-light text-gray-600 mt-3">
              {renterData?.email.toLowerCase()}
            </p>{" "}
            <p className="mt-10 text-gray-900 font-bold">Earnings 0$</p>{" "}
          </div>{" "}
          <div className="mt-12 flex flex-col justify-center">
            {" "}
            <p className="text-gray-600 text-center font-light lg:px-16">
              This account is intended for Renters using the Dar Seranity
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
