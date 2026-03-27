import { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import CreateAddon from './components/CreateAddon';
import AddonList from './components/AddonList';
import type { Addon } from './types/addon';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'create' | 'list'>('list');
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);

  const handleEdit = (addon: Addon) => {
    setEditingAddon(addon);
    setCurrentPage('create');
  };

  const handleEditComplete = () => {
    setEditingAddon(null);
    setCurrentPage('list');
  };

  const handleNavigate = (page: 'create' | 'list') => {
    if (page === 'list') {
      setEditingAddon(null);
    }
    setCurrentPage(page);
  };

  return (
    <div className="app">
      <Header />
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="main-content">
        {currentPage === 'create' ? (
          <CreateAddon editAddon={editingAddon} onEditComplete={handleEditComplete} />
        ) : (
          <AddonList onEdit={handleEdit} />
        )}
      </main>
    </div>
  );
}

export default App;