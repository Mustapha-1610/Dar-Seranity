"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Carousel } from "@material-tailwind/react";
import { Spin } from "antd";
import { PiArmchairDuotone } from "react-icons/pi";
import { MdOutlineSoupKitchen } from "react-icons/md";
import { GrRestroom } from "react-icons/gr";
import { IoBedOutline } from "react-icons/io5";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FaFilter } from "react-icons/fa6";
import { LuFilter, LuFilterX } from "react-icons/lu";

export default function Browse() {
  const [cities, setCities] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [selectedCity, setSelectedCity] = useState<any>(undefined);
  const [selectedMunicipality, setSelectedMunicipality] =
    useState<any>(undefined);
  const [propertyListings, setPropertyListings] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [garden, setGarden] = useState(false);
  const [balcony, setBalcony] = useState(false);
  const router = useRouter();
  const fetchAllPropertyListings = async () => {
    const res = await fetch("/api/propertyListing/getAll", {
      method: "POST",
    });
    const response = await res.json();
    if (response.success) {
      setPropertyListings(response.properties);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res: any = await fetch("/api/cities/getAll", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();
        setCities(response.Cities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
    fetchAllPropertyListings();
  }, []);
  const handleCityChange = async (event: any) => {
    setSelectedCity(event.target.value);
    setMunicipalities([]);
    setSelectedMunicipality("");

    if (event.target.value) {
      try {
        const res: any = await fetch("/api/cities/getMunicipality", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cityId: event.target.value,
          }),
        });
        const response = await res.json();
        setMunicipalities(response.municipality);
      } catch (error) {
        console.error("Error fetching municipalities:", error);
      }
    }
  };
  const handleMunicipalityChange = (event: any) => {
    setSelectedMunicipality(event.target.value);
  };
  const filterProperties = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/renter/filterProperties", {
      method: "POST",
      body: JSON.stringify({
        cityId: selectedCity,
        municipalityName: selectedMunicipality,
        garden,
        balcony,
      }),
    });
    const res = await response.json();
    if (res.properties) {
      setPropertyListings(res.properties);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };
  return (
    <>
      <section
        className="min-h-screen bg-cover relative pt-16"
        style={{
          backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/Needs%20For%20Project%2F1706396493971-transformed.png?alt=media&token=8d20b14f-99dc-4fff-a510-27c2701acc55')`,
        }}
      >
        <div className="bg-black bg-opacity-50 min-h-full absolute top-0 right-0 bottom-0 left-0">
          <div className="flex  flex-col items-center mt-4">
            <div className="bg-white p-4 rounded-md shadow-md mb-4 flex items-center gap-x-4 ">
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="select-dropdown"
              >
                <option value="">Select a City</option>
                {cities.map((city: any) => (
                  <option key={city._id} value={city._id}>
                    {city.City}
                  </option>
                ))}
              </select>

              <select
                value={selectedMunicipality}
                onChange={handleMunicipalityChange}
                className="select-dropdown"
              >
                <option>Select a Municipality</option>
                {municipalities.map((municipality) => (
                  <option key={municipality} value={municipality}>
                    {municipality}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-x-2">
                <label className="addon-label">Garden:</label>

                <button
                  type="button"
                  className={`w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border ${
                    !garden ? "bg-red-500 text-white" : "bg-white text-gray-800"
                  } shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
                  name="garden"
                  onClick={() => setGarden(false)}
                >
                  <AiOutlineCloseCircle />
                </button>
                <button
                  type="button"
                  className={`w-6  h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border ${
                    garden
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-800"
                  } shadow-sm  disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
                  name="garden"
                  onClick={() => setGarden(true)}
                >
                  <AiOutlineCheckCircle />
                </button>
              </div>
              <div className="flex items-center gap-x-2">
                <label className="addon-label">Balcony :</label>

                <button
                  type="button"
                  className={`w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border ${
                    !balcony
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-800"
                  } shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
                  name="garden"
                  onClick={() => setBalcony(false)}
                >
                  <AiOutlineCloseCircle />
                </button>
                <button
                  type="button"
                  className={`w-6  h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border ${
                    balcony
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-800"
                  } shadow-sm  disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
                  name="garden"
                  onClick={() => setBalcony(true)}
                >
                  <AiOutlineCheckCircle />
                </button>
              </div>
              <button
                type="button"
                className="flex text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                onClick={filterProperties}
              >
                <LuFilter /> <span className="ml-1">Filter</span>
              </button>
              <button
                onClick={() => (
                  setSelectedCity(""),
                  setSelectedMunicipality(""),
                  setGarden(false),
                  setBalcony(false),
                  fetchAllPropertyListings(),
                  setLoading(true)
                )}
                type="button"
                className=" flex focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                <LuFilterX /> <span className="ml-1">Cancel</span>
              </button>
            </div>
          </div>
          <Spin spinning={loading} delay={350}>
            <div className="flex flex-col justify-center overflow-hidden bg-gray- py-6 sm:py-12">
              <div className="mx-auto px-4 ">
                {propertyListings.length > 0 ? (
                  <>
                    <div className="grid w-full sm:grid-cols-2 xl:grid-cols-4 gap-6">
                      {propertyListings?.map((item: any) => {
                        return (
                          <div key={item._id}>
                            <div className="relative flex flex-col shadow-md rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 max-w-sm">
                              <a
                                href=""
                                className="hover:text-orange-600 absolute z-30 top-2 right-0 mt-2 mr-3"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                  />
                                </svg>
                              </a>
                              <div className="h-auto overflow-hidden">
                                <div className="h-42 relative">
                                  <Carousel
                                    placeholder=""
                                    transition={{ duration: 0.6 }}
                                    className="rounded-xl"
                                  >
                                    {item.propertyImages.map(
                                      (image: any, index: any) => (
                                        <div key={index}>
                                          <Image
                                            height={600}
                                            width={600}
                                            src={image}
                                            onClick={() => {
                                              router.push(
                                                `/renter/rentalPropertyInformations/${item._id}`
                                              );
                                            }}
                                            alt={`image ${index + 1}`}
                                            className="h-48 cursor-pointer w-full object-cover"
                                          />
                                        </div>
                                      )
                                    )}
                                  </Carousel>
                                </div>
                              </div>
                              <div
                                className="bg-white cursor-pointer py-4 px-3"
                                onClick={() => {
                                  router.push(
                                    `/renter/rentalPropertyInformations/${item._id}`
                                  );
                                }}
                              >
                                <h3 className="text-lg  mb-2 font-bold">
                                  {item.title}
                                </h3>
                                <div className="flex justify-center items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <PiArmchairDuotone size={28} />
                                    <span>{item.roomsCount.livingRoom}</span> /
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MdOutlineSoupKitchen size={28} />
                                    <span>{item.roomsCount.kitchen}</span> /
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <GrRestroom size={28} />
                                    <span>{item.roomsCount.restRoom}</span> /
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <IoBedOutline size={28} />
                                    <span>{item.roomsCount.bedRoom}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-white font-bold">
                      No Property Listings To Display
                    </h3>
                  </>
                )}
              </div>
            </div>
          </Spin>
        </div>
      </section>
    </>
  );
}
