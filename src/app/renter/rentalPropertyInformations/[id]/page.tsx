"use client";

import { DatePicker, DatePickerProps, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { Carousel } from "@material-tailwind/react";

import { MdOutlineChair } from "react-icons/md";

import { MdOutlineSoupKitchen, MdBalcony } from "react-icons/md";
import { GrRestroom } from "react-icons/gr";
import { IoBedOutline } from "react-icons/io5";
import { GiFlowerPot } from "react-icons/gi";
import { MdCheckCircleOutline } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { RangePickerProps } from "antd/es/date-picker";
import {
  getRenterLocalStorageData,
  setRenterLocalStorageData,
} from "@/Helpers/frontFunctions/localStorageHandler";
import landlordSocket from "@/Helpers/socketLogic/landlordSocket";

export default function RentalPropertyInfos({
  params,
}: {
  params: { id: string };
}) {
  const [propertyInformations, setPropertyInformations] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [show, setShow] = useState(false);
  const [renterData, setRenterData] = useState<any>(null);
  const [viewingDate, setViewingData] = useState<any>("");
  const onChange = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
    setViewingData(dateString);
  };

  const onOk = (
    value: DatePickerProps["value"] | RangePickerProps["value"]
  ) => {
    console.log("onOk: ", value);
  };
  const [familyMembersCount, setFamilyMembersCount] = useState({
    adults: 0,
    children: 0,
    infants: 0,
  });
  const handleRoomCountChange = (name: string, v: number) => {
    setFamilyMembersCount((prevCountForm: any) => ({
      ...prevCountForm,
      [name]: prevCountForm[name] + v,
    }));
  };
  useEffect(() => {
    setRenterData(getRenterLocalStorageData());
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
  const saveProperty = async (e: any) => {
    try {
      e.preventDefault();
      const response = await fetch("/api/renter/saveProperty", {
        method: "POST",
        body: JSON.stringify({
          propertyId: propertyInformations._id,
          propertyTitle: propertyInformations.title,
          propertyDescription: propertyInformations.description,
        }),
      });
      const res = await response.json();
      console.log(res);
      if (res.success) {
        setRenterLocalStorageData(res.responseData);
        setRenterData(res.responseData);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const unsaveProperty = async (e: any) => {
    try {
      e.preventDefault();
      const response = await fetch("/api/renter/unsaveProperty", {
        method: "POST",
        body: JSON.stringify({
          propertyId: propertyInformations._id,
        }),
      });
      const res = await response.json();
      console.log(res);
      if (res.success) {
        setRenterLocalStorageData(res.responseData);
        setRenterData(res.responseData);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const scheduleListing = async (e: any) => {
    try {
      e.preventDefault();
      const response = await fetch("/api/renter/scheduleViewing", {
        method: "POST",
        body: JSON.stringify({
          adults: familyMembersCount.adults,
          children: familyMembersCount.children,
          infants: familyMembersCount.infants,
          propertyId: propertyInformations._id,
          viewingDate: viewingDate,
        }),
      });
      const res = await response.json();
      console.log(res);

      if (res.success) {
        setRenterLocalStorageData(res.responseData),
          setRenterData(res.responseData);
        const landlordSocketObject = res.extraData.landlordSocketId;
        landlordSocket.emit("refLanNotis", landlordSocketObject);
        setShow(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const unscheduleListing = async (e: any) => {
    try {
      e.preventDefault();
      const response = await fetch("/api/renter/cancelViewing", {
        method: "POST",
        body: JSON.stringify({
          propertyId: propertyInformations._id,
        }),
      });
      const res = await response.json();
      console.log(res);

      if (res.success) {
        setRenterLocalStorageData(res.responseData);
        landlordSocket.emit("refLanNotis", { data: res.extraData });
        setRenterData(res.responseData);
      }
    } catch (err) {
      console.log(err);
    }
  };
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
                        {renterData?.viewingSchedules.some(
                          (property: any) =>
                            property.propertyId === propertyInformations._id
                        ) ? (
                          <p>Property Is Allready Scheduled For A Vieweing</p>
                        ) : (
                          <>
                            <div className="flex -mx-2 mb-4">
                              <div className="w-1/2 px-2">
                                {renterData?.ViewingRequests.some(
                                  (property: any) =>
                                    property.propertyId ===
                                    propertyInformations._id
                                ) ? (
                                  <>
                                    <button
                                      className="w-full bg-red-600 dark:bg-gray-700 text-white dark:text-white py-2 px-4 rounded-full font-bold hover:bg-red-500 dark:hover:bg-gray-600"
                                      onClick={unscheduleListing}
                                    >
                                      UnSchedule
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        setShow(!show);
                                      }}
                                      className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700"
                                    >
                                      {show ? "Cancel" : "Schedule Viewing"}
                                    </button>
                                  </>
                                )}
                              </div>
                              <div className="w-1/2 px-2">
                                {renterData?.savedRentalProperties.some(
                                  (property: any) =>
                                    property.propertyId ===
                                    propertyInformations._id
                                ) ? (
                                  <>
                                    <button
                                      className="w-full bg-red-600 dark:bg-gray-700 text-white dark:text-white py-2 px-4 rounded-full font-bold hover:bg-red-500 dark:hover:bg-gray-600"
                                      onClick={unsaveProperty}
                                    >
                                      Unsave
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      className="w-full bg-orange-600 dark:bg-gray-700 text-white dark:text-white py-2 px-4 rounded-full font-bold hover:bg-orange-500 dark:hover:bg-gray-600"
                                      onClick={saveProperty}
                                    >
                                      Save
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </>
                        )}
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
                            Price :
                          </span>
                          <span className="text-gray-600 ml-1 dark:text-gray-300">
                            {propertyInformations.price}$
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
                      <div className="  ">
                        {show ? (
                          <div className="flex flex-col items-center">
                            <p className="mt-2 text-gray-500 italic">
                              How Many People Are You Bringing To The House!
                            </p>
                            <div className="flex mt-3 items-center gap-x-4">
                              <div className="flex bg-gray-200 rounded-md shadow-md px-2 py-4">
                                <label className="text-m mr-1 font-bold">
                                  Adults :{" "}
                                </label>
                                <div className="flex items-center gap-x-2">
                                  <button
                                    type="button"
                                    className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                    name="bedrooms"
                                    disabled={familyMembersCount.adults <= 0}
                                    onClick={() =>
                                      handleRoomCountChange("adults", -1)
                                    }
                                  >
                                    <AiOutlineMinusCircle />
                                  </button>
                                  <p>{familyMembersCount.adults}</p>
                                  <button
                                    type="button"
                                    className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                    name="bedrooms"
                                    onClick={() =>
                                      handleRoomCountChange("adults", 1)
                                    }
                                  >
                                    <AiOutlinePlusCircle />
                                  </button>
                                </div>
                              </div>
                              <div className="flex bg-gray-200 rounded-md shadow-md px-2 py-4">
                                <label className="text-m mr-1 font-bold">
                                  Children :{" "}
                                </label>
                                <div className="flex items-center gap-x-2">
                                  <button
                                    type="button"
                                    className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                    name="bedrooms"
                                    disabled={familyMembersCount.children <= 0}
                                    onClick={() =>
                                      handleRoomCountChange("children", -1)
                                    }
                                  >
                                    <AiOutlineMinusCircle />
                                  </button>
                                  <p>{familyMembersCount.children}</p>
                                  <button
                                    type="button"
                                    className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                    name="bedrooms"
                                    onClick={() =>
                                      handleRoomCountChange("children", 1)
                                    }
                                  >
                                    <AiOutlinePlusCircle />
                                  </button>
                                </div>
                              </div>
                              <div className="flex bg-gray-200 rounded-md shadow-md px-2 py-4">
                                <label className="text-m mr-1 font-bold">
                                  Infants :{" "}
                                </label>
                                <div className="flex items-center gap-x-2">
                                  <button
                                    type="button"
                                    className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                    name="bedrooms"
                                    disabled={familyMembersCount.infants <= 0}
                                    onClick={() =>
                                      handleRoomCountChange("infants", -1)
                                    }
                                  >
                                    <AiOutlineMinusCircle />
                                  </button>
                                  <p>{familyMembersCount.infants}</p>
                                  <button
                                    type="button"
                                    className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                    name="bedrooms"
                                    onClick={() =>
                                      handleRoomCountChange("infants", 1)
                                    }
                                  >
                                    <AiOutlinePlusCircle />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="mt-8">
                              <p className="mb-2 text-gray-500 italic">
                                Select The Date You Want To View The House In!
                              </p>
                              <Space direction="vertical" size={12}>
                                <DatePicker
                                  className="w-full"
                                  showTime
                                  onChange={onChange}
                                  onOk={onOk}
                                />
                              </Space>
                            </div>
                            <button
                              type="button"
                              className="text-white mt-5 bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                              onClick={scheduleListing}
                            >
                              Schedule
                            </button>
                          </div>
                        ) : null}
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
