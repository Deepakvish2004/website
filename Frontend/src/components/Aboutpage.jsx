import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex flex-col justify-center items-center bg-[url('https://images.unsplash.com/photo-1581091012184-5c65d5b6fcf6')] bg-cover bg-center text-white shadow-lg">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            About <span className="text-violet-300">Hand</span>
          </h1>
          <p className="mt-3 max-w-xl mx-auto text-lg md:text-xl text-gray-200">
            Your one-stop solution for trusted Helper Hand services. We connect you
            with skilled professionals—fast, secure, and reliable.
          </p>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="py-16 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold text-violet-700 mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To make service booking as simple as ordering food. We aim to create
            a platform where customers and workers both feel empowered and
            respected, ensuring convenience and trust every step of the way.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold text-indigo-700 mb-3">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To become the #1 platform for home & Helper Hand services globally —
            enabling millions of workers to earn with dignity while providing
            customers with seamless access to reliable services.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-violet-800 mb-4">Our Story</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Helper Hand Service was born out of a simple idea: life is too short to spend time
          worrying about finding trustworthy help. From home cleaning to
          essential services, we wanted to build a platform that is transparent,
          secure, and easy to use. Today, we are proud to help hundreds of users
          book services every single day — and we are just getting started.
        </p>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-violet-800 mb-10">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {["Founder", "Developer", "Support"].map((role, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 flex flex-col items-center transition"
            >
              <img
                src={`https://i.pravatar.cc/150?img=${i + 10}`}
                alt={role}
                className="h-24 w-24 rounded-full shadow-md mb-4"
              />
              <h3 className="text-lg font-bold text-gray-800">Team {role}</h3>
              <p className="text-gray-500 text-sm">
                Passionate about making your life easier.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="bg-gradient-to-r from-violet-400 to-indigo-500 py-12 px-6 text-center text-white">
        <h2 className="text-3xl font-extrabold mb-4">Ready to Book a Service?</h2>
        <p className="mb-6 text-lg">
          Get started today and make your life hassle-free.
        </p>
        <a
          href="/services"
          className="bg-white text-violet-700 font-semibold px-6 py-3 rounded-full shadow-md hover:scale-105 hover:bg-gray-100 transition"
        >
          Explore Services
        </a>
      </section>
    </div>
  );
}
