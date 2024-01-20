"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Alert, Space, Spin } from "antd";
export default function ResetPassword({
  params,
}: {
  params: { token: string };
}) {
  const [errorMessage, setErrorMessage] = useState<any>();
  const [successMessage, setSuccessMessage] = useState<any>();
  const [sendNewMailMessage, setSendNewMailMessage] = useState<any>("");
  const [showType, setShowType] = useState("password");
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState<Boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleformChange = (e: any) => {
    e.preventDefault();
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePassResetSubmit = async (e: any) => {
    e.preventDefault();
    setShowAlert(false);
    setLoading(true);
    errorMessage && setErrorMessage("");
    successMessage && setSuccessMessage("");
    sendNewMailMessage && setSendNewMailMessage("");
    try {
      const res: any = await fetch("/api/general/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mailToken: params.token,
          password: passwordForm.password,
          confirmPassword: passwordForm.confirmPassword,
        }),
      });
      const data = await res.json();
      if (data.success!) {
        setSuccessMessage("Password Changed !");
      } else if (data.mailError!) {
        setSendNewMailMessage({
          __html:
            'Link Expired <a href="https://dar-seranity.vercel.app/sendPassResetMail" target="_blank" rel="noopener noreferrer" style="color: #1890ff; text-decoration: underline; font-weight: bold;">Send New One</a>',
        });
      } else {
        setErrorMessage(data.error);
      }
      setLoading(false);
      setShowAlert(true);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <section className="grid h-screen place-content-center bg-slate-900 text-slate-300">
        <Spin spinning={loading} delay={350}>
          <div className="mb-10 text-center text-indigo-400">
            <h1 className="text-3xl font-bold tracking-widest">
              Password Reset
            </h1>
          </div>
          {showAlert && (
            <Space
              className="mb-4"
              direction="vertical"
              style={{ width: "100%" }}
            >
              {errorMessage ? (
                <>
                  <Alert message={errorMessage} type="error" showIcon />
                </>
              ) : successMessage ? (
                <>
                  <Alert message={successMessage} type="success" showIcon />
                </>
              ) : (
                <>
                  <Alert
                    message={
                      <div dangerouslySetInnerHTML={sendNewMailMessage} />
                    }
                    type="error"
                    showIcon
                  />
                </>
              )}
            </Space>
          )}
          <form onSubmit={handlePassResetSubmit}>
            <div className="flex flex-col items-center justify-center space-y-6">
              <input
                type={showType}
                id="password"
                name="password"
                placeholder="New Password"
                className="w-80 appearance-none rounded-full border-black border p-2 px-4 focus:bg-slate-800 focus:ring-1"
                onChange={handleformChange}
              />
              <div>
                <input
                  type={showType}
                  id="confirm_password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  className="w-80 appearance-none rounded-full border-black border p-2 px-4 focus:bg-slate-800 focus:ring-1"
                  onChange={handleformChange}
                />
                <p
                  id="validation"
                  className="text-center text-orange-500 italic text-sm"
                ></p>
              </div>
              <button
                type="button"
                id="showPw"
                className="rounded-full bg-blue-500 p-2 px-4 text-white hover:bg-blue-700"
              >
                {show ? (
                  <div
                    onClick={() => (setShowType("password"), setShow(!show))}
                  >
                    <AiFillEyeInvisible />
                  </div>
                ) : (
                  <div onClick={() => (setShowType("text"), setShow(!show))}>
                    <AiFillEye />
                  </div>
                )}
              </button>
              <button
                id="showPw"
                className="rounded-f rounded-full  ull bg-indigo-500 p-2 px-4 text-white hover:bg-indigo-700"
              >
                Reset Password
              </button>
            </div>
          </form>
        </Spin>
      </section>
    </>
  );
}
