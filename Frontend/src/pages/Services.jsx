import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

import Bg from "../assets/bg.jpg";

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  const gradients = [
    "from-pink-100 via-pink-50 to-rose-100",
    "from-purple-100 via-violet-50 to-indigo-100",
    "from-blue-100 via-cyan-50 to-sky-100",
    "from-green-100 via-emerald-50 to-lime-100",
    "from-yellow-100 via-amber-50 to-orange-100",
    "from-red-100 via-rose-50 to-pink-100",
  ];

  useEffect(() => {
    API.get("/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div 
   // className="min-h-screen bg-gradient-to-br from-violet-500 rounded-lg to-green-100 py-10 px-4"
   className="min-h-screen rounded-lg py-10 px-4 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `url(${Bg})`,
  }}
    >
      <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700 drop-shadow-lg">
        ✨ Explore Our Services
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div
            key={service._id}
            className={`relative bg-gradient-to-br ${
              gradients[index % gradients.length]
            } rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:scale-105 duration-300 flex flex-col items-center border border-gray-200`}
          >
            {/* Header Badge */}
            <div className="absolute -top-4 px-6 py-1 rounded-full bg-white shadow-md text-gray-700 font-bold text-lg border">
              {service.name}
            </div>

            {/* Image Showcase */}
            <div className="mt-8 flex justify-center items-center">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-44 h-44 object-contain rounded-full border-4 border-white shadow-lg bg-white backdrop-blur-md"
                />
              ) : (
                <div className="flex items-center justify-center w-44 h-44 rounded-full border-4 border-white bg-gray-50 text-7xl shadow-md">
                  {service.icon}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 w-full text-center">
              <p className="text-gray-700 text-sm mt-2 font-bold line-clamp-3">
                {service.description}
              </p>

              <div className="mt-4 flex flex-col items-center gap-2">
                <span className="text-2xl font-extrabold text-green-700">
                  ₹ {service.price}
                </span>

                <Link
                  to={`/book/${service._id}`}
                  state={service}
                  className="mt-3 px-6 py-3 w-40 text-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-violet-700 hover:to-indigo-700 transition transform hover:scale-105"
                >
                  Book Now 🚀
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
