import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users } from 'lucide-react';
import Logo from '../components/Logo';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
          <img src="/villamart-logo.png" alt="VillaMart Logo"  />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Advance Salary Manager
          </h1>
          <p className="text-xl text-gray-600">
            Manage advance salary requests efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Admin Portal Card */}
          <Link to="/admin-login">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-green-500">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-6 rounded-full">
                  <Shield className="w-16 h-16 text-green-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                Admin Portal
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Manage users, view all salary requests, update payments, and export records
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Add and manage users</li>
                  <li>✓ View all salary records</li>
                  <li>✓ Update payment status</li>
                  <li>✓ Export to Excel</li>
                </ul>
              </div>
            </div>
          </Link>

          {/* User Portal Card */}
          <Link to="/user">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-emerald-500">
              <div className="flex justify-center mb-6">
                <div className="bg-emerald-100 p-6 rounded-full">
                  <Users className="w-16 h-16 text-emerald-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
                User Portal
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Submit advance salary requests and track your payment status
              </p>
              <div className="bg-emerald-50 rounded-lg p-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Submit salary requests</li>
                  <li>✓ View request history</li>
                  <li>✓ Track payment status</li>
                  <li>✓ Easy-to-use interface</li>
                </ul>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
