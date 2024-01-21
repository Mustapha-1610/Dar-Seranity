"use client";
import React, { useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { Alert, Space, Spin } from "antd";

export default function ContactMe() {
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showAlert, setShowAlert] = React.useState<Boolean>(false);
  const [contactMeForm, setContactMeForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const handleFormChange = (e: any) => {
    setContactMeForm({
      ...contactMeForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleFormSubmission = async (e: any) => {
    e.preventDefault();
    setShowAlert(false);
    setLoading(true);
    successMessage && setSuccessMessage("");
    errorMessage && setErrorMessage("");
    const res: any = await fetch("/api/general/contactMe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: contactMeForm.name,
        email: contactMeForm.email,
        message: contactMeForm.message,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setSuccessMessage(data.success);
      setContactMeForm({
        name: "",
        email: "",
        message: "",
      });
    } else {
      setErrorMessage(data.error);
    }
    setShowAlert(true);
    setLoading(false);
  };

  return (
    <>
      <section
        className="grid bg-opacity-500 h-screen place-content-center bg-cover bg-center text-slate-300 relative"
        style={{
          backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/Needs%20For%20Project%2Fremy_loz-3S0INpfREQc-unsplash.jpg?alt=media&token=4e87d538-5d7a-4630-91bd-542b7654dfea')`,
          backgroundSize: "cover",
        }}
      >
        <div className="container my-24 mx-auto md:px-6">
          <section className="mb-32">
            <div className="relative h-[300px] overflow-hidden bg-cover bg-[5%] bg-no-repeat bg-[url('https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/Needs%20For%20Project%2Fremy_loz-3S0INpfREQc-unsplash.jpg?alt=media&token=4e87d538-5d7a-4630-91bd-542b7654dfea')]"></div>
            <div className="container px-6 md:px-12">
              <div className="block rounded-lg bg-[hsla(0,0%,110%,0.8)] px-6 py-12 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-[hsla(0,0%,5%,0.7)] dark:shadow-black/20 md:py-16 md:px-12 -mt-[100px] backdrop-blur-[30px]">
                <div className="flex flex-wrap">
                  <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:px-3 lg:mb-0 lg:w-5/12 lg:px-6">
                    {showAlert && (
                      <Space
                        className="mb-4"
                        direction="vertical"
                        style={{ width: "100%" }}
                      >
                        {errorMessage ? (
                          <Alert message={errorMessage} type="error" showIcon />
                        ) : successMessage ? (
                          <Alert
                            message={
                              <>
                                <div>{successMessage}</div>{" "}
                              </>
                            }
                            type="success"
                            showIcon
                          />
                        ) : (
                          <Alert message={<div></div>} type="error" showIcon />
                        )}
                      </Space>
                    )}
                    <Spin spinning={loading} delay={350}>
                      <form onSubmit={handleFormSubmission}>
                        <div className="relative mb-6 border-black	">
                          <input
                            type="text"
                            value={contactMeForm.name}
                            className="peer block min-h-[auto] w-full rounded border-black bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
                            placeholder="Name"
                            name="name"
                            onChange={handleFormChange}
                          />
                        </div>
                        <div className="relative mb-6 border-black	">
                          <input
                            type="text"
                            value={contactMeForm.email}
                            className="peer block min-h-[auto] w-full rounded border-black bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
                            placeholder="Email"
                            name="email"
                            onChange={handleFormChange}
                          />
                        </div>
                        <div
                          className="relative mb-6"
                          data-te-input-wrapper-init
                        >
                          <textarea
                            value={contactMeForm.message}
                            className="peer block min-h-[auto] w-full rounded border-black bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
                            name="message"
                            onChange={handleFormChange}
                            id="exampleFormControlTextarea1"
                            rows={3}
                            placeholder="Your message"
                          ></textarea>
                        </div>
                        <button
                          type="submit"
                          data-te-ripple-init
                          data-te-ripple-color="light"
                          className="mb-6 inline-block w-full rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] lg:mb-0"
                        >
                          Send
                        </button>
                      </form>
                    </Spin>
                  </div>
                  <div className="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
                    <div className="flex flex-wrap">
                      <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:w-full lg:px-6 xl:w-6/12">
                        <div className="flex items-start">
                          <div className="shrink-0">
                            <div className="inline-block rounded-md bg-primary-100 p-4 text-primary">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="h-6 w-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-6 grow">
                            <p className="mb-2 font-bold dark:text-white">
                              Phone Number
                            </p>
                            <p className="text-neutral-500 dark:text-neutral-200">
                              +216 52 491 002
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:w-full lg:px-6 xl:w-6/12">
                        <div className="flex items-start">
                          <div className="shrink-0">
                            <div className="inline-block rounded-md bg-primary-100 p-4 text-primary">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#000000"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                              </svg>
                            </div>
                          </div>
                          <div className="ml-6 grow">
                            <p className="mb-2 font-bold dark:text-white">
                              Professional Mail
                            </p>
                            <a
                              href="mailto:TalbiMustapha.Work@outlook.com"
                              className="text-neutral-500 dark:text-neutral-200 hover:text-blue-600"
                            >
                              TalbiMustapha.Work@Outlook.com
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:mb-0 md:w-6/12 md:px-3 lg:mb-12 lg:w-full lg:px-6 xl:w-6/12">
                        <div className="align-start flex">
                          <div className="shrink-0">
                            <div className="inline-block rounded-md bg-primary-100 p-4 text-primary">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="#000"
                              >
                                <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.27 20.1H3.65V9.24h3.62V20.1zM5.47 7.76h-.03c-1.22 0-2-.83-2-1.87 0-1.06.8-1.87 2.05-1.87 1.24 0 2 .8 2.02 1.87 0 1.04-.78 1.87-2.05 1.87zM20.34 20.1h-3.63v-5.8c0-1.45-.52-2.45-1.83-2.45-1 0-1.6.67-1.87 1.32-.1.23-.11.55-.11.88v6.05H9.28s.05-9.82 0-10.84h3.63v1.54a3.6 3.6 0 0 1 3.26-1.8c2.39 0 4.18 1.56 4.18 4.89v6.21z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-6 grow">
                            <p className="mb-2 font-bold dark:text-white">
                              Linkedin
                            </p>
                            <a
                              href="https://www.linkedin.com/in/mustapha-talbi-11baa42a9/"
                              className="text-neutral-500 dark:text-neutral-200  hover:text-blue-600"
                            >
                              {" "}
                              Mustapha Talbi
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:w-full lg:px-6 xl:mb-12 xl:w-6/12">
                        <div className="align-start flex">
                          <div className="shrink-0">
                            <div className="inline-block rounded-md bg-primary-100 p-4 text-primary">
                              <FaGithub size={32} />
                            </div>
                          </div>
                          <div className="ml-6 grow">
                            <p className="mb-2 font-bold dark:text-white">
                              GitHub
                            </p>
                            <a
                              href="https://github.com/Mustapha-1610"
                              className="text-neutral-500 dark:text-neutral-200 hover:text-blue-600"
                            >
                              {" "}
                              Mustapha-1610
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
