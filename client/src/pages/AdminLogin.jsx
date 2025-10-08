import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Lock, LogIn } from 'lucide-react';
import API from '../api/axios';

const AdminLogin = () => {
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post('/admin/login', { adminKey });
      
      if (response.data.success) {
        localStorage.setItem('adminAuth', 'true');
        toast.success('Login successful!');
        navigate('/admin-dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid admin key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <Lock className="w-12 h-12 text-green-600" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Admin Login
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Enter your admin key to access the dashboard
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Admin Key
            </label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
              placeholder="Enter admin key"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Login
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-green-600 hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
