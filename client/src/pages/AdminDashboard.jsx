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
  const [selectedDate, setSelectedDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    date: '',
    mode: '',
    adjustMonth: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminAuth');
    if (!isAdmin) {
      navigate('/admin-login');
    } else {
      fetchRecords();
    }
  }, [navigate]);

  const fetchRecords = async (date = null) => {
    setLoading(true);
    try {
      const dateToUse = date !== null ? date : selectedDate;
      let queryString = '';
      
      if (dateToUse) {
        queryString = `fromDate=${dateToUse}&toDate=${dateToUse}`;
      }
      
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
    fetchRecords(selectedDate);
  };

  const handleUpdatePayment = async (id) => {
    if (!paymentData.amount || paymentData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!paymentData.date) {
      toast.error('Please select payment date');
      return;
    }
    if (!paymentData.mode) {
      toast.error('Please select mode of payment');
      return;
    }

    try {
      const response = await API.put(`/admin/update-payment/${id}`, {
        amountPaid: parseFloat(paymentData.amount),
        amountPaidDate: paymentData.date,
        modeOfPayment: paymentData.mode,
        adjustMonth: paymentData.adjustMonth
      });

      if (response.data.success) {
        toast.success('Payment updated successfully!');
        setEditingId(null);
        setPaymentData({ amount: '', date: '', mode: '', adjustMonth: '' });
        fetchRecords();
      }
    } catch (error) {
      toast.error('Failed to update payment');
    }
  };

  const handleExportExcel = async () => {
    try {
      const exportData = selectedDate ? {
        fromDate: selectedDate,
        toDate: selectedDate
      } : {};
      
      const response = await API.post('/admin/export-excel', exportData, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `salary_records_${selectedDate || 'all'}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Excel file downloaded successfully!');
    } catch (error) {
      toast.error('Failed to export Excel');
    }
  };

  const clearFilters = () => {
    setSelectedDate('');
    fetchRecords('');
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
            <h3 className="text-xl font-bold text-gray-800">Filter by Date</h3>
          </div>
          
          <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-gray-700 font-medium mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
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
              Show All
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
                      <th className="px-4 py-3 text-left text-sm">Serial Number</th>
                      <th className="px-4 py-3 text-left text-sm">User Name</th>
                      <th className="px-4 py-3 text-left text-sm">Department</th>
                      <th className="px-4 py-3 text-left text-sm">Location</th>
                      <th className="px-4 py-3 text-left text-sm">Amount Requested</th>
                      <th className="px-4 py-3 text-left text-sm">Date</th>
                      <th className="px-4 py-3 text-left text-sm">Amount Paid Date</th>
                      <th className="px-4 py-3 text-left text-sm">Amount Paid</th>
                      <th className="px-4 py-3 text-left text-sm">Mode of Payment</th>
                      <th className="px-4 py-3 text-left text-sm">Adjust Month</th>
                      <th className="px-4 py-3 text-left text-sm">Status</th>
                      <th className="px-4 py-3 text-left text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {records.map((record, index) => (
                      <tr key={record._id} className="hover:bg-gray-50 text-sm">
                        <td className="px-4 py-3 text-gray-800">{index + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{record.userName}</td>
                        <td className="px-4 py-3 text-gray-600">{record.department}</td>
                        <td className="px-4 py-3 text-gray-600">{record.location}</td>
                        <td className="px-4 py-3 text-gray-800 font-semibold">₹{record.amountRequested.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-600">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          {editingId === record._id ? (
                            <input
                              type="date"
                              value={paymentData.date}
                              onChange={(e) => setPaymentData({...paymentData, date: e.target.value})}
                              className="w-32 px-2 py-1 border rounded text-xs"
                            />
                          ) : (
                            <span className="text-gray-600">
                              {record.amountPaidDate ? new Date(record.amountPaidDate).toLocaleDateString() : '-'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === record._id ? (
                            <input
                              type="number"
                              value={paymentData.amount}
                              onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                              className="w-24 px-2 py-1 border rounded text-xs"
                              placeholder="Amount"
                            />
                          ) : (
                            <span className="text-gray-800 font-semibold">₹{record.amountPaid.toLocaleString()}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === record._id ? (
                            <select
                              value={paymentData.mode}
                              onChange={(e) => setPaymentData({...paymentData, mode: e.target.value})}
                              className="w-32 px-2 py-1 border rounded text-xs"
                            >
                              <option value="">Select</option>
                              <option value="Bank Transfer">Bank Transfer</option>
                              <option value="Cash">Cash</option>
                              <option value="Online">Online</option>
                            </select>
                          ) : (
                            <span className="text-gray-600">{record.modeOfPayment || '-'}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editingId === record._id ? (
                            <input
                              type="text"
                              value={paymentData.adjustMonth}
                              onChange={(e) => setPaymentData({...paymentData, adjustMonth: e.target.value})}
                              className="w-24 px-2 py-1 border rounded text-xs"
                              placeholder="Month"
                            />
                          ) : (
                            <span className="text-gray-600">{record.adjustMonth || '-'}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {editingId === record._id ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleUpdatePayment(record._id)}
                                className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setPaymentData({ amount: '', date: '', mode: '', adjustMonth: '' });
                                }}
                                className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : record.isPaid ? (
                            <span className="text-gray-400 text-xs italic">
                              Already Paid
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingId(record._id);
                                setPaymentData({
                                  amount: record.amountPaid.toString(),
                                  date: record.amountPaidDate ? new Date(record.amountPaidDate).toISOString().split('T')[0] : '',
                                  mode: record.modeOfPayment || '',
                                  adjustMonth: record.adjustMonth || ''
                                });
                              }}
                              className="text-green-600 hover:text-green-800 flex items-center gap-1 text-xs"
                            >
                              <Edit2 className="w-3 h-3" />
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
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-800">
                      Total Amount Requested:
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-800">
                      Total Amount Paid:
                    </span>
                    <span className="text-2xl font-bold text-emerald-600">
                      ₹{records.reduce((sum, r) => sum + (r.amountPaid || 0), 0).toLocaleString()}
                    </span>
                  </div>
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
