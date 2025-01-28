import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';


const Login = () => {
  return (
    <div className="bg-gradient-radial from-purple-200 via-purple-100 to-white flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-200">
        <div className="flex justify-center mb-4">
          <img className="w-50" src={assets.Logo} alt="Logo" />
        </div>

        <h1 className="text-2xl font-semibold text-center mb-3">Login</h1>
        <p className="text-xs text-gray-700 mb-6">So glad to see you again! Log in to continue invoicing.</p>

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
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white font-semibold py-2 rounded-md hover:bg-purple-600 transition-colors"
          >
            Login
          </button>
          <p className="text-xs text-gray-700 mt-3">
            Don't have an account?
            <Link to="/register" className="text-purple-500 underline hover:text-purple-600 ml-1">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
