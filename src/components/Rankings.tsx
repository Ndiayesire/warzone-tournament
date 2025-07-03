import React, { useState, useEffect } from 'react';
import { Trophy, Target, Users, Medal, Loader2 } from 'lucide-react';
import { useTournament } from '../hooks/useTournament';

export const Rankings: React.FC = () => {
  const { getTeamRankings, getPlayerRankings, isLoading } = useTournament();
  const [activeTab, setActiveTab] = useState<'teams' | 'players'>('teams');
  const [teamRankings, setTeamRankings] = useState<any[]>([]);
  const [playerRankings, setPlayerRankings] = useState<any[]>([]);
  const [loadingRankings, setLoadingRankings] = useState(false);

  useEffect(() => {
    loadRankings();
  }, [activeTab]);

  const loadRankings = async () => {
    setLoadingRankings(true);
    try {
      if (activeTab === 'teams') {
        const teams = await getTeamRankings();
        setTeamRankings(teams);
      } else {
        const players = await getPlayerRankings();
        setPlayerRankings(players);
      }
    } catch (error) {
      console.error('Error loading rankings:', error);
    } finally {
      setLoadingRankings(false);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-orange-600" />;
      default:
        return <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-white text-sm font-bold">{position}</div>;
    }
  };

  const getRankColor = (position: number) => {
    switch (position) {
      case 1:
        return 'from-yellow-400/20 to-yellow-600/20 border-yellow-400/30';
      case 2:
        return 'from-gray-400/20 to-gray-600/20 border-gray-400/30';
      case 3:
        return 'from-orange-400/20 to-orange-600/20 border-orange-400/30';
      default:
        return 'from-slate-700/50 to-slate-800/50 border-slate-600/30';
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
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl mb-6">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Classement</h1>
          <p className="text-gray-400 text-lg">
            Suivez les performances des équipes et des joueurs en temps réel
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 rounded-xl p-1 border border-slate-700">
            <button
              onClick={() => setActiveTab('teams')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'teams'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Équipes</span>
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'players'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Target className="h-4 w-4" />
              <span>Joueurs</span>
            </button>
          </div>
        </div>

        {loadingRankings ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Chargement du classement...</p>
          </div>
        ) : (
          <>
            {/* Teams Rankings */}
            {activeTab === 'teams' && (
              <div className="space-y-4">
                {teamRankings.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Aucune équipe validée pour le moment</p>
                  </div>
                ) : (
                  teamRankings.map((team, index) => (
                    <div
                      key={team.id}
                      className={`bg-gradient-to-r ${getRankColor(index + 1)} rounded-xl p-6 border transition-all duration-300 hover:scale-105`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getRankIcon(index + 1)}
                          <div>
                            <h3 className="text-xl font-bold text-white">{team.name}</h3>
                            <p className="text-gray-400">{team.players.length} joueurs</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{team.totalPoints}</div>
                          <div className="text-orange-400 font-semibold">points</div>
                          <div className="text-gray-400 text-sm">{team.totalKills} kills</div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {team.players.map((player: any) => (
                          <div
                            key={player.id}
                            className="bg-slate-700/50 rounded-lg px-3 py-1 text-sm text-gray-300"
                          >
                            {player.name} ({player.kills} kills)
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Players Rankings */}
            {activeTab === 'players' && (
              <div className="space-y-4">
                {playerRankings.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Aucun joueur pour le moment</p>
                  </div>
                ) : (
                  playerRankings.map((player, index) => (
                    <div
                      key={player.id}
                      className={`bg-gradient-to-r ${getRankColor(index + 1)} rounded-xl p-6 border transition-all duration-300 hover:scale-105`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getRankIcon(index + 1)}
                          <div>
                            <h3 className="text-xl font-bold text-white">{player.name}</h3>
                            <p className="text-gray-400">Équipe: {player.teamName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{player.kills}</div>
                          <div className="text-orange-400 font-semibold">kills</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};