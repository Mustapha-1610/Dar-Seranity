"use client";
import React from "react";
import { useState, useEffect } from "react";
const RenterSignupPage = () => {
  const [signupForm, setForm] = useState({
    name: null,
    surname: null,
    email: null,
    password: null,
  });
  const handleFormChange = (e: any) => {
    setForm({
      ...signupForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleFormSubmission = async (e: any) => {
    e.preventDefault();
    const res: any = await fetch("/api/renter/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: signupForm.name,
        surname: signupForm.surname,
        email: signupForm.email,
        password: signupForm.password,
      }),
    });
    const data = await res.json();
    console.log(data.success);
  };
  return (
    <>
      <div>
        <form onSubmit={handleFormSubmission}>
          <div>
            <label>Name </label>
            <input type="text" onChange={handleFormChange} name="name" />
          </div>
          <div>
            <label>Surname </label>
            <input type="text" onChange={handleFormChange} name="surname" />
          </div>
          <div>
            <label>Email </label>
            <input type="email" onChange={handleFormChange} name="email" />
          </div>
          <div>
            <label>Password </label>
            <input
              type="password"
              onChange={handleFormChange}
              name="password"
            />
          </div>
          <button type="submit">Sign up</button>
        </form>
      </div>
    </>
  );
};

export default RenterSignupPage;
