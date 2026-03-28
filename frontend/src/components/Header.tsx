import { Shield, Swords, Crown, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <div className="logo-icons">
            <Swords className="swords-left" size={28} strokeWidth={1.5} />
            <div className="crown-shield">
              <Crown size={20} strokeWidth={1.5} className="crown" />
              <Shield size={40} strokeWidth={1.5} className="shield" />
            </div>
            <Swords className="swords-right" size={28} strokeWidth={1.5} />
          </div>
          <div className="header-text">
            <h1>ESO Addon Tracker</h1>
            <p>Manage Your Elder Scrolls Online Addons</p>
          </div>
        </div>
        
        {user && (
          <div className="header-user">
            <span className="username">{user.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;