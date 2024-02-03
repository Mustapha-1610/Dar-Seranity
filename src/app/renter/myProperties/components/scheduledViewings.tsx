"use client";

import {
  getRenterLocalStorageData,
} from "@/Helpers/frontFunctions/localStorageHandler";
import { useEffect, useState } from "react";
import {  Table } from "antd";
import moment from "moment";
import ColumnGroup from "antd/es/table/ColumnGroup";
import Column from "antd/es/table/Column";
export default function ScheduledViewings() {
  const [renterData, setRenterData] = useState<any>({});
  useEffect(() => {
    setRenterData(getRenterLocalStorageData());
  }, []);
  return (
    <>
      {renterData?.viewingSchedules?.length > 0 ? (
        <>
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2 xl:w-full">
            <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
              <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
                <div>
                  <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-1">
                    Scheduled Viewings
                  </h6>
                </div>
              </div>
              <div className="p-15  px-0 pt-0 pb-2">
                <Table dataSource={renterData?.viewingSchedules}>
                  <ColumnGroup title="Property">
                    <Column
                      title="Title"
                      dataIndex="propertyTitle"
                      key="propertyTitle"
                    />
                  </ColumnGroup>
                  <Column
                    title="Scheduled For"
                    dataIndex="scheduledFor"
                    key="scheduledFor"
                    render={(text) => {
                      const currentDate = moment();
                      const dueDate = moment(text);

                      // Check if the due date has passed
                      if (dueDate.isBefore(currentDate)) {
                        // The due date has passed
                        return <span style={{ color: "red" }}>Passed</span>;
                      } else {
                        // The due date has not passed, format it
                        const formattedDate = dueDate.format("MMM D, YYYY");
                        return <span>{formattedDate}</span>;
                      }
                    }}
                  />
                </Table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <p>No Scheduled Viewings To Display</p>
        </>
      )}
    </>
  );
}
