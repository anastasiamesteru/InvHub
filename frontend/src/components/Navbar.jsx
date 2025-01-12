import React from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="flex items-center justify-between border-b border-gray-300 px-4 py-2">
      <img className="w-40" src={assets.Logo} alt="Logo" />
      <ul className="flex items-center justify-center gap-8 w-full text-md">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-bold transition-colors duration-300"
              : "text-black hover:text-blue-500 transition-colors duration-300"
          }
        >
          <li>Dashboard</li>
        </NavLink>
        <NavLink
          to="/invoice"
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-bold transition-colors duration-300"
              : "text-black hover:text-blue-500 transition-colors duration-300"
          }
        >
          <li>Invoice</li>
        </NavLink>
        <NavLink
          to="/report"
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-bold transition-colors duration-300"
              : "text-black hover:text-blue-500 transition-colors duration-300"
          }
        >
          <li>Report</li>
        </NavLink>
        <NavLink
          to="/database"
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-bold transition-colors duration-300"
              : "text-black hover:text-blue-500 transition-colors duration-300"
          }
        >
          <li>Database</li>
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-gray-700 hover:text-blue-500 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V9a6 6 0 10-12 0v5c0 .372-.155.714-.405.957L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-gray-700 hover:text-blue-500 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"

            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Navbar;
