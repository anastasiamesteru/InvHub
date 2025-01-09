import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {

  //const navigate = useNavigate();
  ///const [showMenu, setMenu] = useState(false);
  //const [token, setToken] = useState(true);

  return (
    <div className="navbar">
      <img className="navbar-logo" src={assets.Logo} alt="Logo" />
      <ul className="navbar-menu">
        <NavLink to="/dashboard">
          <li>Dashboard</li>
          <hr />
        </NavLink>
        <NavLink to="/invoice">
          <li>Invoice</li>
          <hr />
        </NavLink>
        <NavLink to="/report">
          <li>Report</li>
          <hr />
        </NavLink>
        <NavLink to="/database">
          <li>Database</li>
          <hr />
        </NavLink>
      </ul>
      <div className="navbar-icons"> 
      <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V9a6 6 0 10-12 0v5c0 .372-.155.714-.405.957L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>

      </div>

    </div>
  );
};

export default Navbar;
