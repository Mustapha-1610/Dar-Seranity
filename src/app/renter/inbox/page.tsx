"use client";
import { getRenterLocalStorageData } from "@/Helpers/frontFunctions/localStorageHandler";
import { useEffect, useState } from "react";

export default function Inbox() {
  const [conversations, setConversations] = useState([]);
  const [renterData, setRenterData] = useState<any>({});
  useEffect(() => {
    setRenterData(getRenterLocalStorageData());
    const getConversations = async () => {
      const renterId = getRenterLocalStorageData();
      const response = await fetch("/api/conversations/getConversation", {
        method: "POST",
        body: JSON.stringify({
          userId: renterId._id,
        }),
      });
      const res = await response.json();
      console.log(res);
      if (res.conversations) {
        setConversations(res.converations);
      }
    };
    getConversations();
  }, []);
  return (
    <>
      <p>Hello</p>
      {conversations.map((m: any, index: any) => {
        return <div key={index}></div>;
      })}
    </>
  );
}
