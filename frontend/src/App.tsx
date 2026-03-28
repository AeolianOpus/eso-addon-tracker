import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import CreateAddon from './components/CreateAddon';
import AddonList from './components/AddonList';
import Login from './components/Login';
import Register from './components/Register';
import type { Addon } from './types/addon';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'create' | 'list'>('list');
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

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

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <Login onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;