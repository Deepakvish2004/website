import React from 'react';
import { Link } from 'react-router-dom';

import Design from '../components/design';
import Footer from '../components/footer';
import Bg from "../assets/bg.jpg"

export default function Home() {
  return (
    <>
    <div className="min-h-screen rounded-lg flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 p-6"
    style={{
        backgroundImage: `url(${Bg})`,
      }}>
      <div className="bg-white rounded-lg shadow-lg border-2 border-blue-600 p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4 hover:text-green-600">Welcome to Hand Services</h1>
        <p className="mb-6">Book cleaners, helpers and washing services quickly.</p>
        
        {/* link */}
        <div className="space-x-4">
          <Link to="/services" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">View Services</Link>
        </div>
      </div>
     
    </div>
        <div className="border-b-2 border-l-2 border-r-2 border-blue-600  rounded-b-lg shadow-lg ">
      <Design />
        </div>
        <div className="border-2 border-blue-600  rounded-lg shadow-lg">
      <Footer />
        </div>
        </>
  );
}
