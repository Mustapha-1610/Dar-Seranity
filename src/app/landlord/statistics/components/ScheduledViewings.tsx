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
export default function ScheduledViewings() {
  const [renterData, setRenterData] = useState<any>(undefined);
  const [properties, setProperties] = useState<any>([]);
  const [landlordData, setLandlordData] = useState<any>({});
  useEffect(() => {
    setLandlordData(getLandlordLocalStorageData());
  }, []);

  const router = useRouter();
  return (
    <>
      {landlordData?.scheduledViewings.length > 0 ? (
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
                      title="Customer Name"
                      dataIndex="renterName"
                      key="renterName"
                      render={(text) => {
                        return <span>{text}</span>;
                      }}
                    />
                    <Column
                      title="For Property"
                      dataIndex="propertyTitle"
                      key="propertyTitle"
                      render={(text, record: any) => {
                        return (
                          <span
                            className="cursor-pointer"
                            onClick={() =>
                              router.push(
                                `/landlord/property/${record.renterId}`
                              )
                            }
                          >
                            {text}
                          </span>
                        );
                      }}
                    />
                    <Column
                      title="Scheduled For"
                      dataIndex="scheduledFor"
                      key="scheduledFor"
                      render={(text) => {
                        // Use moment to format the date
                        const formattedDate =
                          moment(text).format("MMM D, YYYY");
                        return <span>{formattedDate}</span>;
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
