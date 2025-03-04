import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Invoice from './pages/Invoice';
import Database from './pages/Database';
import Report from './pages/Report';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {window.location.pathname !== '/login' && window.location.pathname !== '/register' && <Navbar />}
      <main className="flex-grow min-h-screen w-full">
        <Routes>
          {/* Redirect root to login page */}
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/database" element={<Database />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
