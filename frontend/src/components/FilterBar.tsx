import { Search, Filter, ArrowUpDown } from 'lucide-react';
import './FilterBar.css';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  modifiedFilter: boolean | null;
  onModifiedChange: (value: boolean | null) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

function FilterBar({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  modifiedFilter,
  onModifiedChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-section search-section">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or author..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="filter-section">
        <Filter size={16} />
        <select value={categoryFilter} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="">All Categories</option>
          <option value="UI">UI</option>
          <option value="Combat">Combat</option>
          <option value="Crafting">Crafting</option>
          <option value="Map">Map</option>
          <option value="Trading">Trading</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="filter-section">
        <Filter size={16} />
        <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      <div className="filter-section">
        <Filter size={16} />
        <select
          value={modifiedFilter === null ? '' : modifiedFilter ? 'modified' : 'unmodified'}
          onChange={(e) =>
            onModifiedChange(
              e.target.value === '' ? null : e.target.value === 'modified'
            )
          }
        >
          <option value="">All Addons</option>
          <option value="modified">Modified Only</option>
          <option value="unmodified">Unmodified Only</option>
        </select>
      </div>

      <div className="filter-section">
        <ArrowUpDown size={16} />
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
          <option value="category">Sort by Category</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;