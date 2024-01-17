"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState({
    email: null,
    password: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const handleLoginFormSubmit = async (e: any) => {
    try {
      e.preventDefault();
      errorMessage ? setErrorMessage("") : null;
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
        router.push("/renter/profile");
      }
      console.log(data);
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
      <div>
        <form onSubmit={handleLoginFormSubmit}>
          <div>
            <label>Email : </label>
            <input type="email" name="email" onChange={handleFormChange} />
          </div>
          <div>
            <label>Password : </label>
            <input
              type="password"
              name="password"
              onChange={handleFormChange}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}
