"use client";

import {
  getRenterLocalStorageData,
  setRenterLocalStorageData,
} from "@/Helpers/frontFunctions/localStorageHandler";
import { useEffect, useState } from "react";
import { Space, Table } from "antd";
import moment from "moment";
import ColumnGroup from "antd/es/table/ColumnGroup";
import Column from "antd/es/table/Column";
import { useRouter } from "next/navigation";
import { Button, Modal } from "antd";
import type { DatePickerProps } from "antd";
import { DatePicker } from "antd";
import { Spin } from "antd";
import landlordSocket from "@/Helpers/socketLogic/landlordSocket";
import renterSocket from "@/Helpers/socketLogic/renterSocket";

export default function RentedProperties() {
  const [renterData, setRenterData] = useState<any>({});
  const [modal2Open, setModal2Open] = useState(false);
  const [vacationDate, setVacationDate] = useState<String>();
  const [loading, setLoading] = useState<boolean>(false);

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setVacationDate(dateString);
  };
  const router = useRouter();
  const vacateHouse = async (e: any, propertyId: any) => {
    try {
      e.preventDefault();
      console.log(propertyId, vacationDate);
      const response = await fetch("/api/renter/vecateHouse", {
        method: "POST",
        body: JSON.stringify({
          propertyId,
          vacationDate,
        }),
      });
      const res = await response.json();
      console.log(res);
      if (res.success) {
        setRenterLocalStorageData(res.responseData);
        setRenterData(res.responseData);
        const landlordSocketId = res.extraData.landlordSocketData;
        const scheduledJobId = res.extraData.scheduledJobId;
        renterSocket.emit("cancelRentReminder", scheduledJobId);
        landlordSocket.emit("refLanNotis", landlordSocketId);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
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
                    render={(text, record: any) => {
                      if (record.vacating) {
                        return <p>Vacate On {record.vacatingOn}</p>;
                      }
                      const currentDate = moment();
                      const dueDate = moment(text);
                      if (dueDate.isBefore(currentDate)) {
                        const daysLate = currentDate.diff(dueDate, "days");
                        return (
                          <span style={{ color: "red" }}>
                            Passed ({daysLate} {daysLate === 1 ? "day" : "days"}{" "}
                            late)
                          </span>
                        );
                      } else {
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
                      if (record.vacating) {
                        return <p>Vacate On {record.vacatingOn}</p>;
                      }
                      const currentDate = moment();
                      const dueDate = moment(text);
                      if (dueDate.isBefore(currentDate)) {
                        return (
                          <Space size="middle">
                            <a
                              onClick={() =>
                                router.push(
                                  `/renter/payRent/${record.propertyId}`
                                )
                              }
                            >
                              Pay Rent{" "}
                            </a>
                          </Space>
                        );
                      } else {
                        const formattedDate = dueDate.format("MMM D, YYYY");
                        return (
                          <span>Rent Is Not Due Yet , {formattedDate}</span>
                        );
                      }
                    }}
                  />{" "}
                  <Column
                    title="Vacate"
                    render={(record: any) => {
                      if (record.vacating) {
                        return <p>Vacate On {record.vacatingOn}</p>;
                      }
                      return (
                        <Space size="middle">
                          <Button onClick={() => setModal2Open(true)}>
                            Vacate
                          </Button>
                          <Modal
                            title="Vertically centered modal dialog"
                            centered
                            visible={modal2Open} // "open" attribute is deprecated, use "visible" instead
                            onCancel={() => setModal2Open(false)}
                            footer={[
                              <Button
                                key="submit"
                                style={{
                                  backgroundColor: "green",
                                  color: "white",
                                }}
                                onClick={(e) => (
                                  setModal2Open(false),
                                  vacateHouse(e, record.propertyId)
                                )}
                              >
                                Confirm
                              </Button>,
                              <Button
                                key="back"
                                onClick={() => setModal2Open(false)}
                                style={{
                                  backgroundColor: "red",
                                  color: "white",
                                }}
                              >
                                Cancel
                              </Button>,
                            ]}
                          >
                            <Space direction="vertical">
                              <DatePicker onChange={onChange} />
                            </Space>
                          </Modal>
                        </Space>
                      );
                    }}
                  />
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
