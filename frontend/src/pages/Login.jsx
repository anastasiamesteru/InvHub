import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(''); 

  const validateForm = () => {
    let newErrors = {};
    let hasError = false;

    if (!email) {
      newErrors.email = 'E-mail is required!';
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid e-mail format! Ensure it contains "@" and a valid domain.';
      hasError = true;
    }

    if (!password) {
      newErrors.password = 'Password is required!';
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters!';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      setFormError('Email or password is incorrect'); 
    } else {
      setFormError(''); 
    }

    return !hasError;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log('Login successful!');
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${assets.Bg})` }} 
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex justify-center mb-4">
          <img className="w-65" src={assets.Logo} alt="Logo" />
        </div>

        <h1 className="text-2xl font-semibold text-center mb-3">Login</h1>
        <p className="text-sm text-gray-700 mb-6">
          So glad to see you again! Log in to continue invoicing.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 p-2 w-full border rounded-md ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 p-2 w-full border rounded-md ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {formError && <p className="text-red-500 text-sm text-center mb-4">{formError}</p>} {/* Overall error message */}

          <button
            type="submit"
            className="w-full bg-purple-500 text-white font-semibold py-2 rounded-md hover:bg-purple-600 transition-colors"
          >
            Login
          </button>

          <p className="text-sm text-gray-700 mt-3">
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
