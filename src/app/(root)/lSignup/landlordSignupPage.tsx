"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "@/Helpers/firebase/firebase";
import Image from "next/image";
export default function LandlordSignupPage() {
  const [errorMessage, setErrorMessage] = useState("");
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
    e.preventDefault();
    if (!idFrontImage || !idBackImage) {
      setErrorMessage("Id Images Are Required !");
    } else {
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
      data.error ? setErrorMessage(data.error) : setErrorMessage(data.success);
      setForm({
        ...signupForm,
        idCardFront: "",
        idCardBack: "",
      });
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
      {errorMessage}
      <form onSubmit={handleImageUpload}>
        <div>
          <label>Name </label>
          <input type="text" onChange={handleFormChange} name="name" />
        </div>
        <div>
          <label>Surname </label>
          <input type="text" onChange={handleFormChange} name="surname" />
        </div>
        <div>
          <label>Email </label>
          <input type="email" onChange={handleFormChange} name="email" />
        </div>
        <div>
          <label>Password </label>
          <input type="password" onChange={handleFormChange} name="password" />
        </div>
        <div>
          <label htmlFor="img">Id Front Face :</label>{" "}
          {idFrontPrec > 0 && "Uploading: " + idFrontPrec + "%"}
          <br />
          <input type="file" accept="image/*" onChange={onChangeIdFrontImage} />
          {idFrontUrl && (
            <Image src={idFrontUrl} alt="ID Front" width="250" height="90" />
          )}
        </div>
        <div>
          <label htmlFor="img">Id Back Face :</label>{" "}
          {idBackPrec > 0 && "Uploading: " + idBackPrec + "%"}
          <br />
          <input type="file" accept="image/*" onChange={onChangeIBackImage} />
          {idBackUrl && (
            <Image src={idBackUrl} alt="ID Back" width="250" height="90" />
          )}
        </div>

        <button type="submit">Sign up</button>
      </form>
    </>
  );
}
