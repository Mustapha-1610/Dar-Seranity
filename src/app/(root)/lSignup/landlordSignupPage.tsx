"use client";
import React, { useEffect } from "react";
import { Alert, Button } from "@material-tailwind/react";
import { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { IconAlert } from "@/components/alerts/Alert";
import { IconSuccess } from "@/components/alerts/Alert";
import { Spin } from "antd";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "@/Helpers/firebase/firebase";
import Image from "next/image";
export default function LandlordSignupPage() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [signupForm, setForm] = useState({
    name: null,
    surname: null,
    email: null,
    password: null,
    idCardFront: "",
    idCardBack: "",
  });
  const handleFormChange = (e: any) => {
    setForm({
      ...signupForm,
      [e.target.name]: e.target.value,
    });
  };
  const [idFrontPrec, setIdFrontPrec] = useState(0);
  const [idBackPrec, setIdBackPrec] = useState(0);
  const [idFrontImage, setIdFrontImage] = useState("");
  const [idBackImage, setIdBackImage] = useState(null);
  const [idFrontUrl, setIdFrontUrl] = useState("");
  const [idBackUrl, setIdBackUrl] = useState("");
  const handleImageUpload = (e: any) => {
    open && setOpen(false);
    openSuccess && setOpenSuccess(false);
    e.preventDefault();
    if (!idFrontImage && !idBackImage) {
      setErrorMessage("Both Id Pictes Are Required For Account Submission");
      setOpen(true);
    } else if (idFrontImage || !idBackImage) {
      setOpen(false);
      setOpenSuccess(false);
      errorMessage ? setErrorMessage("") : null;
      uploadFrontIdCardImage(idFrontImage, "imgUrl");
      uploadBackIdCardImage(idBackImage, "imgUrl");
    }
  };
  const uploadFrontIdCardImage = (file: any, fileType: any) => {
    const storage = getStorage(app);
    const folder = fileType === "images/landlordImages";
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, folder + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        fileType === setIdFrontPrec(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;

          default:
            break;
        }
      },
      (error) => {
        console.log(error);
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            console.log(error);
            break;
          case "storage/canceled":
            // User canceled the upload
            break;
          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
          default:
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          signupForm.idCardFront = downloadURL.toString();
          handleFormSubmission();
        });
      }
    );
  };
  const uploadBackIdCardImage = (file: any, fileType: any) => {
    const storage = getStorage(app);
    const folder = fileType === "images/landlordImages";
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, folder + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        fileType === setIdBackPrec(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;

          default:
            break;
        }
      },
      (error) => {
        console.log(error);
        switch (error.code) {
          case "storage/unauthorized":
            console.log(error);
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
          default:
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          signupForm.idCardBack = downloadURL.toString();
          handleFormSubmission();
        });
      }
    );
  };
  const handleFormSubmission = async () => {
    if (signupForm.idCardBack && signupForm.idCardFront) {
      setLoading(true);
      setOpen(false);
      setOpenSuccess(false);
      const res: any = await fetch("/api/landlord/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupForm.name,
          surname: signupForm.surname,
          email: signupForm.email,
          password: signupForm.password,
          idCardFrontSideImage: signupForm.idCardFront,
          idCardBackSideImage: signupForm.idCardBack,
        }),
      });
      const data = await res.json();
      data.error
        ? (setErrorMessage(data.error), setOpen(true))
        : (setSuccessMessage(data.success), setOpenSuccess(true));
      setForm({
        ...signupForm,
        idCardFront: "",
        idCardBack: "",
      });
      setLoading(false);
    } else {
    }
  };
  useEffect(() => {}, [signupForm.idCardFront, signupForm.idCardBack]);
  const onChangeIdFrontImage = (e: any) => {
    e.preventDefault();
    const file: any = e.target.files?.[0];
    if (file) {
      setIdFrontImage(file);
      const imagePath = window.webkitURL.createObjectURL(file);
      setIdFrontUrl(imagePath);
    }
  };
  const onChangeIBackImage = (e: any) => {
    e.preventDefault();
    const file: any = e.target.files?.[0];
    if (file) {
      setIdBackImage(file);
      const imagePath = window.webkitURL.createObjectURL(file);
      setIdBackUrl(imagePath);
    }
  };
  return (
    <>
      <Spin spinning={loading} delay={350}>
        <form
          className="bg-white overflow-y-auto max-h-full"
          onSubmit={handleImageUpload}
        >
          {" "}
          <Alert
            className="mb-5"
            variant="outlined"
            color="red"
            open={open}
            icon={<IconAlert />}
            action={
              <Button
                placeholder=""
                variant="text"
                color="red"
                size="sm"
                className="!absolute top-3 right-3"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            }
          >
            <div>{errorMessage}</div>
          </Alert>
          <Alert
            className="mb-5"
            color="green"
            variant="ghost"
            open={openSuccess}
            icon={<IconSuccess />}
          >
            {successMessage}
          </Alert>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <input
              className="pl-2 outline-none border-none w-full"
              type="text"
              onChange={handleFormChange}
              name="name"
              id=""
              placeholder="Name"
            />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
              />
            </svg>
            <input
              className="pl-2 outline-none border-none w-full"
              type="text"
              onChange={handleFormChange}
              name="surname"
              id=""
              placeholder="Surname"
            />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
            <input
              className="pl-2 outline-none border-none w-full"
              type="email"
              onChange={handleFormChange}
              name="email"
              id=""
              placeholder="Email Address"
            />
          </div>
          <div className="flex items-center border-2 py-2 px-3 rounded-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <input
              className="pl-2 outline-none border-none w-full"
              placeholder="Password"
              type="password"
              onChange={handleFormChange}
              name="password"
              id=""
            />
          </div>
          <div className="flex justify-between mt-4">
            <div className="flex flex-col items-center border-2 py-2 px-3 rounded-2xl">
              <span className="mt-2 text-sm font-medium text-gray-900">
                ID Front Face
              </span>
              {idFrontPrec === 100 ? (
                <>
                  Uploaded <AiOutlineCheck />
                </>
              ) : (
                <>
                  <p>{"Uploading: " + idFrontPrec + "%"}</p>
                </>
              )}
              <div className="mt-2 flex justify-center w-full">
                <input
                  className="pl-2 outline-none border-none"
                  type="file"
                  accept="image/*"
                  onChange={onChangeIdFrontImage}
                  name="image1"
                />
              </div>
              {idFrontUrl && (
                <Image
                  src={idFrontUrl}
                  alt="ID Front"
                  width="150"
                  height="60"
                />
              )}
            </div>

            <div className="flex flex-col items-center border-2 py-2 px-3 rounded-2xl ml-4">
              <span className="mt-2 text-sm font-medium text-gray-900">
                ID Back Face
              </span>
              {idBackPrec === 100 ? (
                <>
                  <p>Uploaded </p> <AiOutlineCheck />
                </>
              ) : (
                "Uploading: " + idFrontPrec + "%"
              )}
              <div className="mt-2 flex justify-center w-full">
                <input
                  className="pl-2 outline-none border-none"
                  type="file"
                  accept="image/*"
                  onChange={onChangeIBackImage}
                />
              </div>
              {idBackUrl && (
                <Image
                  className="mt-2"
                  src={idBackUrl}
                  alt="ID Back"
                  width="150"
                  height="60"
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2"
          >
            Sign Up
          </button>
        </form>
      </Spin>
    </>
  );
}
