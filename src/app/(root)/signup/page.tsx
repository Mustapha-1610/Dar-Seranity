"use client";
import { useState } from "react";
import RenterSignupPage from "../rSignup/renterSignupPage";
import LandlordSignupPage from "../lSignup/landlordSignupPage";
import Link from "next/link";
export default function SignupPage() {
  const [selectedComponent, setSeleectedComponent] = useState(
    <RenterSignupPage />
  );
  const changeComponent = (e: any) => {
    e.target.value === "renterButton"
      ? setSeleectedComponent(<RenterSignupPage />)
      : setSeleectedComponent(<LandlordSignupPage />);
  };
  return (
    <>
      <div>
        <div>
          Renter{" "}
          <input
            type="radio"
            name="signupDisplay"
            value="renterButton"
            defaultChecked
            onChange={changeComponent}
          />
          <input
            type="radio"
            name="signupDisplay"
            value="landlordButton"
            onChange={changeComponent}
          />
          Landlord{" "}
        </div>

        {selectedComponent}
        <div>
          <h4>
            Allready Have An Account ?{" "}
            <span>
              <Link href="/login">Login </Link>
            </span>
          </h4>
        </div>
      </div>
    </>
  );
}
