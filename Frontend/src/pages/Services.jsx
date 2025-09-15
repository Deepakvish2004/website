import React from 'react';
import { useNavigate } from 'react-router-dom';
import cleaner from '../assets/cleaner.jpg';
import washing from '../assets/washing.jpg';
import cleaners from '../assets/cleaners.jpg';

const services = [
  { id: 'cleaners', name: 'Cleaners', desc: 'Home cleaning service', image: cleaner, price: 200 },
  { id: 'helper',  name: 'Helper',  desc: 'Daily helper',           image: cleaners, price: 150 },
  { id: 'washing', name: 'Washing', desc: 'Laundry service',        image: washing, price: 100 }
];

export default function Services({ user }) {
  const navigate = useNavigate();

  const handleBook = (service) => {
    if (user) {
      // ✅ User logged in → go to booking page
      navigate(`/book/${service.id}`, {
        state: { id: service.id, name: service.name, price: service.price }
      });
    } else {
      // ❌ Not logged in → go to login
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 relative overflow-hidden">
      {/* Overlay blur effect */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

      <h2 className="text-5xl font-extrabold text-white mb-8 text-center relative z-10 drop-shadow-lg">
        Our Services
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {services.map((s) => (
          <div
            key={s.id}
            className="p-[3px] rounded-xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:scale-105 transform transition duration-300"
          >
            {/* Inner card */}
            <div className="relative p-6 bg-white rounded-xl shadow-lg h-full">
              <img
                src={s.image}
                alt={s.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <h3 className="text-2xl font-bold text-gray-800 mt-4">{s.name}</h3>
              <p className="text-gray-600">{s.desc}</p>

              {/* PRICE */}
              <p className="text-lg font-semibold text-green-700 mt-2">
                ₹{s.price}
              </p>

              {/* BOOK NOW button */}
              <button
                onClick={() => handleBook(s)}
                className="mt-4 inline-block text-sm text-blue-600 font-semibold hover:underline"
              >
                Book now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
