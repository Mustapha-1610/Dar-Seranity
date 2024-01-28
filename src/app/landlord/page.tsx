"use client";
import { Carousel } from "@material-tailwind/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GrRestroom } from "react-icons/gr";
import { PiArmchairDuotone } from "react-icons/pi";
import { IoBedOutline } from "react-icons/io5";
import { MdOutlineSoupKitchen } from "react-icons/md";
import { getLandlordLocalStorageData } from "@/Helpers/frontFunctions/localStorageHandler";
import { Spin } from "antd";
export default function HomePage() {
  const [landlordData, setLandlordData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fetchLandlordData = async () => {
    try {
      const landlordInfos = getLandlordLocalStorageData();
      if (landlordInfos.name) {
        setLandlordData(landlordInfos);
      } else {
        const res: any = await fetch("/api/landlord/getData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();
        if (response.responseData) {
          setLandlordData(response.responseData);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchLandlordData();
  }, []);
  return (
    <>
      {landlordData ? (
        <>
          <Spin spinning={loading} delay={350}>
            <section
              className="min-h-screen bg-opacity-500 bg-cover text-slate-300 relative pt-16"
              style={{
                backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/Needs%20For%20Project%2F1706396493971-transformed.png?alt=media&token=8d20b14f-99dc-4fff-a510-27c2701acc55')`,
                backgroundSize: "cover",
              }}
            >
              <div className="flex flex-col justify-center overflow-hidden bg-gray- py-6 sm:py-12">
                <div className="mx-auto px-4 ">
                  {landlordData?.createdPropertyListings.length > 0 ? (
                    <>
                      <h2 className="mb-4 text-white font-bold text-xl text-bold ">
                        Your Properties:
                      </h2>
                      <div className="grid w-full sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {landlordData?.createdPropertyListings.map(
                          (item: any) => {
                            return (
                              <div key={item._id}>
                                <div className="relative flex flex-col shadow-md rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 max-w-sm">
                                  <a
                                    href=""
                                    className="hover:text-orange-600 absolute z-30 top-2 right-0 mt-2 mr-3"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.5"
                                      stroke="currentColor"
                                      className="w-6 h-6"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                      />
                                    </svg>
                                  </a>
                                  <div className="h-auto overflow-hidden">
                                    <div className="h-42 relative">
                                      <Carousel
                                        placeholder=""
                                        transition={{ duration: 0.6 }}
                                        className="rounded-xl"
                                      >
                                        {item.images.map(
                                          (image: any, index: any) => (
                                            <div key={index}>
                                              <Image
                                                height={600}
                                                width={600}
                                                src={image}
                                                alt={`image ${index + 1}`}
                                                className="h-48 w-full object-cover"
                                              />
                                            </div>
                                          )
                                        )}
                                      </Carousel>
                                    </div>
                                  </div>
                                  <div className="bg-white py-4 px-3">
                                    <h3 className="text-lg  mb-2 font-bold">
                                      {item.title}
                                    </h3>
                                    <div className="flex justify-center items-center gap-2">
                                      <div className="flex items-center gap-1">
                                        <PiArmchairDuotone size={28} />
                                        <span>
                                          {item.roumNumbers.livingRoom}
                                        </span>{" "}
                                        /
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MdOutlineSoupKitchen size={28} />
                                        <span>
                                          {item.roumNumbers.kitchen}
                                        </span>{" "}
                                        /
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <GrRestroom size={28} />
                                        <span>
                                          {item.roumNumbers.restRoom}
                                        </span>{" "}
                                        /
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <IoBedOutline size={28} />
                                        <span>{item.roumNumbers.bedRoom}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-white font-bold">
                        You Did not Publish Any Property Listings Yet
                      </h3>
                    </>
                  )}
                </div>
              </div>
            </section>
          </Spin>
        </>
      ) : (
        <>
          <h1>Loading</h1>
        </>
      )}
    </>
  );
}
