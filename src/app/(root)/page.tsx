"use client";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { Carousel } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PiArmchairDuotone } from "react-icons/pi";
import { MdOutlineSoupKitchen } from "react-icons/md";
import { GrRestroom } from "react-icons/gr";
import { IoBedOutline } from "react-icons/io5";

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      const response = await fetch("/api/propertyListing/getFeaturedListings", {
        method: "POST",
      });
      const res = await response.json();
      if (res.randomProperties) {
        setFeaturedProperties(res.randomProperties);
      }
    };
    fetchFeaturedProperties();
  }, []);
  return (
    <>
      <div className="relative bg-white pb-[110px] pt-[120px] dark:bg-dark lg:pt-[150px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-5/12">
              <div className="hero-content">
                <h1 className="mb-5 text-4xl font-bold !leading-[1.208] text-dark dark:text-white sm:text-[42px] lg:text-[40px] xl:text-5xl">
                  Welcome to Dar Serenity Rentals
                </h1>
                <p className="mb-8 max-w-[480px] text-base text-body-color dark:text-dark-6">
                  Embrace the serenity of Dar Serenity Rentals, where peaceful
                  escapes await. Find your ideal retreat and immerse yourself in
                  a world of calm and comfort.
                </p>
                <ul className="flex flex-wrap items-center">
                  <li>
                    <a
                      href="/#"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-center text-base font-medium text-white hover:bg-blue-dark lg:px-7"
                    >
                      Browse
                    </a>
                  </li>
                </ul>
                <div className="clients pt-16">
                  <h6 className="mb-6 flex items-center text-xs font-normal text-body-color dark:text-dark-6">
                    Enjoy .
                    <span className="ml-3 inline-block h-px w-8 bg-body-color"></span>
                  </h6>

                  <div className="flex items-center space-x-4"></div>
                </div>
              </div>
            </div>
            <div className="hidden px-4 lg:block lg:w-1/12"></div>
            <div className="w-full px-4 lg:w-6/12">
              <div className="lg:ml-auto lg:text-right">
                <div className="relative z-10 inline-block pt-11 lg:pt-0">
                  <img
                    src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
                    alt="hero"
                    className="max-w-full lg:ml-auto"
                  />
                  <span className="absolute -bottom-8 -left-8 z-[-1]">
                    <svg
                      width="93"
                      height="93"
                      viewBox="0 0 93 93"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="2.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="2.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="2.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="2.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="2.5" cy="90.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="90.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="90.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="90.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="90.5" r="2.5" fill="#3056D3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <>
          {/* ... (Previous JSX code remains unchanged) ... */}

          {/* New section for exploring featured houses */}

          <div className=" mt-10 dark:bg-dark-2 py-16">
            <div className="container">
              <h2 className="  text-3xl font-bold text-center text-dark dark:text-white mb-8">
                Explore Featured Houses
              </h2>
              <div className="flex flex-wrap justify-center">
                {/* Add featured house cards or images here */}
                <div className="mx-4 mb-8 max-w-[300px]">
                  {/* Featured House Card */}
                  <Spin spinning={loading} delay={350}>
                    <div>
                      <div className="mx-auto mb-7 px-18 ">
                        {featuredProperties.length > 0 ? (
                          <>
                            <div className="flex justify-center items-center gap-10">
                              {featuredProperties?.map((item: any) => {
                                return (
                                  <div key={item._id} className="max-w-md">
                                    <div className="relative flex flex-col shadow-md rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 max-w-sm">
                                      <div className="h-auto overflow-hidden">
                                        <div className="h-42 relative">
                                          <Carousel
                                            placeholder=""
                                            transition={{ duration: 0.6 }}
                                            className="rounded-xl mx-auto" // Add mx-auto class
                                          >
                                            {item.propertyImages.map(
                                              (image: any, index: any) => (
                                                <div key={index}>
                                                  <Image
                                                    height={600}
                                                    width={600}
                                                    src={image}
                                                    onClick={() => {
                                                      router.push(
                                                        `/renter/rentalPropertyInformations/${item._id}`
                                                      );
                                                    }}
                                                    alt={`image ${index + 1}`}
                                                    className="h-48 cursor-pointer w-full object-cover"
                                                  />
                                                </div>
                                              )
                                            )}
                                          </Carousel>
                                        </div>
                                      </div>
                                      <div
                                        className="bg-white cursor-pointer py-4 px-3"
                                        onClick={() => {
                                          router.push(
                                            `/renter/rentalPropertyInformations/${item._id}`
                                          );
                                        }}
                                      >
                                        <h3 className="text-lg  mb-2 font-bold">
                                          {item.title}
                                        </h3>
                                        <div className="flex justify-center items-center gap-2">
                                          <div className="flex items-center gap-1">
                                            <PiArmchairDuotone size={28} />
                                            <span>
                                              {item.roomsCount.livingRoom}
                                            </span>{" "}
                                            /
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <MdOutlineSoupKitchen size={28} />
                                            <span>
                                              {item.roomsCount.kitchen}
                                            </span>{" "}
                                            /
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <GrRestroom size={28} />
                                            <span>
                                              {item.roomsCount.restRoom}
                                            </span>{" "}
                                            /
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <IoBedOutline size={28} />
                                            <span>
                                              {item.roomsCount.bedRoom}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <>
                            <h3 className="text-black font-bold">
                              No Property Listings To Display
                            </h3>
                          </>
                        )}
                      </div>
                    </div>
                  </Spin>
                  <h3 className="text-xl font-semibold mb-2">
                    Serenity Retreat
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Discover the tranquility of this cozy retreat surrounded by
                    nature.
                  </p>
                </div>

                {/* Add more featured house cards or images as needed */}
              </div>
              <div className="text-center">
                <a
                  href="/#"
                  className="inline-block px-6 py-3 text-base font-medium text-white bg-primary rounded-md hover:bg-blue-dark"
                >
                  View All Houses
                </a>
              </div>
            </div>
          </div>

          {/* ... (Remaining JSX code remains unchanged) ... */}
        </>
      </div>
    </>
  );
}
