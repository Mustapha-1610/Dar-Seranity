"use client";

import {
  getLandlordLocalStorageData,
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
export default function Dashboard() {
  const [renterData, setRenterData] = useState<any>(undefined);
  const [properties, setProperties] = useState<any>([]);
  const [landlordData, setLandlordData] = useState<any>({});
  useEffect(() => {
    setLandlordData(getLandlordLocalStorageData());
  }, []);

  const router = useRouter();
  return (
    <>
      {landlordData?.transactions.length > 0 ? (
        <>
          <div className="mt-12">
            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2 xl:w-full">
              <div className=" relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
                <div className="p-15  px-0 pt-0 pb-2">
                  <Table
                    dataSource={landlordData?.transactions}
                    pagination={{
                      pageSize: 7, // Number of items per page
                    }}
                  >
                    <Column title="Title" dataIndex="title" key="title" />
                    <Column
                      title="Recieved Amount"
                      dataIndex="recievedAmount"
                      key="recievedAmount"
                      render={(text) => {
                        return <span>{text}$</span>;
                      }}
                    />
                    <Column
                      title="Recieved From"
                      dataIndex="recievedFrom"
                      key="recievedFrom"
                      render={(text) => {
                        return <span>{text}</span>;
                      }}
                    />
                    <Column
                      title="Recieved On"
                      dataIndex="recievedOn"
                      key="recievedOn"
                      render={(text) => {
                        // Use moment to format the date
                        const formattedDate = moment(text.rentedOn).format(
                          "MMM D, YYYY"
                        );
                        return <span>{formattedDate}</span>;
                      }}
                    />
                    <Column
                      title="Property"
                      dataIndex="propertyInformations"
                      key="propertyInformations"
                      render={(text) => {
                        return <span>{text?.propertyTitle}</span>;
                      }}
                    />
                    <Column
                      title="Discount On Transaction Fee"
                      dataIndex="propertyInformations"
                      key="propertyInformations"
                      render={(text) => {
                        return <span>{text.transactionFee}%</span>;
                      }}
                    />
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <p>No Transactions Occured Yet</p>
        </>
      )}
    </>
  );
}
