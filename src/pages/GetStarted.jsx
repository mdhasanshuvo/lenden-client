import React from 'react';
import { Link } from 'react-router-dom';

const GetStarted = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-12">
        {/* Brand Cover */}
        <header className="text-center text-white py-12">
          <h1 className="text-6xl font-bold font-mono">LanDan</h1>
          <p className="text-xl mt-2">Your gateway to seamless financial management.</p>
        </header>

        {/* Main Content */}
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Landan
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Explore easy and secure financial services to manage your money. Let's get you started with Landan!
          </p>

          {/* Get Started Button */}
          <Link to="/auth/register">
            <button className="bg-indigo-600 text-white text-lg py-2 px-8 rounded-full shadow-md hover:bg-indigo-700 focus:outline-none transition duration-300">
              Get Started
            </button>
          </Link>

          {/* Login Link */}
          <div className="mt-4">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-indigo-600 hover:text-indigo-800">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
