"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Spin } from "antd";
import { Alert, Space } from "antd";
import Link from "next/link";
export default function LoginPage() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [show, setShow] = React.useState<Boolean>(false);
  const router = useRouter();
  const [loginForm, setLoginForm] = useState<any>({
    email: null,
    password: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [landlordMailError, setLandlordMailError] = useState<String>();
  const [renterMailError, setRenterMailError] = useState<any>();
  const handleLoginFormSubmit = async (e: any) => {
    try {
      setShow(false);
      e.preventDefault();
      setLoading(true);
      errorMessage && setErrorMessage("");
      landlordMailError && setLandlordMailError("");
      renterMailError && setRenterMailError("");
      const res: any = await fetch("/api/renter/multiAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("renterData", JSON.stringify(data.renterData!));
        router.push("/renter/profile");
      } else if (data.error) {
        setErrorMessage(data.error);
      } else if (data.landlordMailError) {
        setLandlordMailError(data.landlordMailError);
        setShow(true);
      } else if (data.renterMailError) {
        if (loginForm.email?.includes("@gmail")) {
          setRenterMailError({
            __html:
              'You need to verify your mail first before logging in ! Check Your <a href="https://mail.google.com/mail/u/0/#inbox" target="_blank" rel="noopener noreferrer" style="color: #1890ff; text-decoration: underline; font-weight: bold;">Inbox</a>',
          });
        }
        if (loginForm.email?.includes("@outlook")) {
          setRenterMailError({
            __html:
              'You need to verify your mail first before logging in ! Check Your <a href="https://outlook.live.com/mail/0/" target="_blank" rel="noopener noreferrer" style="color: #1890ff; text-decoration: underline; font-weight: bold;">Inbox</a>',
          });
        }
        if (loginForm.email?.includes("@hotmail")) {
          setRenterMailError({
            __html:
              'You need to verify your mail first before logging in ! Check Your <a href="https://outlook.live.com/mail/0/" target="_blank" rel="noopener noreferrer" style="color: #1890ff; text-decoration: underline; font-weight: bold;">Inbox</a>',
          });
        }
        setShow(true);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  const handleFormChange = (e: any) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="container px-6 mx-auto">
        <div className="flex flex-col text-center md:text-left md:flex-row h-screen justify-evenly md:items-center">
          <div className="flex flex-col w-full">
            <div>
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/Needs%20For%20Project%2F_eb24e2af-b658-4422-b125-b41f76a85688.jpg?alt=media&token=678651e4-e036-4c1b-9863-997699ab2d8d"
                alt="Logo"
                width="600"
                height="150"
              />
            </div>
          </div>
          <div className="w-full md:w-full lg:w-9/12 mx-auto md:mx-0">
            <div className="bg-white p-10 flex flex-col w-full shadow-xl rounded-xl">
              <h2 className="text-2xl font-bold text-gray-800 text-left mb-5">
                Sign In
              </h2>
              {show && (
                <Space
                  className="mb-4"
                  direction="vertical"
                  style={{ width: "100%" }}
                >
                  {errorMessage ? (
                    <>
                      <Alert message={errorMessage} type="error" showIcon />
                    </>
                  ) : (
                    <>
                      {landlordMailError ? (
                        <>
                          <Alert
                            message={landlordMailError}
                            type="warning"
                            showIcon
                          />
                        </>
                      ) : (
                        <>
                          <Alert
                            message={
                              <div dangerouslySetInnerHTML={renterMailError} />
                            }
                            type="warning"
                            showIcon
                          />
                        </>
                      )}
                    </>
                  )}
                </Space>
              )}
              <Spin spinning={loading} delay={350}>
                <form onSubmit={handleLoginFormSubmit} className="w-full">
                  <div id="input" className="flex flex-col w-full my-5">
                    <label className="text-gray-500 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleFormChange}
                      placeholder="Insert your email"
                      className="appearance-none border-2 border-gray-100 rounded-lg px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:shadow-lg"
                    />
                  </div>
                  <div id="input" className="flex flex-col w-full my-5">
                    <label className="text-gray-500 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      onChange={handleFormChange}
                      placeholder="Insert your password"
                      className="appearance-none border-2 border-gray-100 rounded-lg px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:shadow-lg"
                    />
                  </div>
                  <div id="button" className="flex flex-col w-full my-5">
                    <button
                      type="submit"
                      className="w-full py-4 bg-green-600 rounded-lg text-green-100"
                    >
                      <div className="flex flex-row items-center justify-center">
                        <div className="mr-2">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            ></path>
                          </svg>
                        </div>
                        <div className="font-bold">Sign In</div>
                      </div>
                    </button>
                  </div>

                  <div className="flex justify-center mt-5">
                    <div className="flex items-center">
                      <div className="border-t border-gray-300 w-full"></div>
                      <div className="mx-4 text-gray-500">OR</div>
                      <div className="border-t border-gray-300 w-full"></div>
                    </div>
                  </div>

                  <div id="button" className="flex flex-col w-full my-5">
                    <button className="w-full font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                      <div className="bg-white p-2 rounded-full">
                        <svg className="w-4" viewBox="0 0 533.5 544.3">
                          <path
                            d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                            fill="#4285f4"
                          />
                          <path
                            d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                            fill="#34a853"
                          />
                          <path
                            d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                            fill="#fbbc04"
                          />
                          <path
                            d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                            fill="#ea4335"
                          />
                        </svg>
                      </div>
                      <span className="ml-4">Sign Up with Google</span>
                    </button>
                  </div>

                  <div className="flex justify-evenly mt-5">
                    <Link
                      href="/sendPassResetMail"
                      className="w-full text-center font-medium text-gray-500"
                    >
                      Recover password!
                    </Link>

                    <Link
                      href="/signup"
                      className="w-full text-center font-medium text-gray-500"
                    >
                      Signup!
                    </Link>
                  </div>
                </form>
              </Spin>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
