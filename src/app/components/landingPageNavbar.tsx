"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function LandingPageNavbar() {
  return (
    <>
      <div className="flex-col items-center justify-between w-full">
        <section className="mx-auto w-full">
          <nav className="flex justify-between bg-gray-900 text-white w-full position: fixed; top: 0;">
            <div className="px-5 xl:px-6 py-6 flex w-full items-center w-full">
              <Link className="text-2xl font-bold font-heading" href="/">
                Dar-Seranity
              </Link>
              <ul className="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
                <li>
                  <Link className="hover:text-gray-200" href="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gray-200" href="/">
                    Browse
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gray-200" href="/">
                    About Me
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-gray-200" href="/">
                    Contact Me
                  </Link>
                </li>
              </ul>
              <div className="hidden xl:flex items-center space-x-5 items-center">
                <Link
                  className="bg-transparent text-white hover:bg-gray-700 hover:text-white font-semibold py-2 px-4 rounded-lg"
                  href="/login"
                >
                  Login
                </Link>
                <Link
                  className="bg-transparent text-white hover:bg-gray-700 hover:text-white font-semibold py-2 px-4 rounded-lg"
                  href="/signup"
                >
                  SignUp
                </Link>
              </div>
            </div>
            <div className="xl:hidden flex mr-6 items-center">
              <Link
                className="bg-transparent text-white hover:bg-gray-700 hover:text-white font-semibold py-2 px-4 rounded-lg"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="bg-transparent text-white hover:bg-gray-700 hover:text-white font-semibold py-2 px-4 rounded-lg"
                href="/signup"
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </section>
        <div className="fixed bottom-0 right-0 mb-4 mr-4 z-10 text-center flex">
          <div className="mr-2">
            <a
              title="Contact Me"
              href="mailto:TalbiMustapha.Work@outlook.com"
              target="_blank"
              className="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12"
            >
              <Image
                className="object-cover object-center w-full h-full rounded-full"
                src="https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/Needs%20For%20Project%2Foutlook-icon.png?alt=media&token=8e8f1ffc-0129-4965-8821-63a6f25a0c38"
                alt="Logo"
                width="70"
                height="30"
              />
            </a>
          </div>
          <div className="mr-2">
            <a
              title="Check Out My Linkedin"
              href="https://www.linkedin.com/in/mustapha-talbi-11baa42a9/"
              target="_blank"
              className="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12"
            >
              <Image
                className="object-cover object-center w-full h-full rounded-full"
                src="https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/Needs%20For%20Project%2Flinkedin-black-icon-logo-ECC426C572-seeklogo.com.png?alt=media&token=1e1e3665-1c11-48c2-ab58-d181297a8761"
                alt=""
                width="70"
                height="30"
              />
            </a>
          </div>
          <div>
            <a
              title="Check Me Out On Github"
              href="https://github.com/Mustapha-1610?tab=repositories"
              target="_blank"
              className="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12"
            >
              <Image
                className="object-cover object-center w-30 h-30 rounded-full"
                src="https://firebasestorage.googleapis.com/v0/b/dar-seranity.appspot.com/o/Needs%20For%20Project%2F25231.png?alt=media&token=2493caca-4283-41d7-892d-ef68f4c68581"
                alt=""
                width="70"
                height="30"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
