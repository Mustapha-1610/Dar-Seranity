"use client";

import { getRenterLocalStorageData } from "@/Helpers/frontFunctions/localStorageHandler";
import { useEffect, useState } from "react";
import { Table } from "antd";
import moment from "moment";
import Column from "antd/es/table/Column";
export default function TransactionHistory() {
  const [renterData, setRenterData] = useState<any>({});
  useEffect(() => {
    setRenterData(getRenterLocalStorageData());
  }, []);
  return (
    <>
      {renterData?.transactionHistory?.length > 0 ? (
        <>
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2 xl:w-full">
            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
              <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
                <div>
                  <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-1">
                    Transaction History
                  </h6>
                </div>
              </div>
              <div className="p-15  px-0 pt-0 pb-2">
                <Table dataSource={renterData?.transactionHistory}>
                  <Column title="To" dataIndex="reciever" key="reciever" />
                  <Column
                    title="Transaction Amount"
                    dataIndex="transactionAmount"
                    key="transactionAmount"
                    render={(text) => {
                      return <span>{text}$</span>;
                    }}
                  />
                  <Column
                    title="Sent On"
                    dataIndex="transactionDate"
                    key="transactionDate"
                    render={(text) => {
                      const dueDate = moment(text);
                      const formattedDate = dueDate.format("MMM D, YYYY");

                      return <span>{formattedDate}</span>;
                    }}
                  />
                  <Column
                    title="For"
                    dataIndex="propety"
                    key="propety"
                    render={(text) => {
                      return <span>{text.propertyTitle}</span>;
                    }}
                  />
                </Table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <p>No Transactions To Display</p>
        </>
      )}
    </>
  );
}
