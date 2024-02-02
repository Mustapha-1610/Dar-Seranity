"use client";

import renterSocket from "@/Helpers/socketLogic/renterSocket";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

export default function PropertyInformations({
  params,
}: {
  params: { id: string };
}) {
  const [propertyInformations, setPropertyInformations] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [displayedImage, setDisplayedImage] = useState("");
  const [displayScheduledViewings, setDisplayScheduledViewings] =
    useState(false);
  const [displayViewingRequests, setDisplayViewingRequests] = useState(false);
  const [displayPossibleRenters, setDisplayPossibleRenters] = useState(true);
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
        setDisplayedImage(response.propertyListing.propertyImages[0]);
      } else {
        console.log(response);
      }
    };
    if (params.id) {
      console.log(params.id);
      fetchPropertyInformations();
    }
  }, [params]);
  const denyViewing = async (e: any, renterId: any, propertyId: any) => {
    e.preventDefault();
    const res = await fetch("/api/landlord/denyViewing", {
      method: "POST",
      body: JSON.stringify({
        renterId,
        propertyId,
      }),
    });
    const response = await res.json();
    if (response.propertyListing) {
      setPropertyInformations(response.propertyListing);
      renterSocket.emit(
        "refreshRenterNotifications",
        response.renterSocketData
      );
    }
  };
  const acceptViewing = async (
    e: any,
    renterId: any,
    propertyId: any,
    viewingDate: any,
    familyCount: any
  ) => {
    e.preventDefault();
    const res = await fetch("/api/landlord/acceptViewing", {
      method: "POST",
      body: JSON.stringify({
        renterId,
        propertyId,
        viewingDate,
        familyCount,
      }),
    });
    const response = await res.json();
    if (response.propertyListing) {
      setPropertyInformations(response.propertyListing);
      renterSocket.emit(
        "refreshRenterNotifications",
        response.renterSocketData
      );
      const socketObject = response.extraData;
      renterSocket.emit("remindViewing", { socketObject });
    }
  };
  const sendRentalOffer = async (e: any, renterId: any) => {
    try {
      const response = await fetch("/api/landlord/sendRentalOffer", {
        method: "POST",
        body: JSON.stringify({
          renterId,
          propertyId: propertyInformations._id,
        }),
      });
      const res = await response.json();
      if (res.success) {
        setPropertyInformations(res.propertyInformations);
        const renterSocketId = res.renterSocketData;
        renterSocket.emit("refreshRenterNotifications", { renterSocketId });
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const declineRentalOffer = async (e: any, renterId: any) => {
    try {
      const response = await fetch("/api/landlord/declineRentalOffer", {
        method: "POST",
        body: JSON.stringify({
          renterId,
          propertyId: propertyInformations._id,
        }),
      });
      const res = await response.json();
      if (res.success) {
        setPropertyInformations(res.propertyInformations);
        const renterSocketId = res.renterSocketData;
        renterSocket.emit("refreshRenterNotifications", { renterSocketId });
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <section className="overflow-hidden bg-white py-11 font-poppins dark:bg-gray-800">
        <div className="max-w-6xl px-4 py-4 mx-auto lg:py-8 md:px-6">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full mb-8 md:w-1/2 md:mb-0">
              <div className="relative top-0 z-50 overflow-hidden ">
                <div className="relative top-0 z-50 overflow-hidden">
                  <div className="relative mb-6 lg:mb-10 lg:h-2/4 image-wrapper">
                    <img
                      src={displayedImage}
                      alt=""
                      className="object-cover w-full"
                    />
                  </div>
                </div>
                <div className="flex-wrap hidden md:flex ">
                  {propertyInformations?.propertyImages.map(
                    (image: any, index: any) => {
                      return (
                        <div className="w-1/2 p-2 sm:w-1/4" key={index}>
                          <div
                            onClick={() => setDisplayedImage(image)}
                            className="block border border-blue-300 hover:border-blue-300"
                          >
                            <img
                              src={image}
                              alt=""
                              className="object-cover w-full lg:h-20"
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
                <div className="px-6 pb-6 mt-6 border-t border-gray-300 dark:border-gray-400 ">
                  <div className="flex flex-wrap items-center mt-6">
                    <span className="mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="w-4 h-4 text-gray-700 dark:text-gray-400 bi bi-truck"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
                      </svg>
                    </span>
                    <h2 className="text-lg font-bold text-gray-700 dark:text-gray-400">
                      Free Shipping
                    </h2>
                  </div>
                  <div className="mt-2 px-7">
                    <a
                      className="text-sm text-blue-400 dark:text-blue-200"
                      href="#"
                    >
                      Get delivery dates
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2 ">
              <div className="lg:pl-20">
                <div className="mb-8 ">
                  <h2 className="max-w-xl mb-6 text-2xl font-bold dark:text-gray-400 md:text-4xl">
                    {propertyInformations?.title}
                  </h2>
                  <p className="inline-block mb-6 text-4xl font-bold text-gray-700 dark:text-gray-400 ">
                    <span>{propertyInformations?.price}$</span>
                  </p>
                  <p className="max-w-md text-gray-700 dark:text-gray-400">
                    {propertyInformations?.description}
                  </p>
                </div>

                <div className="mb-8">
                  {propertyInformations?.rented.isRented ? (
                    <>
                      <p>Hello</p>
                    </>
                  ) : (
                    <>
                      <div className="mb-8">
                        <h2 className="w-16 pb-1 mb-4 text-xl font-semibold border-b border-blue-300 dark:border-gray-600 dark:text-gray-400">
                          Activity
                        </h2>
                        <div className="flex">
                          <button
                            onClick={() => (
                              setDisplayViewingRequests(false),
                              setDisplayScheduledViewings(false),
                              setDisplayPossibleRenters(true)
                            )}
                            className="px-4 py-2 mb-2 mr-2 font-semibold border rounded-md hover:border-blue-400 hover:text-blue-600 dark:border-gray-400 dark:hover:border-gray-300 dark:text-gray-400"
                          >
                            Possible Renters
                          </button>
                          <button
                            onClick={() => {
                              setDisplayViewingRequests(false),
                                setDisplayPossibleRenters(false),
                                setDisplayScheduledViewings(true);
                            }}
                            className="px-4 py-2 mb-2 mr-2 font-semibold border rounded-md hover:border-blue-400 hover:text-blue-600 dark:border-gray-400 dark:hover:border-gray-300 dark:text-gray-400"
                          >
                            Scheduled Viewings
                          </button>
                          <button
                            onClick={() => {
                              setDisplayPossibleRenters(false),
                                setDisplayScheduledViewings(false),
                                setDisplayViewingRequests(true);
                            }}
                            className="px-4 py-2 mb-2 mr-4 font-semibold border rounded-md hover:border-blue-400 dark:border-gray-400 hover:text-blue-600 dark:hover:border-gray-300 dark:text-gray-400"
                          >
                            Viewing Requests
                          </button>
                        </div>
                      </div>

                      {displayScheduledViewings && (
                        <div className="mt-8 overflow-x-auto">
                          <table className="w-full table-fixed border-collapse">
                            <thead>
                              <tr className="border-b">
                                <th className="w-1/6"></th>
                                <th className="w-1/4">Name</th>
                                <th className="w-1/4">Family Count</th>
                                <th className="w-1/4">Viewing Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {propertyInformations?.scheduledViewings.map(
                                (item: any, index: any) => (
                                  <tr key={index} className="border-b">
                                    <td className="p-2 text-center">
                                      <img
                                        src={item.picture}
                                        alt=""
                                        className="w-full max-h-10 object-contain"
                                      />
                                    </td>
                                    <td className="p-2 text-sm text-center">
                                      {item.renterName}
                                    </td>
                                    <td className="p-2 text-sm text-center">
                                      {" "}
                                      {item?.familyCount}{" "}
                                    </td>
                                    <td className="p-2 text-sm text-center">
                                      {item.viewingDate}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {displayViewingRequests && (
                        <div className="mt-8 overflow-x-auto">
                          <table className="w-full table-fixed border-collapse">
                            <thead>
                              <tr className="border-b">
                                <th className="w-1/6"></th>
                                <th className="w-1/4">Name</th>
                                <th className="w-1/4">Family Count</th>
                                <th className="w-1/4">Scheduling Date</th>
                                <th className="w-1/4">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {propertyInformations?.ViewingRequests.map(
                                (item: any, index: any) => (
                                  <tr key={index} className="border-b">
                                    <td className="p-2 text-center">
                                      <img
                                        src={item.picture}
                                        alt=""
                                        className="w-full max-h-10 object-contain"
                                      />
                                    </td>
                                    <td className="p-2 text-sm text-center">
                                      {item.renterName}
                                    </td>
                                    <td className="p-2 text-sm text-center">
                                      {item.familyCount.adults +
                                        item.familyCount.children +
                                        item.familyCount.infants}
                                    </td>
                                    <td className="p-2 text-sm text-center">
                                      {item.suggestedViewingDate}
                                    </td>
                                    <td className="p-2 text-sm text-center">
                                      <button
                                        onClick={(e) =>
                                          acceptViewing(
                                            e,
                                            item.renterId,
                                            propertyInformations._id,
                                            item.suggestedViewingDate,
                                            item.familyCount.adults +
                                              item.familyCount.children +
                                              item.familyCount.infants
                                          )
                                        }
                                      >
                                        Accept
                                      </button>
                                      <button
                                        onClick={(e) =>
                                          denyViewing(
                                            e,
                                            item.renterId,
                                            propertyInformations._id
                                          )
                                        }
                                      >
                                        Deny
                                      </button>
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {displayPossibleRenters && (
                        <div className="mt-8 overflow-x-auto">
                          <table className="w-full table-fixed border-collapse">
                            <thead>
                              <tr className="border-b">
                                <th className="w-1/6"></th>
                                <th className="w-1/6">Name</th>
                                <th className="w-1/4">Status</th>

                                <th className="w-1/4">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {propertyInformations?.possibleRenters.map(
                                (item: any, index: any) => (
                                  <tr key={index} className="border-b">
                                    <td className="p-2 text-center">
                                      <Image
                                        src={item.renterPicutre}
                                        width={250}
                                        height={250}
                                        alt=""
                                        className="w-full max-h-10 object-contain"
                                      />
                                    </td>
                                    <td className="p-2 text-sm text-center">
                                      {item.renterName}
                                    </td>
                                    <td className="p-2 text-sm text-center">
                                      {item.responseStatus}
                                    </td>
                                    <td className="p-2 text-center">
                                      {item.responseStatus ===
                                      "Awaiting Response" ? (
                                        <></>
                                      ) : (
                                        <>
                                          <button>
                                            <AiOutlineCheckCircle
                                              onClick={(e) =>
                                                sendRentalOffer(
                                                  e,
                                                  item.renterId
                                                )
                                              }
                                              className="text-green-500"
                                              size={24}
                                            />
                                          </button>{" "}
                                          <button>
                                            <AiOutlineCloseCircle
                                              onClick={(e) =>
                                                declineRentalOffer(
                                                  e,
                                                  item.renterId
                                                )
                                              }
                                              className="text-red-500"
                                              size={24}
                                            />
                                          </button>
                                        </>
                                      )}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
