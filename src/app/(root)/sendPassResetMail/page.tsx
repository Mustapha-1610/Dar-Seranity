"use client";
import { Spin } from "antd";
import React from "react";
import { Alert, Space } from "antd";
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
    console.log(data);
    if (data.success) {
      if (email?.includes("@gmail")) {
        setSuccessMessage({
          __html:
            'Verification Mail Sent! Check Your <a href="https://mail.google.com/mail/u/0/#inbox" target="_blank" rel="noopener noreferrer" style="color: #1890ff; text-decoration: underline; font-weight: bold;">Inbox</a>',
        });
      }
      if (email?.includes("@outlook")) {
        setSuccessMessage({
          __html:
            'Verification Mail Sent! Check Your <a href="https://outlook.live.com/mail/0/" target="_blank" rel="noopener noreferrer" style="color: #1890ff; text-decoration: underline; font-weight: bold;">Inbox</a>',
        });
      }
      if (email?.includes("@hotmail")) {
        setSuccessMessage({
          __html:
            'Verification Mail Sent! Check Your <a href="https://outlook.live.com/mail/0/" target="_blank" rel="noopener noreferrer" style="color: #1890ff; text-decoration: underline; font-weight: bold;">Inbox</a>',
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
      <div className="min-h-screen bg-gray-100 text-gray-900 antialiased">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="pt-24">
            <div className="flex w-full items-center justify-center">
              <div className="w-full max-w-lg px-4 py-16 space-y-6 bg-white rounded-md">
                <h1 className="mb-6 text-3xl font-bold text-center">
                  Dont worry
                </h1>
                <p className="text-center mx-12">
                  We are here to help you to recover your password. Enter the
                  email address you used when you joined and we ll send you
                  instructions to reset your password.
                </p>
                {/* ... rest of your form content */}
                <Spin spinning={loading} delay={350}>
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
                        className="w-full px-4 py-2 font-medium text-center text-white bg-indigo-600 transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </Spin>
                <div className="text-sm text-gray-600 items-center flex justify-between">
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
                  <Link href="/" className="hover:text-blue-500 cursor-pointer">
                    Contact Me ?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
