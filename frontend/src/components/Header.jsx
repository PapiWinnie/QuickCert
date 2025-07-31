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
    <header style={{
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        width: '100%'
      }}>
        <Link to="/dashboard" style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#4f46e5',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => {
          e.target.style.color = '#3730a3';
        }}
        onMouseLeave={(e) => {
          e.target.style.color = '#4f46e5';
        }}>
          QuickCert
        </Link>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {auth.isAuthenticated && (
            <span style={{
              color: '#4b5563',
              whiteSpace: 'nowrap'
            }}>
              Welcome, <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{auth.role}</span>
            </span>
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              fontWeight: '500',
              color: 'white',
              backgroundColor: '#ef4444',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ef4444';
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 