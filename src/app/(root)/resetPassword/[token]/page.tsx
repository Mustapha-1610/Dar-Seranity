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
        setSendNewMailMessage("Link Expired ! ");
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
      <section
        className="grid bg-opacity-500 h-screen place-content-center bg-cover bg-center text-slate-300 relative"
        style={{
          backgroundImage: `url('https://i.pinimg.com/originals/5c/3b/64/5c3b64f233c01ca11268b4a15415a722.jpg')`,
        }}
      >
        <Spin spinning={loading} delay={350}>
          <div className="container mx-auto px-4">
            <div className="bg-black bg-opacity-40 rounded-lg p-8 text-white">
              <div className="mb-10 text-center text-white">
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
                    <Alert message={errorMessage} type="error" showIcon />
                  ) : successMessage ? (
                    <Alert
                      message={
                        <>
                          <div>
                            {successMessage}
                            <Link href="/login"> Login</Link>{" "}
                          </div>{" "}
                        </>
                      }
                      type="success"
                      showIcon
                    />
                  ) : (
                    <Alert
                      message={
                        <div>
                          {sendNewMailMessage}
                          <Link href="/sendPassResetMail">Send New One</Link>
                        </div>
                      }
                      type="error"
                      showIcon
                    />
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
                    className="w-80 appearance-none text-black rounded-full border-black border p-2 px-4 focus:bg-slate-800 focus:ring-1"
                    onChange={handleformChange}
                  />
                  <div>
                    <input
                      type={showType}
                      id="confirm_password"
                      name="confirmPassword"
                      placeholder="Confirm New Password"
                      className="w-80 text-black appearance-none rounded-full border-black border p-2 px-4 focus:bg-slate-800 focus:ring-1"
                      onChange={handleformChange}
                    />
                  </div>
                  <button
                    type="button"
                    id="showPw"
                    className="rounded-full bg-black p-2 px-4 text-white"
                  >
                    {show ? (
                      <div
                        onClick={() => (
                          setShowType("password"), setShow(!show)
                        )}
                      >
                        <AiFillEyeInvisible size={21} />
                      </div>
                    ) : (
                      <div
                        onClick={() => (setShowType("text"), setShow(!show))}
                      >
                        <AiFillEye size={21} />
                      </div>
                    )}
                  </button>
                  <button
                    id="showPw"
                    className="rounded-full bg-white p-3 px-14 text-black font-bold hover:bg-black hover:text-white"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Spin>
      </section>
    </>
  );
}
