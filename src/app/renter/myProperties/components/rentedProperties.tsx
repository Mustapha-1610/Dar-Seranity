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
                            Passed ({daysLate} {daysLate === 1 ? "day" : "days"}{" "}
                            late)
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
        </>
      ) : (
        <>No Properties To Display</>
      )}
    </>
  );
}
