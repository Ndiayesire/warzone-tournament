import React, { useState, useEffect } from 'react';
import { BarChart3, Plus, Target, Loader2 } from 'lucide-react';
import { useTournament } from '../hooks/useTournament';
import { calculatePoints } from '../utils/points';

export const AdminMatches: React.FC = () => {
  const { tournament, addMatch, isLoading, error, refreshData } = useTournament();
  const [selectedTeam, setSelectedTeam] = useState('');
  const [position, setPosition] = useState<number>(1);
  const [playerKills, setPlayerKills] = useState<{ [playerId: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const validatedTeams = tournament.teams.filter(team => team.isValidated);
  const selectedTeamData = validatedTeams.find(team => team.id === selectedTeam);

  const handlePlayerKillsChange = (playerId: string, kills: number) => {
    setPlayerKills(prev => ({
      ...prev,
      [playerId]: kills
    }));
  };

  const getTotalKills = () => {
    return Object.values(playerKills).reduce((sum, kills) => sum + kills, 0);
  };

  const getCalculatedPoints = () => {
    const totalKills = getTotalKills();
    return calculatePoints(totalKills, position);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !selectedTeamData) return;

    setIsSubmitting(true);
    
    try {
      await addMatch(selectedTeam, position, playerKills);
      
      // Reset form
      setSelectedTeam('');
      setPosition(1);
      setPlayerKills({});
    } catch (error) {
      console.error('Error adding match:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl mb-6">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Statistiques de Match</h1>
          <p className="text-gray-400 text-lg">
            Enregistrez les résultats des matches et les performances des équipes
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Match Form */}
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <Plus className="h-6 w-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-white">Nouveau Match</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-3">
                  Équipe
                </label>
                <select
                  value={selectedTeam}
                  onChange={(e) => {
                    setSelectedTeam(e.target.value);
                    setPlayerKills({});
                  }}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                  required
                >
                  <option value="">Sélectionner une équipe</option>
                  {validatedTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  Position finale
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={position}
                  onChange={(e) => setPosition(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                  required
                />
              </div>

              {selectedTeamData && (
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Kills par joueur
                  </label>
                  <div className="space-y-3">
                    {selectedTeamData.players.map((player) => (
                      <div key={player.id} className="flex items-center space-x-3">
                        <span className="text-gray-300 flex-1">{player.name}</span>
                        <input
                          type="number"
                          min="0"
                          value={playerKills[player.id] || 0}
                          onChange={(e) => handlePlayerKillsChange(player.id, parseInt(e.target.value) || 0)}
                          className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTeamData && (
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-400">Total kills:</span>
                    <span className="text-white font-semibold">{getTotalKills()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-400">Position:</span>
                    <span className="text-white font-semibold">{position}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Points calculés:</span>
                    <span className="text-orange-400 font-bold text-lg">{getCalculatedPoints()}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !selectedTeam}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer le match'}
              </button>
            </form>
          </div>

          {/* Points System Reference */}
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="h-6 w-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-white">Système de Points</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-lg p-4 border border-yellow-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400 font-semibold">1ère place</span>
                  <span className="text-white">Kills × 1.6</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg p-4 border border-orange-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-orange-400 font-semibold">2ème - 5ème place</span>
                  <span className="text-white">Kills × 1.4</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg p-4 border border-blue-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-blue-400 font-semibold">6ème - 10ème place</span>
                  <span className="text-white">Kills × 1.2</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-500/10 to-slate-600/10 rounded-lg p-4 border border-slate-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">11ème place+</span>
                  <span className="text-white">Kills × 1</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
              <h3 className="text-white font-semibold mb-3">Instructions:</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Sélectionnez l'équipe participante</li>
                <li>• Indiquez la position finale de l'équipe</li>
                <li>• Renseignez les kills de chaque joueur</li>
                <li>• Les points sont calculés automatiquement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};