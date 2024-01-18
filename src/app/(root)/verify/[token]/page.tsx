"use client";

import { useEffect, useState } from "react";

export default function Page({ params }: { params: { token: string } }) {
  const [responseMessage, setResponseMessage] = useState("");
  const [sendNewMailMessage, setSendNewMailMessage] = useState("");
  const verifyToken = async (token: string) => {
    try {
      const res: any = await fetch("/api/renter/verifyMailToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mailToken: token,
        }),
      });
      const data = await res.json();
      if (data.success!) {
        setResponseMessage(data.success!);
      } else if (data.mailError!) {
        setSendNewMailMessage(data.mailError);
      } else {
        setResponseMessage(data.error!);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (params.token !== null && params.token !== null) {
      verifyToken(params.token);
    }
  }, [params.token]);
  return (
    <>
      {sendNewMailMessage ? (
        <>
          {sendNewMailMessage} + <span>Send New One</span>
        </>
      ) : null}
      {responseMessage}
    </>
  );
}
