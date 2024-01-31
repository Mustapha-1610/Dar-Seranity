"use client";

import { Spin } from "antd";
import { useEffect, useState } from "react";
import { Carousel } from "@material-tailwind/react";
import Image from "next/image";
import { PiArmchairDuotone } from "react-icons/pi";
import { MdOutlineChair } from "react-icons/md";

import { MdOutlineSoupKitchen, MdBalcony } from "react-icons/md";
import { GrRestroom } from "react-icons/gr";
import { IoBedOutline } from "react-icons/io5";
import { GiFlowerPot } from "react-icons/gi";
import { MdCheckCircleOutline } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { RangePickerProps } from "antd/es/date-picker";
import { useRouter } from "next/navigation";

export default function PropertyInformations({
  params,
}: {
  params: { id: string };
}) {
  const [propertyInformations, setPropertyInformations] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
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
        setLoading(false);
      }
    };
    if (params.id) {
      fetchPropertyInformations();
    }
  }, [params]);
  return (
    <>
      <Spin spinning={loading} delay={350}>
        <section
          className="min-h-screen bg-cover relative pt-16"
          style={{
            backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/Needs%20For%20Project%2F1706396493971-transformed.png?alt=media&token=8d20b14f-99dc-4fff-a510-27c2701acc55')`,
            backgroundColor: "rgba(169, 169, 169, 0.7)",
          }}
        >
          {propertyInformations && (
            <>
              <div className="bg-gray-100 dark:bg-gray-800 py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-2 lg:px-4">
                  <div className="flex flex-col md:flex-row -mx-5">
                    <div className="md:flex-1 px-4">
                      <div className="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4 relative overflow-hidden">
                        <div className="w-full h-full object-cover absolute inset-0">
                          <Carousel
                            placeholder=""
                            transition={{ duration: 0.6 }}
                            className="rounded-xl"
                          >
                            {propertyInformations?.propertyImages.map(
                              (image: any, index: any) => (
                                <div key={index} className="w-full h-full">
                                  <img
                                    src={image || null}
                                    alt={`image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )
                            )}
                          </Carousel>
                        </div>
                      </div>
                      <div>
                        <div className="flex -mx-2 mb-4">
                          <div className="w-1/2 px-2">
                            <button
                              className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700"
                              onClick={() => router.push("/login")}
                            >
                              Schedule Viewing
                            </button>
                          </div>
                          <div className="w-1/2 px-2">
                            <button
                              onClick={() => router.push("/login")}
                              className="w-full bg-orange-600 dark:bg-gray-700 text-white dark:text-white py-2 px-4 rounded-full font-bold hover:bg-orange-500 dark:hover:bg-gray-600"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="md:flex-1 px-4">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        {propertyInformations?.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        Location :{" "}
                        {propertyInformations?.cityName +
                          " " +
                          propertyInformations?.municipalityName}
                      </p>
                      <div className="flex mb-4">
                        <div className="mr-4">
                          <span className="font-bold text-gray-700 dark:text-gray-300">
                            Price:
                          </span>
                          <span className="text-gray-600 dark:text-gray-300">
                            $29.99
                          </span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <span className="font-bold text-gray-700 dark:text-gray-300">
                          Posted At :
                        </span>
                        <div className="flex items-center mt-2">
                          {propertyInformations?.createdAt}
                        </div>
                      </div>
                      <div className="mb-4">
                        <span className="font-bold text-gray-700 dark:text-gray-300">
                          Select Size:
                        </span>
                        <div className="flex items-center mt-2">
                          <button
                            disabled
                            className=" bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-6 rounded-full font-bold mr-2"
                          >
                            <MdOutlineChair size={28} />
                            {propertyInformations?.roomsCount.livingRoom}
                          </button>

                          <button
                            disabled
                            className=" bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-6 rounded-full font-bold mr-2"
                          >
                            <MdOutlineSoupKitchen size={28} />
                            {propertyInformations?.roomsCount.kitchen}
                          </button>
                          <button
                            disabled
                            className=" bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-6 rounded-full font-bold mr-2"
                          >
                            <GrRestroom size={28} />
                            {propertyInformations?.roomsCount.restRoom}
                          </button>
                          <button
                            disabled
                            className=" bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-6 rounded-full font-bold mr-2"
                          >
                            <IoBedOutline size={28} />
                            {propertyInformations?.roomsCount.bedRoom}
                          </button>
                          <button
                            disabled
                            className="flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-6 rounded-full font-bold mr-2"
                          >
                            {" "}
                            <GiFlowerPot className="mr-1" size={28} />
                            {propertyInformations?.garden ? (
                              <MdCheckCircleOutline
                                size={18}
                                color="green"
                                className="text-green-500"
                              />
                            ) : (
                              <VscError
                                size={18}
                                color="red"
                                className="text-red-500"
                              />
                            )}
                          </button>
                          <button
                            disabled
                            className="flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-6 rounded-full font-bold mr-2"
                          >
                            <MdBalcony size={28} className="mr-2" />
                            {propertyInformations?.balcony ? (
                              <MdCheckCircleOutline
                                size={18}
                                color="green"
                                className="text-green-500"
                              />
                            ) : (
                              <VscError
                                size={18}
                                color="red"
                                className="text-red-500"
                              />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-gray-700 dark:text-gray-300">
                          House Description:
                        </span>
                        <p className="text-gray-900 dark:text-gray-900 text-sm mt-2">
                          {propertyInformations?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </Spin>
    </>
  );
}
