import { useState, useEffect } from 'react';
import { createAddon, updateAddon } from '../services/api';
import type { CreateAddonRequest, Addon, CodeModification } from '../types/addon';
import { Code, Plus, Trash2 } from 'lucide-react';
import './CreateAddon.css';

interface CreateAddonProps {
  editAddon?: Addon | null;
  onEditComplete?: () => void;
}

const emptyModification = (): CodeModification => ({
  file_name: '',
  line_range: '',
  original_code: '',
  modified_code: '',
});

function CreateAddon({ editAddon, onEditComplete }: CreateAddonProps) {
  const [formData, setFormData] = useState<CreateAddonRequest>({
    name: '',
    author: '',
    version: '',
    category: '',
    esoui_link: '',
    is_active: true,
    personal_notes: '',
    rating: undefined,
    has_custom_changes: false,
    code_modifications: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isEditMode = !!editAddon;

  useEffect(() => {
    if (editAddon) {
      setFormData({
        name: editAddon.name,
        author: editAddon.author || '',
        version: editAddon.version || '',
        category: editAddon.category || '',
        esoui_link: editAddon.esoui_link || '',
        is_active: editAddon.is_active,
        personal_notes: editAddon.personal_notes || '',
        rating: editAddon.rating,
        has_custom_changes: editAddon.has_custom_changes,
        code_modifications: editAddon.code_modifications || [],
      });
    }
  }, [editAddon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isEditMode && editAddon) {
        await updateAddon(editAddon.id, formData);
        setMessage({ type: 'success', text: 'Addon updated successfully!' });
        if (onEditComplete) {
          setTimeout(() => onEditComplete(), 1500);
        }
      } else {
        await createAddon(formData);
        setMessage({ type: 'success', text: 'Addon added successfully!' });
        setFormData({
          name: '',
          author: '',
          version: '',
          category: '',
          esoui_link: '',
          is_active: true,
          personal_notes: '',
          rating: undefined,
          has_custom_changes: false,
          code_modifications: [],
        });
      }
    } catch (err) {
      setMessage({ type: 'error', text: isEditMode ? 'Failed to update addon' : 'Failed to add addon' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      // When unchecking has_custom_changes, clear modifications
      if (name === 'has_custom_changes' && !checked) {
        setFormData(prev => ({ ...prev, [name]: checked, code_modifications: [] }));
      }
    } else if (name === 'rating') {
      setFormData(prev => ({ ...prev, [name]: value ? parseInt(value) : undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addModification = () => {
    setFormData(prev => ({
      ...prev,
      code_modifications: [...prev.code_modifications, emptyModification()],
    }));
  };

  const removeModification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      code_modifications: prev.code_modifications.filter((_, i) => i !== index),
    }));
  };

  const updateModification = (index: number, field: keyof CodeModification, value: string) => {
    setFormData(prev => ({
      ...prev,
      code_modifications: prev.code_modifications.map((mod, i) =>
        i === index ? { ...mod, [field]: value } : mod
      ),
    }));
  };

  return (
    <div className="create-addon">
      <h2>{isEditMode ? 'Edit Addon' : 'Add New Addon'}</h2>
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="version">Version</label>
            <input type="text" id="version" name="version" value={formData.version} onChange={handleChange} placeholder="e.g., 2.1.5" />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange}>
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
          <input type="url" id="esoui_link" name="esoui_link" value={formData.esoui_link} onChange={handleChange} placeholder="https://www.esoui.com/..." />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rating">Rating (1-5)</label>
            <input type="number" id="rating" name="rating" min="1" max="5" value={formData.rating || ''} onChange={handleChange} />
          </div>
          <div className="form-group checkbox-group">
            <label htmlFor="is_active">
              <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} />
              Active
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="personal_notes">Personal Notes</label>
          <textarea id="personal_notes" name="personal_notes" value={formData.personal_notes} onChange={handleChange} rows={4} placeholder="Your thoughts, compatibility notes, etc." />
        </div>

        {/* Custom Code Changes Section */}
        <div className="code-changes-section">
          <div className="section-header">
            <Code size={20} />
            <h3>Custom Code Modifications</h3>
          </div>
          
          <div className="form-group checkbox-group">
            <label htmlFor="has_custom_changes">
              <input type="checkbox" id="has_custom_changes" name="has_custom_changes" checked={formData.has_custom_changes} onChange={handleChange} />
              I've made custom code changes to this addon
            </label>
          </div>

          {formData.has_custom_changes && (
            <div className="code-fields">
              {formData.code_modifications.map((mod, index) => (
                <div key={index} className="modification-entry">
                  <div className="modification-header">
                    <span className="modification-number">Modification #{index + 1}</span>
                    <button type="button" className="remove-mod-btn" onClick={() => removeModification(index)}>
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>File Name</label>
                      <input
                        type="text"
                        value={mod.file_name}
                        onChange={(e) => updateModification(index, 'file_name', e.target.value)}
                        placeholder="e.g., craftStationScenes.lua"
                      />
                    </div>
                    <div className="form-group">
                      <label>Line Range</label>
                      <input
                        type="text"
                        value={mod.line_range}
                        onChange={(e) => updateModification(index, 'line_range', e.target.value)}
                        placeholder="e.g., 62-64"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Original Code</label>
                    <textarea
                      value={mod.original_code}
                      onChange={(e) => updateModification(index, 'original_code', e.target.value)}
                      rows={6}
                      placeholder="Paste the original code here..."
                      className="code-textarea"
                    />
                  </div>

                  <div className="form-group">
                    <label>Modified Code</label>
                    <textarea
                      value={mod.modified_code}
                      onChange={(e) => updateModification(index, 'modified_code', e.target.value)}
                      rows={6}
                      placeholder="Paste your modified code here..."
                      className="code-textarea"
                    />
                  </div>
                </div>
              ))}

              <button type="button" className="add-mod-btn" onClick={addModification}>
                <Plus size={16} />
                <span>Add File Modification</span>
              </button>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Addon' : 'Add Addon')}
        </button>
      </form>
    </div>
  );
}

export default CreateAddon;