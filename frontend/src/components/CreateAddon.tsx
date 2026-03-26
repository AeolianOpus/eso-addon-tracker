import { useState } from 'react';
import { createAddon } from '../services/api';
import type { CreateAddonRequest } from '../types/addon';
import './CreateAddon.css';

function CreateAddon() {
  const [formData, setFormData] = useState<CreateAddonRequest>({
    name: '',
    author: '',
    version: '',
    category: '',
    esoui_link: '',
    is_active: true,
    personal_notes: '',
    rating: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await createAddon(formData);
      setMessage({ type: 'success', text: 'Addon added successfully!' });
      // Reset form
      setFormData({
        name: '',
        author: '',
        version: '',
        category: '',
        esoui_link: '',
        is_active: true,
        personal_notes: '',
        rating: undefined,
      });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add addon' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (name === 'rating') {
      setFormData(prev => ({ ...prev, [name]: value ? parseInt(value) : undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="create-addon">
      <h2>Add New Addon</h2>
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="version">Version</label>
            <input
              type="text"
              id="version"
              name="version"
              value={formData.version}
              onChange={handleChange}
              placeholder="e.g., 2.1.5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              <option value="UI">UI</option>
              <option value="Combat">Combat</option>
              <option value="Crafting">Crafting</option>
              <option value="Map">Map</option>
              <option value="Trading">Trading</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="esoui_link">ESOUI Link</label>
          <input
            type="url"
            id="esoui_link"
            name="esoui_link"
            value={formData.esoui_link}
            onChange={handleChange}
            placeholder="https://www.esoui.com/..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rating">Rating (1-5)</label>
            <input
              type="number"
              id="rating"
              name="rating"
              min="1"
              max="5"
              value={formData.rating || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group checkbox-group">
            <label htmlFor="is_active">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Active
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="personal_notes">Personal Notes</label>
          <textarea
            id="personal_notes"
            name="personal_notes"
            value={formData.personal_notes}
            onChange={handleChange}
            rows={4}
            placeholder="Your thoughts, compatibility notes, etc."
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Adding...' : 'Add Addon'}
        </button>
      </form>
    </div>
  );
}

export default CreateAddon;