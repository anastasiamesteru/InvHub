import React from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
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
    </div>
  );
};

export default Navbar;
