"use client";

import {
  getRenterLocalStorageData,
  setRenterLocalStorageData,
} from "@/Helpers/frontFunctions/localStorageHandler";
import landlordSocket from "@/Helpers/socketLogic/landlordSocket";
import { Space, Table } from "antd";
import Column from "antd/es/table/Column";
import ColumnGroup from "antd/es/table/ColumnGroup";
import moment from "moment";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function RentalOffers() {
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
      setRenterLocalStorageData(res.responseData);
      setRenterData(res.responseData);
      const landlordSocketData = res.extraData;
      landlordSocket.emit("refLanNotis", landlordSocketData);
    } else {
      console.log(res);
    }
  };
  const router = useRouter();
  return (
    <>
      {renterData?.rentalOffers?.length > 0 ? (
        <>
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2 xl:w-full">
            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
              <div className="p-15  px-0 pt-0 pb-2">
                <Table dataSource={renterData?.rentalOffers}>
                  <ColumnGroup title="Property">
                    <Column
                      title="Title"
                      dataIndex="propertyTitle"
                      key="propertyTitle"
                    />
                    <Column
                      title="Recieved On"
                      dataIndex="sentOn"
                      key="sentOn"
                      render={(text) => {
                        // Use moment to format the date
                        const formattedDate =
                          moment(text).format("MMM D, YYYY");
                        return <span>{formattedDate}</span>;
                      }}
                    />
                    <Column
                      title="Rent"
                      dataIndex="rentingPrice"
                      key="rentingPrice"
                    />
                  </ColumnGroup>
                  <Column
                    title="Action"
                    key="action"
                    render={(_: any, record: any) => (
                      <Space size="middle">
                        <a
                          onClick={() =>
                            router.push(
                              `/renter/paymentPage/${record.propertyId}`
                            )
                          }
                        >
                          Accept{" "}
                        </a>
                        <a
                          onClick={(e) =>
                            declineRentalOffer(e, record.propertyId)
                          }
                        >
                          Decline
                        </a>
                      </Space>
                    )}
                  />{" "}
                </Table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <p>No Rental Offers To Display</p>
        </>
      )}
    </>
  );
}
