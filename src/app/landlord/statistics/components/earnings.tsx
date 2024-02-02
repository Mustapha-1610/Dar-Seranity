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
export default function Earnings() {
  const [renterData, setRenterData] = useState<any>(undefined);
  const [properties, setProperties] = useState<any>([]);
  const [landlordData, setLandlordData] = useState<any>({});
  useEffect(() => {
    const fetchProperties = async () => {
      const response = await fetch("/api/landlord/getRentedProperties", {
        method: "POST",
      });
      const res = await response.json();
      if (res.success) {
        setProperties(res.propertyListing);
        console.log(properties);
      }
    };
    fetchProperties();
    setLandlordData(getLandlordLocalStorageData());
  }, []);

  const router = useRouter();
  return (
    <>
      {properties?.length > 0 ? (
        <>
          <div className="mt-12">
            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2 xl:w-full">
              <div className=" relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
                <div className="p-15  px-0 pt-0 pb-2">
                  <Table
                    dataSource={properties}
                    pagination={{
                      pageSize: 7, // Number of items per page
                    }}
                  >
                    <Column title="Title" dataIndex="title" key="title" />
                    <Column
                      title="Created"
                      dataIndex="createdAt"
                      key="createdAt"
                      render={(text) => {
                        // Use moment to format the date
                        const formattedDate =
                          moment(text).format("MMM D, YYYY");
                        return <span>{formattedDate}</span>;
                      }}
                    />
                    <Column
                      title="Generated"
                      dataIndex="rented"
                      key="rented"
                      render={(text) => {
                        return <span>{text.earned}$</span>;
                      }}
                    />
                    <Column
                      title="Rented On"
                      dataIndex="rented"
                      key="rented"
                      render={(text) => {
                        // Use moment to format the date
                        const formattedDate = moment(text.rentedOn).format(
                          "MMM D, YYYY"
                        );
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
          <p>Earnings</p>
        </>
      )}
    </>
  );
}
