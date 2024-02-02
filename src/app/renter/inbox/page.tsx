"use client";

import {
  getRenterLocalStorageData,
  setLandlordLocalStorageData,
} from "@/Helpers/frontFunctions/localStorageHandler";
import landlordSocket from "@/Helpers/socketLogic/landlordSocket";
import { useEffect, useState } from "react";

export default function Inbox() {
  const [renterData, setRenterData] = useState<any>(undefined);
  useEffect(() => {
    setRenterData(getRenterLocalStorageData());
  }, []);
  const declineRentalOffer = async (e: any, propertyId: any) => {
    const response = await fetch("/api/renter/declineRentingOffer", {
      method: "POST",
      body: JSON.stringify({
        propertyId,
      }),
    });
    const res = await response.json();
    if (res.success) {
      setLandlordLocalStorageData(res.responseData);
      setRenterData(getRenterLocalStorageData());
      const landlordSocketData = res.extraData;
      landlordSocket.emit("refLanNotis", landlordSocketData);
    } else {
      console.log(res);
    }
  };
  return (
    <>
      {renterData?.rentalOffers.length > 0 ? (
        <>
          {renterData?.rentalOffers.map((item: any, index: any) => {
            return (
              <div key={index}>
                <p>Title : {item.propertyTitle}</p>
                <p>Rental Price : {item.rentingPrice}</p>
                <button>Accept </button> <button>Decline</button>
              </div>
            );
          })}
        </>
      ) : (
        <>
          {" "}
          <p>No Rental Offers To Display</p>
        </>
      )}
    </>
  );
}
