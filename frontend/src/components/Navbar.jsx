import React from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="flex items-center justify-between border-b border-gray-300 px-4 py-2 shadow">
      <img className="w-40" src={assets.Logo} alt="Logo" />
      <ul className="flex items-center justify-center gap-8 w-full text-md">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "text-purple-500 font-bold transition-colors duration-300"
              : "text-black hover:text-purple-500 transition-colors duration-300"
          }
        >
          <li>Dashboard</li>
        </NavLink>
        <NavLink
          to="/invoice"
          className={({ isActive }) =>
            isActive
              ? "text-purple-500 font-bold transition-colors duration-300"
              : "text-black hover:text-purple-500 transition-colors duration-300"
          }
        >
          <li>Invoice</li>
        </NavLink>
        <NavLink
          to="/report"
          className={({ isActive }) =>
            isActive
              ? "text-purple-500 font-bold transition-colors duration-300"
              : "text-black hover:text-purple-500 transition-colors duration-300"
          }
        >
          <li>Report</li>
        </NavLink>
        <NavLink
          to="/database"
          className={({ isActive }) =>
            isActive
              ? "text-purple-500 font-bold transition-colors duration-300"
              : "text-black hover:text-purple-500 transition-colors duration-300"
          }
        >
          <li>Database</li>
        </NavLink>
      </ul>
      <div className="flex gap-2 items-center">
                        <button
                            className="px-4 py-2 w-32 bg-purple-600 border-2 text-white font-semibold text-sm rounded-lg hover:border-purple-700 hover:bg-purple-700 transition-colors"
                        >
                            Log Out
                        </button>
                        </div>
    </div>


  );
};

export default Navbar;
