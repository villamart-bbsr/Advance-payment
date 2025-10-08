import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Download, Filter, UserPlus, DollarSign, Calendar, Edit2 } from 'lucide-react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [records, setRecords] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminAuth');
    if (!isAdmin) {
      navigate('/admin-login');
    } else {
      fetchRecords();
    }
  }, [navigate]);

  const fetchRecords = async (dateFilters = null) => {
    setLoading(true);
    try {
      const params = dateFilters || filters;
      const queryString = new URLSearchParams(
        Object.entries(params).filter(([_, v]) => v)
      ).toString();
      
      const response = await API.get(`/admin/salary-records?${queryString}`);
      
      if (response.data.success) {
        setRecords(response.data.records);
        setTotalAmount(response.data.totalAmount);
      }
    } catch (error) {
      toast.error('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchRecords(filters);
  };

  const handleUpdatePayment = async (id) => {
    if (!paymentAmount || paymentAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const response = await API.put(`/admin/update-payment/${id}`, {
        amountPaid: parseFloat(paymentAmount)
      });

      if (response.data.success) {
        toast.success('Payment updated successfully!');
        setEditingId(null);
        setPaymentAmount('');
        fetchRecords();
      }
    } catch (error) {
      toast.error('Failed to update payment');
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await API.post('/admin/export-excel', filters, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `salary_records_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Excel file downloaded successfully!');
    } catch (error) {
      toast.error('Failed to export Excel');
    }
  };

  const clearFilters = () => {
    setFilters({ fromDate: '', toDate: '' });
    fetchRecords({ fromDate: '', toDate: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/add-user')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add New User
            </button>
            
            <button
              onClick={handleExportExcel}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800">Filter Records</h3>
          </div>
          
          <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-gray-700 font-medium mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-gray-700 font-medium mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Apply Filter
            </button>
            
            <button
              type="button"
              onClick={clearFilters}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </form>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <LoadingSpinner />
          ) : records.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No records found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">User Name</th>
                      <th className="px-6 py-4 text-left">Designation</th>
                      <th className="px-6 py-4 text-left">Department</th>
                      <th className="px-6 py-4 text-left">Location</th>
                      <th className="px-6 py-4 text-left">Amount Requested</th>
                      <th className="px-6 py-4 text-left">Date</th>
                      <th className="px-6 py-4 text-left">Amount Paid</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {records.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {record.userName}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {record.designation}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {record.department}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {record.location}
                        </td>
                        <td className="px-6 py-4 text-gray-800 font-semibold">
                          ₹{record.amountRequested.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === record._id ? (
                            <input
                              type="number"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              className="w-32 px-3 py-1 border-2 border-green-500 rounded"
                              placeholder="Amount"
                              autoFocus
                            />
                          ) : (
                            <span className="text-gray-800 font-semibold">
                              ₹{record.amountPaid.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            record.isPaid 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {editingId === record._id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdatePayment(record._id)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setPaymentAmount('');
                                }}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingId(record._id);
                                setPaymentAmount(record.amountPaid.toString());
                              }}
                              className="text-green-600 hover:text-green-800 flex items-center gap-1"
                            >
                              <Edit2 className="w-4 h-4" />
                              Update
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-4 border-t-4 border-green-600">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-800">
                    Total Amount Requested:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
