"use client";

import { getRenterLocalStorageData } from "@/Helpers/frontFunctions/localStorageHandler";
import { useEffect, useState } from "react";
import { Space, Table } from "antd";
import moment from "moment";
import ColumnGroup from "antd/es/table/ColumnGroup";
import Column from "antd/es/table/Column";
import { useRouter } from "next/navigation";
export default function RentedProperties() {
  const [renterData, setRenterData] = useState<any>({});
  const router = useRouter();
  useEffect(() => {
    setRenterData(getRenterLocalStorageData());
  }, []);
  return (
    <>
      {renterData?.rentedProperties?.length > 0 ? (
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
                    Rent Paid
                  </p>
                  <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
                    {renterData?.totalRentPaid?.total || 0}$
                  </h4>
                </div>
                <div className="border-t border-blue-gray-50 p-4">
                  <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
                    <strong className="text-green-500">Since</strong>&nbsp;
                    {renterData?.totalRentPaid?.since || 0}
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
                  </div>
                </div>
                <div className="p-15  px-0 pt-0 pb-2">
                  <Table dataSource={renterData?.rentedProperties}>
                    <ColumnGroup title="Property">
                      <Column
                        title="Title"
                        dataIndex="propertyTitle"
                        key="propertyTitle"
                      />
                      <Column
                        title="Rented On"
                        dataIndex="rentedOn"
                        key="rentedOn"
                        render={(text) => {
                          // Use moment to format the date
                          const formattedDate =
                            moment(text).format("MMM D, YYYY");
                          return <span>{formattedDate}</span>;
                        }}
                      />
                      <Column
                        title="Rent"
                        dataIndex="price"
                        key="price"
                        render={(text) => <span>{text}$</span>}
                      />
                    </ColumnGroup>
                    <Column
                      title="Rent Due Date"
                      dataIndex="nextPaymentDate"
                      key="nextPaymentDate"
                      render={(text) => {
                        const currentDate = moment();
                        const dueDate = moment(text);

                        // Check if the due date has passed
                        if (dueDate.isBefore(currentDate)) {
                          // The due date has passed
                          const daysLate = currentDate.diff(dueDate, "days");
                          return (
                            <span style={{ color: "red" }}>
                              Passed ({daysLate}{" "}
                              {daysLate === 1 ? "day" : "days"} late)
                            </span>
                          );
                        } else {
                          // The due date has not passed, format it
                          const formattedDate = dueDate.format("MMM D, YYYY");
                          return <span>{formattedDate}</span>;
                        }
                      }}
                    />
                    <Column
                      title="Action"
                      dataIndex="nextPaymentDate"
                      key="nextPaymentDate"
                      render={(text, record: any) => {
                        const currentDate = moment();
                        const dueDate = moment(text);

                        // Check if the due date has passed
                        if (dueDate.isBefore(currentDate)) {
                          // The due date has passed
                          const daysLate = currentDate.diff(dueDate, "days");
                          return (
                            <Space size="middle">
                              <a
                                onClick={() =>
                                  router.push(
                                    `/renter/paymentPage/${record.propertyId}`
                                  )
                                }
                              >
                                Pay Rent{" "}
                              </a>
                            </Space>
                          );
                        } else {
                          // The due date has not passed, format it
                          const formattedDate = dueDate.format("MMM D, YYYY");
                          return <span>Rent Is Not Due Yet</span>;
                        }
                      }}
                    />{" "}
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>No Properties To Display</>
      )}
    </>
  );
}
