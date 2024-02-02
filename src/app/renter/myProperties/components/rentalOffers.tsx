"use client";

import {
  getRenterLocalStorageData,
  setLandlordLocalStorageData,
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
          <div className="mt-12">
            <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="w-6 h-6 text-white"
                  >
                    <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
                    <path
                      fillRule="evenodd"
                      d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
                      clipRule="evenodd"
                    ></path>
                    <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
                  </svg>
                </div>
                <div className="p-4 text-right">
                  <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
                    Today's Money
                  </p>
                  <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
                    $53k
                  </h4>
                </div>
                <div className="border-t border-blue-gray-50 p-4">
                  <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                    <strong className="text-green-500">+55%</strong>&nbsp;than
                    last week
                  </p>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2 xl:w-full">
              <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
                <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
                  <div>
                    <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-1">
                      Rented Properties
                    </h6>
                    <p className="antialiased font-sans text-sm leading-normal flex items-center gap-1 font-normal text-blue-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="h-4 w-4 text-blue-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        ></path>
                      </svg>
                      <strong>30 done</strong> this month
                    </p>
                  </div>
                </div>
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
