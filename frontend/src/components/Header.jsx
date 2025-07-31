import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';

const Header = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container flex items-center justify-between p-4 mx-auto">
        <Link to="/dashboard" className="text-xl font-bold text-indigo-600 hover:text-indigo-800">
          QuickCert
        </Link>
        <div className="flex items-center gap-4">
          {auth.isAuthenticated && (
            <span className="text-gray-600 whitespace-nowrap">
              Welcome, <span className="font-semibold capitalize">{auth.role}</span>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 whitespace-nowrap"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 