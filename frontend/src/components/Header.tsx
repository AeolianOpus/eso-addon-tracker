import { Shield, Swords, Crown } from 'lucide-react';
import './Header.css';

function Header() {
  return (
    <div className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-icon">
            <Shield size={48} strokeWidth={1.5} />
            <Crown size={24} className="crown-overlay" />
          </div>
          <div className="logo-text">
            <h1>ESO ADDON</h1>
            <span className="subtitle">TRACKER</span>
          </div>
        </div>
        <div className="header-decoration">
          <Swords size={32} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

export default Header;