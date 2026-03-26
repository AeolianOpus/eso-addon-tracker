import { List, Plus } from 'lucide-react';
import './Navigation.css';

interface NavigationProps {
  currentPage: 'create' | 'list';
  onNavigate: (page: 'create' | 'list') => void;
}

function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <button
          className={currentPage === 'list' ? 'active' : ''}
          onClick={() => onNavigate('list')}
        >
          <List size={18} />
          <span>My Addons</span>
        </button>
        <button
          className={currentPage === 'create' ? 'active' : ''}
          onClick={() => onNavigate('create')}
        >
          <Plus size={18} />
          <span>Add New</span>
        </button>
      </div>
    </nav>
  );
}

export default Navigation;