import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { TeamRegistration } from './components/TeamRegistration';
import { Rankings } from './components/Rankings';
import { AdminLogin } from './components/AdminLogin';
import { AdminTeams } from './components/AdminTeams';
import { AdminMatches } from './components/AdminMatches';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setCurrentPage('admin-teams');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'register':
        return <TeamRegistration />;
      case 'rankings':
        return <Rankings />;
      case 'admin-login':
        return <AdminLogin onLogin={handleAdminLogin} />;
      case 'admin-teams':
        return isAdmin ? <AdminTeams /> : <AdminLogin onLogin={handleAdminLogin} />;
      case 'admin-matches':
        return isAdmin ? <AdminMatches /> : <AdminLogin onLogin={handleAdminLogin} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isAdmin={isAdmin}
      />
      {renderCurrentPage()}
    </div>
  );
}

export default App;