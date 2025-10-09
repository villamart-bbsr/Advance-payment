import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Plus } from 'lucide-react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    const isUser = localStorage.getItem('userAuth');
    
    if (!isUser || !userName) {
      navigate('/user');
    } else {
      fetchUserData(userName);
    }
  }, [navigate]);

  const fetchUserData = async (userName) => {
    setLoading(true);
    try {
      const response = await API.get(`/user/${userName}`);
      
      if (response.data.success) {
        setUser(response.data.user);
        setRequests(response.data.requests);
      }
    } catch (error) {
      toast.error('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const totalRequested = requests.reduce((sum, req) => sum + req.amountRequested, 0);
  const totalPaid = requests.reduce((sum, req) => sum + req.amountPaid, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <User className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">{user?.name}</h2>
                    <div className="flex gap-4 mt-1">
                      <p className="text-sm text-gray-500">Department: <span className="font-medium text-gray-700">{user?.department}</span></p>
                      <p className="text-sm text-gray-500">Location: <span className="font-medium text-gray-700">{user?.location}</span></p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate('/user')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  New Request
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-6">
                  <p className="text-green-800 font-semibold mb-2">Total Requests</p>
                  <p className="text-3xl font-bold text-green-600">{requests.length}</p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl p-6">
                  <p className="text-emerald-800 font-semibold mb-2">Total Requested</p>
                  <p className="text-3xl font-bold text-emerald-600">₹{totalRequested.toLocaleString()}</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-6">
                  <p className="text-green-800 font-semibold mb-2">Total Paid</p>
                  <p className="text-3xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h3 className="text-2xl font-bold text-white">My Requests</h3>
              </div>

              {requests.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No requests found. Submit your first request!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-gray-700 font-semibold">Date</th>
                        <th className="px-6 py-4 text-left text-gray-700 font-semibold">Amount Requested</th>
                        <th className="px-6 py-4 text-left text-gray-700 font-semibold">Reason</th>
                        <th className="px-6 py-4 text-left text-gray-700 font-semibold">Amount Paid</th>
                        <th className="px-6 py-4 text-left text-gray-700 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {requests.map((request) => (
                        <tr key={request._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-800">
                            {new Date(request.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-gray-800 font-semibold">
                            ₹{request.amountRequested.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-gray-600 max-w-xs">
                            <div className="truncate" title={request.reason}>
                              {request.reason || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-800 font-semibold">
                            ₹{request.amountPaid.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              request.isPaid 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.isPaid ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
