"use client";
import React from "react";
import { Alert, Space, Spin } from "antd";
import Link from "next/link";

export default function SendPassResetMail() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<String>();
  const [errorMessage, setErrorMessage] = React.useState<String>();
  const [successMessage, setSuccessMessage] = React.useState<any>();
  const [show, setShow] = React.useState<Boolean>(false);
  const handleFormSubmission = async (e: any) => {
    e.preventDefault();
    setShow(false);
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);
    const res: any = await fetch("/api/general/sendPassResetMail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });
    const data = await res.json();
    if (data.success) {
      if (email?.includes("@gmail")) {
        setSuccessMessage({
          __html:
            'If Your Account Exists, A Password Reset Link Will Be Sent To You In A Few Moments. Check Your <a href="https://mail.google.com/mail/u/0/#inbox" target="_blank" rel="noopener noreferrer" style="color: #1890ff; text-decoration: underline; font-weight: bold;">Inbox</a>',
        });
      }
      if (email?.includes("@outlook")) {
        setSuccessMessage({
          __html:
            'If Your Account Exists, A Password Reset Link Will Be Sent To You In A Few Moments. Check Your <a href="https://outlook.live.com/mail/0/" target="_blank" rel="noopener noreferrer" style="color: #1890ff; text-decoration: underline; font-weight: bold;">Inbox</a>',
        });
      }
      if (email?.includes("@hotmail")) {
        setSuccessMessage({
          __html:
            'If Your Account Exists, A Password Reset Link Will Be Sent To You In A Few Moments. Check Your <a href="https://outlook.live.com/mail/0/" target="_blank" rel="noopener noreferrer" style="color: #1890ff; text-decoration: underline; font-weight: bold;">Inbox</a>',
        });
      }
    } else {
      setErrorMessage(data.error);
    }
    setLoading(false);
    setShow(true);
  };
  return (
    <>
      <div
        className="min-h-screen bg-gray-100 text-gray-900 antialiased"
        style={{
          backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/Needs%20For%20Project%2Fflorian-schmidinger-b_79nOqf95I-unsplash.jpg?alt=media&token=297f0b91-2000-4884-b629-525eb35db293')`,
          backgroundSize: "cover",
        }}
      >
        <div className="flex flex-col mx-auto items-center justify-center h-full">
          <div className="pt-24">
            <div className="flex w-full items-center justify-center">
              <div className="w-full max-w-lg px-4 py-16 space-y-6 bg-white rounded-md">
                <Spin spinning={loading} delay={350}>
                  <h1 className="mb-6 text-3xl font-bold text-center">
                    Don&apos;t Worry !
                  </h1>
                  <p className="text-center mx-12 mb-6">
                    We are here to help you to recover your password. Enter the
                    email address you used when you joined and we ll send you
                    instructions to reset your password.
                  </p>
                  {/* ... rest of your form content */}

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
                          <Alert
                            message={
                              <div dangerouslySetInnerHTML={successMessage} />
                            }
                            type="success"
                            showIcon
                          />
                        </>
                      )}
                    </Space>
                  )}

                  <form
                    onSubmit={handleFormSubmission}
                    className="space-y-6 w-ful"
                  >
                    <input
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary-100"
                      type="email"
                      name="email"
                      placeholder="Email address"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div>
                      <button
                        type="submit"
                        className="w-full px-4 py-2 rounded-lg border-indigo-500 hover:shadow font-medium text-center text-white bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 rounded-md  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                      >
                        Reset Password
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="inline-block ml-2 w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                          />
                        </svg>
                      </button>
                    </div>
                  </form>

                  <div className="text-sm text-gray-600 items-center flex justify-between mt-8">
                    <p className="text-gray-800 cursor-pointer hover:text-blue-500 inline-flex items-center ml-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <Link href="/login">Login</Link>
                    </p>
                    <Link
                      href="/"
                      className="hover:text-blue-500 cursor-pointer"
                    >
                      Contact Me ?
                    </Link>
                  </div>
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
