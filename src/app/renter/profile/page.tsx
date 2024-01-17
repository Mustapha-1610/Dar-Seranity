"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function ProfilePage() {
  const router = useRouter();
  const [renterData, setRenterData] = useState(Object);
  useEffect(() => {
    const handleLoginFormSubmit = async () => {
      try {
        const res: any = await fetch("/api/renter/getData", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data);
        if (data.success === "Valid") {
          localStorage.setItem(
            "renterData",
            JSON.stringify(data.responseData!)
          );
          setRenterData(data.responseData!);
        } else {
          router.push("/");
        }
      } catch (err) {
        console.log(err);
      }
    };
    handleLoginFormSubmit();
  }, [router]);
  return (
    <>
      <h1>Hello {renterData?.name}</h1>
    </>
  );
}
