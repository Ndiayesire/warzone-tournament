import React from 'react';
import { Trophy, Users, Target, Award } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-600/20 animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                WARZONE
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                  {' '}TOURNAMENT
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Participez au plus grand tournoi Warzone avec un cashprize de
                <span className="text-red-400 font-bold"> 50 000 FCFA</span>
              </p>
            </div>
            
            <div className="animate-slide-up">
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full px-8 py-4 text-white font-semibold text-lg shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105">
                 <img
              src="src\img\logo.jpg"
              alt="Trophy"
              className="h-11 w-11 rounded-lg object-cover"
            />
                <span>CASHPRIZE: 50 000 FCFA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl mb-6 group-hover:rotate-12 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Équipes</h3>
              <p className="text-gray-400">
                Formez votre équipe de 4 joueurs et inscrivez-vous pour participer au tournoi.
              </p>
            </div>

            <div className="group bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl mb-6 group-hover:rotate-12 transition-transform duration-300">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Système de Points</h3>
              <p className="text-gray-400">
                Points basés sur les kills et le classement. Plus vous tuez et mieux vous êtes classés, plus vous gagnez de points.
              </p>
            </div>

            <div className="group bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl mb-6 group-hover:rotate-12 transition-transform duration-300">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Classement</h3>
              <p className="text-gray-400">
                Suivez en temps réel le classement des équipes et des joueurs individuels.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Points System */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-12">Système de Points</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">1ère</div>
              <div className="text-sm opacity-90">Kills × 1.6</div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">2ème-5ème</div>
              <div className="text-sm opacity-90">Kills × 1.4</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">6ème-8ème</div>
              <div className="text-sm opacity-90">Kills × 1.2</div>
            </div>
            <div className="bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">9ème-11éme</div>
              <div className="text-sm opacity-90">Kills × 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};