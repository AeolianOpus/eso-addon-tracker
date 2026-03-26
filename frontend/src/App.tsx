import { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import CreateAddon from './components/CreateAddon';
import AddonList from './components/AddonList';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'create' | 'list'>('list');

  return (
    <div className="app">
      <Header />
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="main-content">
        {currentPage === 'create' ? <CreateAddon /> : <AddonList />}
      </main>
    </div>
  );
}

export default App;
