"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Spin } from "antd";
import { Alert, Space } from "antd";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

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
        setShow(true);
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
  const handleGoogleLogin = async (token: String) => {
    try {
      setShow(false);
      setLoading(true);
      errorMessage && setErrorMessage("");
      landlordMailError && setLandlordMailError("");
      renterMailError && setRenterMailError("");
      const res: any = await fetch("/api/renter/googleAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credentialsToken: token,
        }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("renterData", JSON.stringify(data.renterData!));
        router.push("/renter/profile");
      } else if (data.error) {
        setErrorMessage(data.error);
        setShow(true);
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
                className={`hidden md:block`}
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
                    <GoogleOAuthProvider clientId="1013596441829-qrijadjokakadne57dol6o1vae3aj2nj.apps.googleusercontent.com">
                      <GoogleLogin
                        theme="outline"
                        size="large"
                        shape="pill"
                        width="280"
                        text="signin_with"
                        locale="english"
                        onSuccess={(credentialResponse) =>
                          handleGoogleLogin(credentialResponse.credential!)
                        }
                        onError={() => {
                          console.log("Login Failed");
                        }}
                        useOneTap
                      />
                    </GoogleOAuthProvider>
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
