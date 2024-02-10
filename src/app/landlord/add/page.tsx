"use client";
import { useState, useEffect } from "react";
import {
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { Spin } from "antd";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useRouter } from "next/navigation";
import app from "@/Helpers/firebase/firebase";
import TextArea from "antd/es/input/TextArea";
import {
  getLandlordLocalStorageData,
  setLandlordLocalStorageData,
} from "@/Helpers/frontFunctions/localStorageHandler";
export default function Add() {
  const [countForm, setCountForm] = useState<any>({
    kitchen: 0,
    livingRooms: 0,
    restRooms: 0,
    price: 0,
    bedrooms: 0,
    garden: false,
    balcony: false,
    title: String,
    description: String,
    houseImagesUrls: [],
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [houseImages, setHouseImages] = useState<any>([]);
  const [cities, setCities] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [selectedCity, setSelectedCity] = useState<any>(undefined);
  const [selectedPack, setSelectedPack] = useState<any>(undefined);
  const [errorMessage, setErrorMessage] = useState<String>("");
  const [options, setOptions] = useState<any>([]);
  const [landlordData, setLandlordData] = useState<any>();
  const router = useRouter();
  const [selectedMunicipality, setSelectedMunicipality] =
    useState<any>(undefined);

  const handleImageSelection = (e: any) => {
    const file: FileList = e.target.files;
    if (file) {
      setHouseImages(file);
    }
  };

  const handleRoomCountChange = (name: string, v: number) => {
    setCountForm((prevCountForm: any) => ({
      ...prevCountForm,
      [name]: prevCountForm[name] + v,
    }));
  };
  const fetchLandlordData = async () => {
    const landlordInfos = getLandlordLocalStorageData();
    const options = Object.entries(landlordInfos.propertyListingsCount).map(
      ([name, count]) => ({
        value: name,
        label: `${name} (${count})`,
        disabled: count === 0,
      })
    );
    setOptions(options);
    setLandlordData(landlordInfos);
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
    fetchLandlordData();
  }, [selectedCity]);

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

  const uploadHouseImages = (e: any, houseImages: any, fileType: any) => {
    e.preventDefault();
    if (!selectedCity || !selectedMunicipality) {
      setErrorMessage("Need To Select Location !");
    } else if (!selectedPack) {
      setErrorMessage(
        "You Need To Select Which Type Of Listing You Are Posting Before Submitting !"
      );
    } else {
      setLoading(true);
      const uploadTasks = [];
      for (let i = 0; i < houseImages.length; i++) {
        const storage = getStorage(app);
        const file = houseImages[i];
        const folder = fileType === "images/landlordImages";
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, folder + fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTasks.push(uploadTask);

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.error("Upload failed for file: " + file.name, error);
          },
          () => {}
        );
      }

      Promise.all(
        uploadTasks.map((task) =>
          task.then((snapshot) => getDownloadURL(snapshot.ref))
        )
      )
        .then((downloadURLs) => {
          console.log("All files uploaded. Download URLs:", downloadURLs);
          setCountForm({
            ...countForm,
            houseImagesUrls: downloadURLs,
          });
          handleFormSubmission(downloadURLs);
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
        });
    }
  };

  const handleFormSubmission = async (downloadURLs: any) => {
    if (!selectedCity || !selectedMunicipality) {
      setErrorMessage("Need To Select Location !");
    } else {
      try {
        const res: any = await fetch("/api/landlord/createPropertyListing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: countForm.title,
            description: countForm.description,
            cityId: selectedCity,
            municipalityName: selectedMunicipality,
            imageUrls: downloadURLs,
            kitchenCount: countForm.kitchen,
            livingRoomCount: countForm.livingRooms,
            restRoomCount: countForm.restRooms,
            bedroomCount: countForm.bedrooms,
            garden: countForm.garden,
            balcony: countForm.balcony,
            chosenPack: selectedPack,
            price: countForm.price,
          }),
        });
        const response = await res.json();
        if (response.error) {
          console.log(response.error);
          setErrorMessage(response.error);
        } else if (response.success) {
          setLandlordLocalStorageData(response.responseData);
          router.push("/landlord");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching municipalities:", error);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPack(event.target.value);
  };

  return (
    <>
      {landlordData?.propertyListingsCount.Gold > 0 ||
      landlordData?.propertyListingsCount.Silver > 0 ||
      landlordData?.propertyListingsCount.Basic > 0 ? (
        <>
          <Spin spinning={loading} delay={500}>
            <form onSubmit={(e) => uploadHouseImages(e, houseImages, "imgUrl")}>
              <div className="min-h-screen bg-gray-900 py-12 flex flex-col justify-center sm:py-16">
                <div className="relative py-3 max-w-2xl mx-auto">
                  <div className="relative px-8 py-12 bg-white mx-8 md:mx-auto shadow rounded-3xl sm:p-10">
                    <div className="max-w-md mx-auto">
                      <div className="flex items-center space-x-5">
                        <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                          <h2 className="leading-relaxed">
                            Create a Property Listing
                          </h2>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                          <div className="flex flex-col">
                            {errorMessage && (
                              <div className="text-red-500">{errorMessage}</div>
                            )}
                            <div className="flex flex-col">
                              <label className="leading-loose">
                                Select a Pack
                              </label>
                              <div className="relative">
                                <select
                                  value={selectedPack}
                                  onChange={handleChange}
                                  className="mb-3 block appearance-none w-full bg-white border border-gray-300 text-gray-600 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                >
                                  <option defaultValue={undefined}>
                                    Choose A Certain Pack
                                  </option>
                                  {options.map((option: any) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                      disabled={option.disabled}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                                  <svg
                                    className="w-4 h-4 fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fill-rule="evenodd"
                                      d="M14.293 5.293a1 1 0 0 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L10 10.586l4.293-4.293z"
                                    ></path>
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <label className="leading-loose">Title </label>
                            <input
                              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              type="text"
                              placeholder="Property Title"
                              name="title"
                              onChange={(e) => {
                                setCountForm({
                                  ...countForm,
                                  title: e.target.value,
                                });
                              }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="leading-loose">
                              Description{" "}
                            </label>
                            <textarea
                              name="description"
                              onChange={(e) => {
                                setCountForm({
                                  ...countForm,
                                  description: e.target.value,
                                });
                              }}
                              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              placeholder="Optional"
                            />
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="flex flex-col">
                              <label className="leading-loose">
                                Room Count
                              </label>
                              <div className="relative focus-within:text-gray-600 text-gray-400">
                                <div className="flex items-center gap-x-4">
                                  <label className="text-lg">Bedrooms</label>
                                  <div className="flex items-center gap-x-2">
                                    <button
                                      type="button"
                                      className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                      name="bedrooms"
                                      disabled={countForm.bedrooms <= 0}
                                      onClick={() =>
                                        handleRoomCountChange("bedrooms", -1)
                                      }
                                    >
                                      <AiOutlineMinusCircle />
                                    </button>
                                    <p>{countForm.bedrooms}</p>
                                    <button
                                      type="button"
                                      className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                      name="bedrooms"
                                      onClick={() =>
                                        handleRoomCountChange("bedrooms", 1)
                                      }
                                    >
                                      <AiOutlinePlusCircle />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <label className="leading-loose">. </label>
                              <div className="relative focus-within:text-gray-600 text-gray-400">
                                <div className="flex items-center gap-x-4">
                                  <label className="text-lg">Rest Rooms</label>
                                  <div className="flex items-center gap-x-2">
                                    <button
                                      type="button"
                                      className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                      name="restRooms"
                                      disabled={countForm.restRooms <= 0}
                                      onClick={() =>
                                        handleRoomCountChange("restRooms", -1)
                                      }
                                    >
                                      <AiOutlineMinusCircle />
                                    </button>
                                    <p>{countForm.restRooms}</p>
                                    <button
                                      type="button"
                                      className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                      name="restRooms"
                                      onClick={() =>
                                        handleRoomCountChange("restRooms", 1)
                                      }
                                    >
                                      <AiOutlinePlusCircle />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="flex flex-col">
                              <div className="relative focus-within:text-gray-600 text-gray-400">
                                <div className="mr-5 flex items-center gap-x-4">
                                  <label className="text-lg">Kitchen</label>
                                  <div className="flex items-center gap-x-2">
                                    <button
                                      type="button"
                                      className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                      name="kitchen"
                                      disabled={countForm.kitchen <= 0}
                                      onClick={() =>
                                        handleRoomCountChange("kitchen", -1)
                                      }
                                    >
                                      <AiOutlineMinusCircle />
                                    </button>
                                    <p>{countForm.kitchen}</p>
                                    <button
                                      type="button"
                                      className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                      name="kitchen"
                                      onClick={() =>
                                        handleRoomCountChange("kitchen", 1)
                                      }
                                    >
                                      <AiOutlinePlusCircle />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <div className="relative focus-within:text-gray-600 text-gray-400">
                                <div className="flex items-center gap-x-4">
                                  <label className="text-lg">
                                    Living Rooms
                                  </label>
                                  <div className="flex items-center gap-x-2">
                                    <button
                                      type="button"
                                      className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                      name="livingRooms"
                                      disabled={countForm.livingRooms <= 0}
                                      onClick={() =>
                                        handleRoomCountChange("livingRooms", -1)
                                      }
                                    >
                                      <AiOutlineMinusCircle />
                                    </button>
                                    <p>{countForm.livingRooms}</p>
                                    <button
                                      type="button"
                                      className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                      name="livingRooms"
                                      onClick={() =>
                                        handleRoomCountChange("livingRooms", 1)
                                      }
                                    >
                                      <AiOutlinePlusCircle />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex flex-col">
                              <div className="relative focus-within:text-gray-600 text-gray-400">
                                <div className="mr-5 flex items-center gap-x-4">
                                  <label className="text-lg">Balcony</label>
                                  <div className="flex items-center gap-x-2">
                                    <button
                                      type="button"
                                      className={`mr-5 w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border ${
                                        !countForm.balcony
                                          ? "bg-red-500 text-white"
                                          : "bg-white text-gray-800"
                                      } shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
                                      name="restRooms"
                                      onClick={() =>
                                        setCountForm({
                                          ...countForm,
                                          balcony: false,
                                        })
                                      }
                                    >
                                      <AiOutlineCloseCircle />
                                    </button>{" "}
                                    <button
                                      type="button"
                                      className={`w-6  h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border ${
                                        countForm.balcony
                                          ? "bg-green-500 text-white"
                                          : "bg-white text-gray-800"
                                      } shadow-sm  disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
                                      name="restRooms"
                                      onClick={() =>
                                        setCountForm({
                                          ...countForm,
                                          balcony: true,
                                        })
                                      }
                                    >
                                      <AiOutlineCheckCircle />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <div className="relative focus-within:text-gray-600 text-gray-400">
                                <div className="mr-5 flex items-center gap-x-4">
                                  <label className="text-lg">Garden</label>
                                  <div className="flex items-center gap-x-2">
                                    <button
                                      type="button"
                                      className={`mr-5 w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border ${
                                        !countForm.garden
                                          ? "bg-red-500 text-white"
                                          : "bg-white text-gray-800"
                                      } shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
                                      name="garden"
                                      onClick={() =>
                                        setCountForm({
                                          ...countForm,
                                          garden: false,
                                        })
                                      }
                                    >
                                      <AiOutlineCloseCircle />
                                    </button>{" "}
                                    <button
                                      type="button"
                                      className={`w-6  h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border ${
                                        countForm.garden
                                          ? "bg-green-500 text-white"
                                          : "bg-white text-gray-800"
                                      } shadow-sm  disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
                                      name="garden"
                                      onClick={() =>
                                        setCountForm({
                                          ...countForm,
                                          garden: true,
                                        })
                                      }
                                    >
                                      <AiOutlineCheckCircle />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="leading-loose">Price</label>
                            <input
                              type="text"
                              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              placeholder="Property Price"
                              name="price"
                              onChange={(e) => {
                                setCountForm({
                                  ...countForm,
                                  price: e.target.value,
                                });
                              }}
                            />
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="mr-8 flex flex-col">
                              <label className="leading-loose">City</label>
                              <select
                                value={selectedCity}
                                onChange={handleCityChange}
                                className="pr-4 pl-10 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              >
                                <option value="">Select a City</option>
                                {cities.map((city: any) => (
                                  <option key={city._id} value={city._id}>
                                    {city.City}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex flex-col">
                              <label className="leading-loose">
                                Municipality
                              </label>
                              <select
                                value={selectedMunicipality}
                                onChange={handleMunicipalityChange}
                                className="pr-4 pl-10 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                              >
                                <option>Select a Municipality</option>
                                {municipalities.map((municipality) => (
                                  <option
                                    key={municipality}
                                    value={municipality}
                                  >
                                    {municipality}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Select Images
                          </label>
                          <div className="mt-1 flex items-center">
                            <label className="w-full flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 rounded-md cursor-pointer focus:outline-none focus:border-blue-500">
                              <svg
                                className="w-5 h-5 mr-2 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                ></path>
                              </svg>
                              {houseImages.length > 0 ? (
                                <p className="ml-3 text-sm text-gray-500">
                                  {houseImages.length} image(s) selected
                                </p>
                              ) : (
                                <>Browse</>
                              )}

                              <input
                                type="file"
                                multiple
                                onChange={handleImageSelection}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <div className="pt-4 flex items-center space-x-4">
                          <button className="bg-red-400 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none">
                            <svg
                              className="w-6 h-6 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>{" "}
                            Cancel
                          </button>
                          <button className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none">
                            Create
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Spin>
        </>
      ) : (
        <h1>
          You Cannot Create Anymore Rental Listings Until You Subscribe To A
          Package !
        </h1>
      )}
    </>
  );
}
