"use client";

import { useState } from "react";
import RenterSignupPage from "../rSignup/renterSignupPage";
import LandlordSignupPage from "../lSignup/landlordSignupPage";

export default function SignupPage() {
  const [selectedComponent, setSelectedComponent] = useState("renter");

  const changeComponent = (e: any) => {
    setSelectedComponent(e.target.value);
  };

  return (
    <>
      <div className="h-screen md:flex">
        {/* Left side with background image */}
        <div
          className="relative overflow-hidden md:flex w-1/2 justify-around items-center hidden"
          style={{
            backgroundImage: `url('https://assets-global.website-files.com/5fcff9094e6ad8e939c7fa3a/64ff6242279772c2d44868aa_2022-05-23_Orchard_1_Briarcliff_Rd_Larchmont_Livingroom_Moving_is_Easy_3076.jpeg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Decorative circles can be kept or removed as per design preference */}
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
            {/* Render the corresponding signup form based on the selected account type */}
            {selectedComponent === "renter" ? (
              <RenterSignupPage />
            ) : (
              <LandlordSignupPage />
            )}
            <div className="flex justify-center items-center mt-6">
              <div className="w-1/4 border-b border-gray-400"></div>
              <span className="ml-2 text-gray-500 font-medium text-sm">OR</span>
              <div className="w-1/4 border-b border-gray-400"></div>
            </div>
            <button className="w-full max-w-xs font-bold mt-5 shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
              <div className="bg-white p-2 rounded-full">
                <svg className="w-4" viewBox="0 0 533.5 544.3">
                  <path
                    d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                    fill="#4285f4"
                  />
                  <path
                    d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                    fill="#34a853"
                  />
                  <path
                    d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                    fill="#fbbc04"
                  />
                  <path
                    d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                    fill="#ea4335"
                  />
                </svg>
              </div>
              <span className="ml-4">Sign Up with Google</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
