"use client";
import React from "react";
import { useState } from "react";
import { Alert, Button } from "@material-tailwind/react";
import { IconAlert } from "@/components/alerts/Alert";
import { IconSuccess } from "@/components/alerts/Alert";
import { Spin } from "antd";
const RenterSignupPage = () => {
  const [alerOpen, setAlertOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [signupForm, setForm] = useState({
    name: null,
    surname: null,
    email: null,
    password: null,
  });
  const handleFormChange = (e: any) => {
    setForm({
      ...signupForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleFormSubmission = async (e: any) => {
    e.preventDefault();
    alerOpen ? setAlertOpen(false) : null;
    successOpen ? setSuccessOpen(false) : null;
    setLoading(true);
    const res: any = await fetch("/api/renter/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: signupForm.name,
        surname: signupForm.surname,
        email: signupForm.email,
        password: signupForm.password,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setSuccessOpen(true);
      setSuccessMessage(data.success);
    } else {
      setAlertOpen(true);
      setErrorMessage(data.error);
    }
    setLoading(false);
  };
  return (
    <>
      <Spin spinning={loading} delay={500}>
        <form onSubmit={handleFormSubmission}>
          <Alert
            className="mb-5"
            variant="ghost"
            color="green"
            open={successOpen}
            icon={<IconSuccess />}
          >
            {successMessage}
          </Alert>
          <Alert
            className="mb-5"
            variant="outlined"
            open={alerOpen}
            color="red"
            icon={<IconAlert />}
            action={
              <Button
                placeholder=""
                variant="text"
                color="red"
                size="sm"
                className="!absolute top-3 right-2 pl-4"
                onClick={() => setAlertOpen(false)}
              >
                Close
              </Button>
            }
          >
            <span className="m-8">{errorMessage}</span>
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
              type="password"
              onChange={handleFormChange}
              name="password"
              placeholder="Password"
            />
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
};

export default RenterSignupPage;
