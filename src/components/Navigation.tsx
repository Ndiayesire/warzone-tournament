import React from 'react';
import { Trophy, Users, BarChart3, Shield } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isAdmin: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage, isAdmin }) => {
  const navItems = [
    { id: 'home', label: 'Accueil', icon: Trophy },
    { id: 'register', label: 'Inscription', icon: Users },
    { id: 'rankings', label: 'Classement', icon: BarChart3 },
  ];

  const adminItems = [
    { id: 'admin-login', label: 'Admin', icon: Shield },
  ];

  const adminNavItems = [
    { id: 'admin-teams', label: 'Validation', icon: Users },
    { id: 'admin-matches', label: 'Stats Match', icon: BarChart3 },
  ];

  return (
    <nav className="bg-slate-900/90 backdrop-blur-sm border-b border-orange-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <img
              src="src\img\logo.jpg"
              alt="Trophy"
              className="h-11 w-11 rounded-full object-cover"
            />
            <span className="text-xl font-bold text-white">Esport Nation</span>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === id
                    ? 'bg-red-800 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
            
            {!isAdmin && adminItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === id
                    ? 'bg-red-800 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
            
            {isAdmin && adminNavItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === id
                    ? 'bg-red-800 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};