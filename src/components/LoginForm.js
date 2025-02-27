import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const LoginForm = ({ onLogin, switchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      onLogin(data.user);
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-2 text-base border rounded focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 text-base border rounded focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {message && (
        <div className="mt-4 p-3 text-sm text-center rounded bg-red-50 text-red-500">
          {message}
        </div>
      )}
      <div className="mt-4 text-center text-sm">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={switchToRegister}
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 