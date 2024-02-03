"use client";

import {
  getRenterLocalStorageData,
  setRenterLocalStorageData,
} from "@/Helpers/frontFunctions/localStorageHandler";
import landlordSocket from "@/Helpers/socketLogic/landlordSocket";
import { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import moment from "moment";
import ColumnGroup from "antd/es/table/ColumnGroup";
import Column from "antd/es/table/Column";
import { useRouter } from "next/navigation";
export default function SavedProperties() {
  const [renterData, setRenterData] = useState<any>({});
  useEffect(() => {
    setRenterData(getRenterLocalStorageData());
  }, []);
  const unsaveProperty = async (e: any, propertyInformationsId: any) => {
    try {
      e.preventDefault();
      const response = await fetch("/api/renter/unsaveProperty", {
        method: "POST",
        body: JSON.stringify({
          propertyId: propertyInformationsId,
        }),
      });
      const res = await response.json();
      console.log(res);
      if (res.success) {
        setRenterLocalStorageData(res.responseData);
        setRenterData(res.responseData);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const router = useRouter();
  return (
    <>
      {renterData?.savedRentalProperties?.length > 0 ? (
        <>
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2 xl:w-full">
            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
              <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
                <div>
                  <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-1">
                    Saved Properties
                  </h6>
                </div>
              </div>
              <div className="p-15  px-0 pt-0 pb-2">
                <Table dataSource={renterData?.savedRentalProperties}>
                  <ColumnGroup title="Property">
                    <Column
                      title="Title"
                      dataIndex="propertyTitle"
                      key="propertyTitle"
                    />
                    <Column
                      title="Description"
                      dataIndex="propertyDescription"
                      key="propertyDescription"
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
                              `/renter/rentalPropertyInformations/${record.propertyId}`
                            )
                          }
                        >
                          Check{" "}
                        </a>
                        <a
                          onClick={(e) => unsaveProperty(e, record.propertyId)}
                        >
                          Unsave
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
          <div className="flex items-center justify-center h-full">
            <div className="bg-red-200 p-4 rounded-md shadow-md">
              <p className="text-red-600">No Saved Properties To Display</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
