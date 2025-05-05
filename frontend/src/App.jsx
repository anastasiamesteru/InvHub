import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Invoice from './pages/Invoice';
import Database from './pages/Database';
import Report from './pages/Report';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    // Force redirect to login on first load if not authenticated
    if (!token && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/login');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const hideNavbarPaths = ['/login', '/register'];
  const shouldShowNavbar = isAuthenticated && !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen w-full">
      {shouldShowNavbar && <Navbar onLogout={handleLogout} />}
      <main className="flex-grow min-h-screen w-full">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/database" element={<Database />} />
              <Route path="/report" element={<Report />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </main>
    </div>
  );
};

export default App;
