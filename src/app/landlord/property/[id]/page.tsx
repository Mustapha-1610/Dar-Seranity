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
                      <div className="bg-gray-100 p-4 rounded-md shadow-md">
                        <h2 className="text-lg font-semibold mb-4">
                          Rent Information
                        </h2>
                        <div className="mb-2">
                          <strong>Earned:</strong> $
                          {propertyInformations.rented.earned}
                        </div>
                        <div className="mb-2">
                          <strong>Rented Since:</strong>{" "}
                          {new Date(
                            propertyInformations.rented.rentedOn
                          ).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Next Payment Due:</strong>{" "}
                          {new Date(
                            propertyInformations.rented.nextPaymentDate
                          ).toLocaleDateString()}
                        </div>
                      </div>
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
