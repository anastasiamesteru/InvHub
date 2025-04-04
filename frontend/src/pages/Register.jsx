import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../assets/assets';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    let hasError = false;

    if (!email) {
      newErrors.email = 'E-mail is required!';
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid e-mail format!';
      hasError = true;
    }

    if (!password) {
      newErrors.password = 'Password is required!';
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters!';
      hasError = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required!';
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match!';
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/auth/register', {
        email,
        password,
      });

      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || 'Something went wrong');
      setFormError(error.response?.data?.message || 'Registration failed, please try again.');
    }
    setLoading(false);
  };

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

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Create Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white font-semibold py-2 rounded-md hover:bg-purple-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          {formError && <p className="text-red-500 text-sm mt-3 text-center">{formError}</p>}
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
