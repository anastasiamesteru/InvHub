import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Register = () => {
  return (
     <div
          className="flex justify-center items-center min-h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${assets.Bg})` }} 
        >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex justify-center mb-4">
          <img className="w-50" src={assets.Logo} alt="Logo" />
        </div>
        <h1 className="text-2xl font-semibold text-center mb-3">Register</h1>
        <p className="text-sm text-gray-700 mb-6">First time here? Can't wait to get you up and running!</p>

        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700"> Create Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Confirm your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white font-semibold py-2 rounded-md hover:bg-purple-600 transition-colors"
          >
            Register
          </button>
          <p className="text-sm text-gray-700 mt-3">
            Already have an account?
            <Link to="/login" className="text-purple-500 underline hover:text-purple-600 ml-1">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
