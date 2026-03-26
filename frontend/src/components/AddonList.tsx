import { useState, useEffect } from 'react';
import { getAllAddons, deleteAddon } from '../services/api';
import type { Addon } from '../types/addon';
import { 
  Trash2, 
  User, 
  Package, 
  Tag, 
  Star, 
  Link as LinkIcon, 
  CheckCircle, 
  XCircle,
  Swords,        // Combat
  Layout,        // UI
  Map,           // Map
  Hammer,        // Crafting
  ShoppingCart,  // Trading
  Box            // Other/Default
} from 'lucide-react';
import './AddonList.css';

function AddonList() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Function to get icon based on category
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

  if (loading) return <div className="loading">Loading addons...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="addon-list">
      <div className="list-header">
        <h2>My Collection</h2>
        <div className="addon-count">{addons.length} Addon{addons.length !== 1 ? 's' : ''}</div>
      </div>
      
      {addons.length === 0 ? (
        <div className="empty-state">
          <Package size={64} strokeWidth={1} />
          <p>No addons in your collection yet</p>
          <span>Click "Add New" to start tracking your ESO addons</span>
        </div>
      ) : (
        <div className="addons-grid">
          {addons.map(addon => (
            <div key={addon.id} className="addon-card">
              <div className="card-header">
                <div className="category-icon">
                  {getCategoryIcon(addon.category)}
                </div>
                <div className="addon-name">
                  <h3>{addon.name}</h3>
                  <div className={`status-badge ${addon.is_active ? 'active' : 'inactive'}`}>
                    {addon.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    <span>{addon.is_active ? 'Active' : 'Inactive'}</span>
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
              </div>

              <div className="card-footer">
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