import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Invoice from './pages/Invoice';
import Database from './pages/Database';
import Report from './pages/Report';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className="flex flex-col h-screen">
      {window.location.pathname !== '/login' && window.location.pathname !== '/register' && <Navbar />}
      <main className="flex-grow w-full px-4 sm:px-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/database" element={<Database />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
