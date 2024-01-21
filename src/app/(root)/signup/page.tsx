"use client";

import { useState } from "react";
import RenterSignupPage from "../rSignup/renterSignupPage";
import LandlordSignupPage from "../lSignup/landlordSignupPage";
import Link from "next/link";

export default function SignupPage() {
  const [selectedComponent, setSelectedComponent] = useState("renter");

  const changeComponent = (e: any) => {
    setSelectedComponent(e.target.value);
  };

  return (
    <>
      <div className="h-screen md:flex ">
        <div
          className="relative overflow-hidden md:flex w-1/2 justify-around items-center hidden"
          style={{
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/Needs%20For%20Project%2FsignUpPicture.jpg?alt=media&token=1c7ab10b-38fe-4b7c-814d-86baa8bc6826')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        </div>
        {/* Right side with form */}
        <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
          <div className="bg-white">
            <h1 className="text-gray-800 font-bold text-2xl mb-1">
              Welcome Home to Serenity !
            </h1>
            <p className="text-sm font-normal text-gray-600 mb-7">
              Find Your Peace of Home
            </p>
            <div className="flex justify-center mb-6">
              {/* Radio button for Renter */}
              <div className="flex items-center mr-4">
                <input
                  id="renterButton"
                  type="radio"
                  name="signupDisplay"
                  value="renter"
                  className="hidden"
                  defaultChecked
                  onChange={changeComponent}
                />
                <label
                  htmlFor="renterButton"
                  className={`cursor-pointer px-4 py-2 font-semibold text-sm rounded-full ${
                    selectedComponent === "renter"
                      ? "bg-blue-800 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Renter
                </label>
              </div>
              {/* Radio button for Landlord */}
              <div className="flex items-center">
                <input
                  id="landlordButton"
                  type="radio"
                  name="signupDisplay"
                  value="landlord"
                  className="hidden"
                  onChange={changeComponent}
                />
                <label
                  htmlFor="landlordButton"
                  className={`cursor-pointer px-4 py-2 font-semibold text-sm rounded-full ${
                    selectedComponent === "landlord"
                      ? "bg-blue-800 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Landlord
                </label>
              </div>
            </div>
            <div className="h-signupForm max-h-[calc(100vh-4rem)] overflow-y-auto">
              {selectedComponent === "renter" ? (
                <RenterSignupPage />
              ) : (
                <LandlordSignupPage />
              )}
            </div>
            <span className="text-sm ml-2">
              Allready Have An Account ?{" "}
              <span className="text-sm  hover:text-blue-500 cursor-pointer">
                <Link href="/login">Login</Link>
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
