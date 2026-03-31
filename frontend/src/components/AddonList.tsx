import { useState, useEffect } from 'react';
import { getAllAddons, deleteAddon } from '../services/api';
import type { Addon } from '../types/addon';
import FilterBar from './FilterBar';
import { 
  Trash2, 
  User, 
  Package, 
  Tag, 
  Star, 
  Link as LinkIcon, 
  CheckCircle, 
  XCircle,
  Swords,
  Layout,
  Map,
  Hammer,
  ShoppingCart,
  Box,
  Code,
  ChevronDown,
  ChevronUp,
  Edit
} from 'lucide-react';
import './AddonList.css';

interface AddonListProps {
  onEdit: (addon: Addon) => void;
}

function AddonList({ onEdit }: AddonListProps) {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCode, setExpandedCode] = useState<number | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modifiedFilter, setModifiedFilter] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    loadAddons();
  }, []);

  const loadAddons = async () => {
    try {
      setLoading(true);
      const data = await getAllAddons();
      setAddons(data);
      setError(null);
    } catch (err) {
      setError('Failed to load addons');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this addon?')) return;

    try {
      await deleteAddon(id);
      setAddons(addons.filter(addon => addon.id !== id));
    } catch (err) {
      setError('Failed to delete addon');
      console.error(err);
    }
  };

  const getCategoryIcon = (category?: string) => {
    const iconProps = { size: 48, strokeWidth: 1.5 };
    
    switch (category?.toLowerCase()) {
      case 'combat':
        return <Swords {...iconProps} />;
      case 'ui':
        return <Layout {...iconProps} />;
      case 'map':
        return <Map {...iconProps} />;
      case 'crafting':
        return <Hammer {...iconProps} />;
      case 'trading':
        return <ShoppingCart {...iconProps} />;
      default:
        return <Box {...iconProps} />;
    }
  };

  const toggleCodeExpand = (addonId: number) => {
    setExpandedCode(expandedCode === addonId ? null : addonId);
  };

  // Filter and sort addons
  const filteredAddons = addons
    .filter(addon => {
      // Search filter
      const matchesSearch = 
        addon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (addon.author && addon.author.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Category filter
      const matchesCategory = !categoryFilter || addon.category === categoryFilter;
      
      // Status filter
      const matchesStatus = 
        !statusFilter ||
        (statusFilter === 'active' && addon.is_active) ||
        (statusFilter === 'inactive' && !addon.is_active);
      
      // Modified filter
      const matchesModified = 
        modifiedFilter === null ||
        addon.has_custom_changes === modifiedFilter;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesModified;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        default:
          return 0;
      }
    });

  if (loading) return <div className="loading">Loading addons...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="addon-list">
      <div className="list-header">
        <h2>My Collection</h2>
        <div className="addon-count">{filteredAddons.length} of {addons.length} Addon{addons.length !== 1 ? 's' : ''}</div>
      </div>

      {addons.length > 0 && (
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          modifiedFilter={modifiedFilter}
          onModifiedChange={setModifiedFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}
      
      {addons.length === 0 ? (
        <div className="empty-state">
          <Package size={64} strokeWidth={1} />
          <p>No addons in your collection yet</p>
          <span>Click "Add New" to start tracking your ESO addons</span>
        </div>
      ) : filteredAddons.length === 0 ? (
        <div className="empty-state">
          <Package size={64} strokeWidth={1} />
          <p>No addons match your filters</p>
          <span>Try adjusting your search or filters</span>
        </div>
      ) : (
        <div className="addons-grid">
          {filteredAddons.map(addon => (
            <div key={addon.id} className="addon-card">
              <div className="card-header">
                <div className="category-icon">
                  {getCategoryIcon(addon.category)}
                </div>
                <div className="addon-name">
                  <h3>{addon.name}</h3>
                  <div className="badges-row">
                    <div className={`status-badge ${addon.is_active ? 'active' : 'inactive'}`}>
                      {addon.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      <span>{addon.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                    {addon.has_custom_changes && (
                      <div className="code-badge">
                        <Code size={14} />
                        <span>Modified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="addon-details">
                {addon.author && (
                  <div className="detail-row">
                    <User size={16} />
                    <span>{addon.author}</span>
                  </div>
                )}
                {addon.version && (
                  <div className="detail-row">
                    <Package size={16} />
                    <span>v{addon.version}</span>
                  </div>
                )}
                {addon.category && (
                  <div className="detail-row">
                    <Tag size={16} />
                    <span>{addon.category}</span>
                  </div>
                )}
                {addon.rating && (
                  <div className="detail-row rating">
                    <Star size={16} fill="#d4a554" stroke="#d4a554" />
                    <span>{addon.rating}/5</span>
                  </div>
                )}
                {addon.esoui_link && (
                  <div className="detail-row link">
                    <LinkIcon size={16} />
                    <a href={addon.esoui_link} target="_blank" rel="noopener noreferrer">
                      View on ESOUI
                    </a>
                  </div>
                )}
                {addon.personal_notes && (
                  <div className="notes-section">
                    <p>{addon.personal_notes}</p>
                  </div>
                )}

                {addon.has_custom_changes && addon.code_modifications?.length > 0 && (
                  <div className="code-changes-display">
                    <button 
                      className="code-toggle"
                      onClick={() => toggleCodeExpand(addon.id)}
                    >
                      <Code size={16} />
                      <span>View Code Modifications ({addon.code_modifications.length})</span>
                      {expandedCode === addon.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {expandedCode === addon.id && (
                      <div className="code-content">
                        {addon.code_modifications.map((mod, index) => (
                          <div key={index} className="modification-block">
                            <div className="line-range">
                              {mod.file_name} — Lines {mod.line_range}
                            </div>
                            <div className="code-comparison">
                              <div className="code-block original">
                                <div className="code-label">Original</div>
                                <pre><code>{mod.original_code}</code></pre>
                              </div>
                              <div className="code-block modified">
                                <div className="code-label">Modified</div>
                                <pre><code>{mod.modified_code}</code></pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="card-footer">
                <button className="edit-btn" onClick={() => onEdit(addon)}>
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
                <button className="delete-btn" onClick={() => handleDelete(addon.id)}>
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddonList;