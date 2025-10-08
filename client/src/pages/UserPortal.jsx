import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Send } from 'lucide-react';
import API from '../api/axios';

const UserPortal = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const handleUserSelect = async (userName) => {
    setSelectedUser(userName);
    
    if (userName) {
      try {
        const response = await API.get(`/user/details/${userName}`);
        if (response.data.success) {
          setDesignation(response.data.user.designation);
          setDepartment(response.data.user.department);
          setLocation(response.data.user.location);
        }
      } catch (error) {
        toast.error('Failed to fetch user details');
      }
    } else {
      setDesignation('');
      setDepartment('');
      setLocation('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) {
      toast.error('Please select a user');
      return;
    }

    setLoading(true);

    try {
      const response = await API.post('/user/request', {
        userName: selectedUser,
        designation: designation,
        department: department,
        location: location,
        amountRequested: parseFloat(formData.amount),
        date: formData.date
      });

      if (response.data.success) {
        toast.success('Request submitted successfully!');
        localStorage.setItem('userAuth', 'true');
        localStorage.setItem('userName', selectedUser);
        setTimeout(() => navigate('/user-dashboard'), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDashboard = () => {
    if (!selectedUser) {
      toast.error('Please select your name first');
      return;
    }
    localStorage.setItem('userAuth', 'true');
    localStorage.setItem('userName', selectedUser);
    navigate('/user-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-100 p-3 rounded-lg">
            <User className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">User Portal</h2>
            <p className="text-gray-600">Submit your advance salary request</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Select Your Name
            </label>
            <select
              value={selectedUser}
              onChange={(e) => handleUserSelect(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
              required
            >
              <option value="">-- Select Name --</option>
              {users.map((user) => (
                <option key={user._id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Designation
            </label>
            <input
              type="text"
              value={designation}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
              placeholder="Auto-filled from database"
              disabled
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Department
            </label>
            <input
              type="text"
              value={department}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
              placeholder="Auto-filled from database"
              disabled
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
              placeholder="Auto-filled from database"
              disabled
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Amount Requested (₹)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
              placeholder="Enter amount"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Date of Request
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Request
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleViewDashboard}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              View My Requests
            </button>
          </div>
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

export default UserPortal;
