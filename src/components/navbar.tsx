"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LandingPageNavbar from "@/app/components/landingPageNavbar";
export default function Navbar() {
  const [navComponent, setNavComponent] = useState(<LandingPageNavbar />);
  return <>{navComponent}</>;
}
