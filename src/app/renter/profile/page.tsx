"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function ProfilePage() {
  const router = useRouter();
  const [renterData, setRenterData] = useState(Object);
  const handleLoginFormSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const res: any = await fetch("/api/renter/getData", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.success === "Valid") {
        localStorage.setItem("renterData", JSON.stringify(data.responseData!));
        setRenterData(data.responseData!);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <h1>Hello {renterData?.name}</h1>
      <form onSubmit={handleLoginFormSubmit}>
        <button type="submit">click</button>
      </form>
    </>
  );
}
