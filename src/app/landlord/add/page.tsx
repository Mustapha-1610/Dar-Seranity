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
import app from "@/Helpers/firebase/firebase";
import TextArea from "antd/es/input/TextArea";
export default function Add() {
  const [countForm, setCountForm] = useState<any>({
    kitchen: 0,
    livingRooms: 0,
    restRooms: 0,
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
  const [packs, setPacks] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [selectedCity, setSelectedCity] = useState<any>(undefined);
  const [selectedPack, setSelectedPack] = useState<any>(undefined);
  const [errorMessage, setErrorMessage] = useState<String>("");
  const [landlordData, setLandlordData] = useState<any>();
  const [options, setOptions] = useState<any>([]);
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

  useEffect(() => {
    if (landlordData) {
      const options = Object.entries(landlordData?.packCount).map(
        ([name, count]) => ({
          value: name,
          label: `${name} (${count})`,
          disabled: count === 0,
        })
      );
      setOptions(options);
    } else {
      setLandlordData(JSON.parse(localStorage.getItem("landlordData")!));
    }

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

    const fetchOffers = async () => {
      try {
        const res: any = await fetch("/api/subscriptionPacks/getAll", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();
        setPacks(response.packNames);
      } catch (error) {
        console.error("Error fetching Packs :", error);
      }
    };

    fetchCities();
    fetchOffers();
  }, [selectedCity, landlordData]);

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
          }),
        });
        const response = await res.json();
        if (response.error) {
          console.log(response.error);
          setErrorMessage(response.error);
        } else if (response.success) {
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching municipalities:", error);
      }
    }
  };

  const handleSelectedPack = (e: any) => {
    setSelectedPack(e.target.value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPack(event.target.value);
  };

  return (
    <>
      <Spin spinning={loading} delay={500}>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        <div className="flex flex-col items-center">
          <select
            value={selectedPack}
            className="m-4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          >
            <option defaultValue={undefined}>Select a Pack</option>
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
        </div>

        <form
          onSubmit={(e) => uploadHouseImages(e, houseImages, "imgUrl")}
          className="mt-4"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label>Title : </label>
              <input
                className="w-80 border-black"
                type="text"
                name="title"
                onChange={(e) => {
                  setCountForm({ ...countForm, title: e.target.value });
                }}
              />
            </div>
            <div>
              <label>Description : </label>
              <TextArea
                name="description"
                onChange={(e) => {
                  setCountForm({ ...countForm, description: e.target.value });
                }}
              />
            </div>
            <div className="flex items-center gap-x-4">
              <br />
              <label className="text-lg">Kitchen</label>
              <div className="flex items-center gap-x-2">
                <button
                  type="button"
                  className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  name="kitchen"
                  disabled={countForm.kitchen <= 0}
                  onClick={() => handleRoomCountChange("kitchen", -1)}
                >
                  <AiOutlineMinusCircle />
                </button>
                <p>{countForm.kitchen}</p>
                <button
                  type="button"
                  className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  name="kitchen"
                  onClick={() => handleRoomCountChange("kitchen", 1)}
                >
                  <AiOutlinePlusCircle />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-x-4">
              <label className="text-lg">Living Rooms</label>
              <div className="flex items-center gap-x-2">
                <button
                  type="button"
                  className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  name="livingRooms"
                  disabled={countForm.livingRooms <= 0}
                  onClick={() => handleRoomCountChange("livingRooms", -1)}
                >
                  <AiOutlineMinusCircle />
                </button>
                <p>{countForm.livingRooms}</p>
                <button
                  type="button"
                  className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  name="livingRooms"
                  onClick={() => handleRoomCountChange("livingRooms", 1)}
                >
                  <AiOutlinePlusCircle />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-x-4">
              <label className="text-lg">Bedrooms</label>
              <div className="flex items-center gap-x-2">
                <button
                  type="button"
                  className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  name="bedrooms"
                  disabled={countForm.bedrooms <= 0}
                  onClick={() => handleRoomCountChange("bedrooms", -1)}
                >
                  <AiOutlineMinusCircle />
                </button>
                <p>{countForm.bedrooms}</p>
                <button
                  type="button"
                  className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  name="bedrooms"
                  onClick={() => handleRoomCountChange("bedrooms", 1)}
                >
                  <AiOutlinePlusCircle />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-x-4">
              <label className="text-lg">Rest Rooms</label>
              <div className="flex items-center gap-x-2">
                <button
                  type="button"
                  className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  name="restRooms"
                  disabled={countForm.restRooms <= 0}
                  onClick={() => handleRoomCountChange("restRooms", -1)}
                >
                  <AiOutlineMinusCircle />
                </button>
                <p>{countForm.restRooms}</p>
                <button
                  type="button"
                  className="w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  name="restRooms"
                  onClick={() => handleRoomCountChange("restRooms", 1)}
                >
                  <AiOutlinePlusCircle />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-x-4">
              <label className="text-lg">Add Ons : </label>
              <br />
              <div className="flex items-center gap-x-2">
                <div className="flex items-center gap-x-4">
                  <label className="addon-label">Balcony:</label>
                  <button
                    type="button"
                    className={`w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border ${
                      !countForm.balcony
                        ? "bg-red-500 text-white"
                        : "bg-white text-gray-800"
                    } shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
                    name="restRooms"
                    onClick={() =>
                      setCountForm({ ...countForm, balcony: false })
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
                      setCountForm({ ...countForm, balcony: true })
                    }
                  >
                    <AiOutlineCheckCircle />
                  </button>
                </div>

                <div className="flex items-center gap-x-2">
                  <label className="addon-label">Garden:</label>

                  <button
                    type="button"
                    className={`w-6 h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border ${
                      !countForm.garden
                        ? "bg-red-500 text-white"
                        : "bg-white text-gray-800"
                    } shadow-sm disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
                    name="garden"
                    onClick={() =>
                      setCountForm({ ...countForm, garden: false })
                    }
                  >
                    <AiOutlineCloseCircle />
                  </button>
                  <button
                    type="button"
                    className={`w-6  h-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border ${
                      countForm.garden
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-800"
                    } shadow-sm  disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
                    name="garden"
                    onClick={() => setCountForm({ ...countForm, garden: true })}
                  >
                    <AiOutlineCheckCircle />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mt-4">
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
          </div>

          <div className="mt-4">
            <input
              type="file"
              multiple
              onChange={handleImageSelection}
              className="block w-full text-sm text-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </Spin>
    </>
  );
}
