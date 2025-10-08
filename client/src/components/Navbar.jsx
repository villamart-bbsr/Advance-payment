import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.includes('admin');
  const isLoggedIn = localStorage.getItem(isAdmin ? 'adminAuth' : 'userAuth');

  const handleLogout = () => {
    if (isAdmin) {
      localStorage.removeItem('adminAuth');
      navigate('/admin-login');
    } else {
      localStorage.removeItem('userAuth');
      localStorage.removeItem('userName');
      navigate('/user');
    }
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <Logo size="small" showText={true} />
          </Link>
          
          {isLoggedIn && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {isAdmin ? 'Admin Portal' : 'User Portal'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors duration-200 font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
