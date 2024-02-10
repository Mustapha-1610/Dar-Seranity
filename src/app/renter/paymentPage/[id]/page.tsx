"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Carousel } from "@material-tailwind/react";
import Image from "next/image";
import { setRenterLocalStorageData } from "@/Helpers/frontFunctions/localStorageHandler";
import landlordSocket from "@/Helpers/socketLogic/landlordSocket";
import { Spin } from "antd";

export default function PaymentPage({ params }: { params: { id: string } }) {
  const [propertyInformations, setPropertyInformations] =
    useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const acceptRentalOffer = async (e: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/renter/acceptRentingOffer", {
        method: "POST",
        body: JSON.stringify({
          propertyId: propertyInformations?._id,
        }),
      });
      const res = await response.json();
      console.log(res);
      if (res.success) {
        setRenterLocalStorageData(res.responseData);
        const landlordSocketId = res.extraData;
        landlordSocket.emit("refLanNotis", landlordSocketId);
        setLoading(false);
        router.push("/renter/myProperties");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const fetchPropertyInformations = async () => {
      const res = await fetch("/api/propertyListing/get", {
        method: "POST",
        body: JSON.stringify({
          propertyId: params.id,
        }),
      });
      const response = await res.json();
      if (response.success) {
        setPropertyInformations(response.propertyListing);
      }
    };

    if (params.id) {
      fetchPropertyInformations();
    }
  }, [params]);
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    // Get the current date
    const currentDate = new Date();

    // Get the month (0-indexed, so we add 1)
    const month = currentDate.getMonth() + 1;

    // Format the month as a string
    const formattedMonth = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(currentDate);

    // Set the formatted month in the state
    setCurrentMonth(formattedMonth);
  }, []);
  return (
    <>
      <Spin spinning={loading} delay={350}>
        <div className="py-7 px-2 md:px-6 2xl:px-0 flex justify-center items-center 2xl:mx-auto 2xl:container">
          <div className="flex flex-col justify-start items-start w-full space-y-9">
            <div className="flex flex-col xl:flex-row justify-center xl:justify-between space-y-6 xl:space-y-0 xl:space-x-6 w-full">
              <div className="xl:w-3/5 flex flex-col sm:flex-row xl:flex-col justify-center items-center bg-gray-100 dark:bg-gray-800 py-7 sm:py-0 xl:py-10 px-10 xl:w-full">
                <div className="flex flex-col justify-start items-start w-full space-y-4">
                  <p className="text-xl md:text-2xl font-bold leading-normal text-gray-800 dark:text-gray-50">
                    {propertyInformations?.title}
                  </p>
                  <p className="text-base font-semibold leading-none text-gray-600 dark:text-white">
                    You are paying {propertyInformations?.price}$ for the month
                    of {currentMonth} rent.
                  </p>
                </div>
                <div className="  xl:my-10 w-52 sm:w-96 xl:w-auto">
                  {propertyInformations?.propertyImages?.length > 0 ? (
                    <Carousel
                      placeholder=""
                      transition={{ duration: 0.6 }}
                      className="rounded-xl"
                    >
                      {propertyInformations.propertyImages.map(
                        (image: any, index: any) => (
                          <div key={index}>
                            <Image
                              height={800}
                              width={600}
                              src={image}
                              alt={`image ${index + 1}`}
                              className="h-96	 w-full object-cover"
                            />
                          </div>
                        )
                      )}
                    </Carousel>
                  ) : (
                    <div className="text-center text-gray-500">
                      No images available
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 bg-gray-100 dark:bg-gray-800 flex flex-col lg:w-full xl:w-3/5">
                <div className="mt-8">
                  <input
                    className="border border-gray-300 p-4 rounded w-full text-base leading-4 placeholder-gray-600 text-gray-600"
                    type="email"
                    name=""
                    id=""
                    placeholder="Email"
                  />
                </div>

                <label className="mt-8 text-base leading-4 text-gray-800 dark:text-gray-50">
                  Card details
                </label>
                <div className="mt-2 flex-col">
                  <div>
                    <input
                      className="border rounded-tl rounded-tr border-gray-300 p-4 w-full text-base leading-4 placeholder-gray-600 text-gray-600"
                      type="email"
                      name=""
                      id=""
                      placeholder="0000 1234 6549 15151"
                    />
                  </div>
                  <div className="flex-row flex">
                    <input
                      className="border rounded-bl border-gray-300 p-4 w-full text-base leading-4 placeholder-gray-600 text-gray-600"
                      type="email"
                      name=""
                      id=""
                      placeholder="MM/YY"
                    />
                    <input
                      className="border rounded-br border-gray-300 p-4 w-full text-base leading-4 placeholder-gray-600 text-gray-600"
                      type="email"
                      name=""
                      id=""
                      placeholder="CVC"
                    />
                  </div>
                </div>

                <label className="mt-8 text-base leading-4 text-gray-800 dark:text-gray-50">
                  Name on card
                </label>
                <div className="mt-2 flex-col">
                  <div>
                    <input
                      className="border rounded border-gray-300 p-4 w-full text-base leading-4 placeholder-gray-600 text-gray-600"
                      type="email"
                      name=""
                      id=""
                      placeholder="Name on card"
                    />
                  </div>
                </div>

                <label className="mt-8 text-base leading-4 text-gray-800 dark:text-gray-50">
                  Country or region
                </label>
                <div className="mt-2 flex-col">
                  <div className="relative">
                    <button
                      id="changetext"
                      className="text-left border rounded-tr rounded-tl border-gray-300 p-4 w-full text-base leading-4 placeholder-gray-600 text-gray-600 bg-white"
                      name=""
                    >
                      United States
                    </button>
                    <svg
                      className="cursor-pointer absolute top-4 right-4"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.5 5.75L8 10.25L12.5 5.75"
                        stroke="#27272A"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <svg
                      id="openIcon"
                      className="cursor-pointer hidden transform rotate-180 absolute top-4 right-4"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.5 5.75L8 10.25L12.5 5.75"
                        stroke="#27272A"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div
                      id="dropdown"
                      className="mt-1 hidden absolute z-10 w-full flex bg-gray-50 justify-start flex-col text-gray-600"
                    >
                      <div className="cursor-pointer hover:bg-gray-800 hover:text-white px-4 py-2">
                        China
                      </div>
                      <div className="cursor-pointer hover:bg-gray-800 hover:text-white px-4 py-2">
                        Russia
                      </div>
                      <div className="cursor-pointer hover:bg-gray-800 hover:text-white px-4 py-2">
                        UK
                      </div>
                    </div>
                  </div>
                  <input
                    className="border rounded-bl rounded-br border-gray-300 p-4 w-full text-base leading-4 placeholder-gray-600 text-gray-600"
                    type="text"
                    name=""
                    id=""
                    placeholder="ZIP"
                  />
                </div>

                {/* New line */}
                <div className="flex flex-row justify-between items-center mt-6">
                  <hr className="border w-1/4" />
                  <p className="text-base leading-4 text-gray-600 dark:text-white">
                    or pay with card
                  </p>
                  <hr className="border w-1/4" />
                </div>

                {/* Total display */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-900">
                    Total : {propertyInformations?.price}$
                  </p>
                  <p className="mt-2  text-gray-500 italic ">
                    be aware that you are required to pay upfront for the first
                    month.
                  </p>
                </div>

                <button
                  onClick={acceptRentalOffer}
                  className="mt-8 border border-transparent hover:border-gray-300 dark:bg-white dark:hover:bg-gray-900 dark:text-gray-900 dark:hover:text-white dark:border-transparent bg-gray-900 hover:bg-white text-white hover:text-gray-900 flex justify-center items-center py-4 rounded w-full"
                >
                  <div>
                    <button className="text-base leading-4">Pay </button>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </>
  );
}
