import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Notifications from '../Notifications/Notifications';
import './Header.css';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="logo">BlogApp</h1>
        </div>
        <nav className="header-nav">
          {isAuthenticated ? (
            <div className="user-menu">
              <Notifications />
              <span className="user-greeting">
                Welcome, {user?.firstName}
                {user?.role === 'ADMIN' && <span className="admin-badge">Admin</span>}
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <a href="/login" className="auth-link">Login</a>
              <a href="/signup" className="auth-link">Sign Up</a>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;