"use client";
import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
export default function SubscriptionFunction() {
  const [subscriptionPacks, setSubscriptionPacks] = useState([]);
  const [landlordData, setLandlordData] = useState<any>(undefined);
  const [remainingPackCount, setRemainingPackCount] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const getSubscriptionPacks = async () => {
      try {
        const res: any = await fetch("/api/subscriptionPacks/getAll", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();
        if (response.packNames!) {
          setSubscriptionPacks(response.packNames);
        } else {
        }
      } catch (err) {
        console.log(err);
      }
    };
    const getLandlordData = async () => {
      try {
        const res: any = await fetch("/api/landlord/getData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();
        if (response.responseData) {
          setLandlordData(response.responseData);
          const count: any = Object.entries(
            response.responseData.propertyListingsCount
          ).map(([name, count]) => ({
            value: name,
            label: `${name} : ${count}`,
            disabled: count === 0,
          }));
          setRemainingPackCount(count);
        } else {
          console.log(response);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getLandlordData();
    getSubscriptionPacks();
  }, []);
  return (
    <>
      <section
        className="grid bg-opacity-500 h-screen place-content-center bg-cover bg-center text-slate-300 relative"
        style={{
          backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/Needs%20For%20Project%2F6242715.jpg?alt=media&token=cb6ca215-a242-4726-b40c-0081a93773fd')`,
          backgroundSize: "cover",
        }}
      >
        <div className="flex min-h-screen pt-[30px] px-[40px]">
          <div className="min-w-full">
            <p className="text-white text-2xl font-semibold mb-4">
              Your Packages Count :
            </p>

            <div className="flex space-x-4 mb-5">
              {remainingPackCount?.map((option: any) => (
                <div
                  key={option.value}
                  className="bg-white p-3 rounded-lg text-black font-bold"
                >
                  <option
                    value={option.value}
                    disabled={option.disabled}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </option>
                </div>
              ))}
            </div>
            <div className="min-w-full">
              <p className="text-white text-2xl font-semibold mb-4">
                Our Offers :
              </p>
            </div>
            <div className="grid grid-cols-3 gap-8">
              {subscriptionPacks.map((item: any, index) => (
                <div
                  key={item._id}
                  className="w-full bg-white rounded-lg shadow-md border border-gray-200 divide-y"
                >
                  <div className="pt-[40px] px-[45px] pb-[34px]">
                    <div className="flex justify-end">
                      <div className="bg-[#F6F6F7] rounded-[20px] flex justify-center align-center px-[12px]">
                        <p className="text-[#00153B] text-[12px] leading-[28px] font-bold">
                          {item?.name}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[#00153B] text-[19px] leading-[24px] font-bold">
                        Price
                      </p>
                      <p className="text-[#00153B] text-[50px] leading-[63px] font-bold">
                        {item.price}
                      </p>
                    </div>

                    <div></div>
                  </div>

                  <div className="pt-[25px] px-[25px] pb-[35px]">
                    <div>
                      {item.additions.map((addition: any, index: undefined) => (
                        <div key={index} className="flex items-center mb-2">
                          <span className="text-green-500 mr-2">
                            <FaCheck />
                          </span>
                          <p className="text-black text-[14px] leading-[24px] font-bold">
                            {addition}
                          </p>
                        </div>
                      ))}
                      {item.negatives.map((negative: any, index: undefined) => (
                        <div key={index} className="flex items-center mb-2">
                          <span className="text-red-500 mr-2">
                            <FaTimes />
                          </span>
                          <p className="text- text-[14px] leading-[24px] font-medium">
                            {negative}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-[25px]">
                      <button
                        onClick={() => {
                          router.push(`/landlord/checkoutPage/${item._id}`);
                        }}
                        className={`rounded-[5px] py-[15px] px-[25px] text-[14px] leading-[17px] font-semibold ${
                          item.name === "Gold"
                            ? "bg-yellow-500 text-black"
                            : item.name === "Silver"
                            ? "bg-gray-300 text-gray-900"
                            : "bg-blue-300 text-black"
                        }`}
                      >
                        {item.name === "Gold"
                          ? "Premium"
                          : item.name === "Silver"
                          ? "Standard"
                          : "Basic"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
