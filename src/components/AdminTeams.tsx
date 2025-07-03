import React, { useEffect, useState } from 'react';
import { Users, Check, Clock, CheckCircle, Loader2, RefreshCw, Edit, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { useTournament } from '../hooks/useTournament';
import { TeamEditModal } from './TeamEditModal';

export const AdminTeams: React.FC = () => {
  const { tournament, validateTeam, updateTeam, deleteTeam, resetTeamStats, isLoading, error, refreshData } = useTournament();
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [deletingTeam, setDeletingTeam] = useState<string | null>(null);
  const [resettingTeam, setResettingTeam] = useState<string | null>(null);

  useEffect(() => {
    // Refresh data when component mounts
    refreshData();
  }, []);

  const pendingTeams = tournament.teams.filter(team => !team.isValidated);
  const validatedTeams = tournament.teams.filter(team => team.isValidated);

  const handleValidateTeam = async (teamId: string) => {
    try {
      await validateTeam(teamId);
    } catch (error) {
      console.error('Error validating team:', error);
    }
  };

  const handleEditTeam = (team: any) => {
    setEditingTeam(team);
  };

  const handleSaveTeam = async (teamId: string, teamName: string, playerNames: string[]) => {
    try {
      await updateTeam(teamId, teamName, playerNames);
      setEditingTeam(null);
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action est irréversible.')) {
      setDeletingTeam(teamId);
      try {
        await deleteTeam(teamId);
      } catch (error) {
        console.error('Error deleting team:', error);
      } finally {
        setDeletingTeam(null);
      }
    }
  };

  const handleResetTeamStats = async (teamId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir remettre à zéro les statistiques de cette équipe ?')) {
      setResettingTeam(teamId);
      try {
        await resetTeamStats(teamId);
      } catch (error) {
        console.error('Error resetting team stats:', error);
      } finally {
        setResettingTeam(null);
      }
    }
  };

  const handleRefresh = () => {
    refreshData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Chargement des équipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl mb-6">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Gestion des Équipes</h1>
          <p className="text-gray-400 text-lg">
            Gérez les inscriptions, validez et modifiez les équipes participantes
          </p>
          
          <button
            onClick={handleRefresh}
            className="mt-4 flex items-center space-x-2 mx-auto px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Actualiser</span>
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pending Teams */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="h-6 w-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-white">En attente ({pendingTeams.length})</h2>
            </div>

            <div className="space-y-4">
              {pendingTeams.length === 0 ? (
                <div className="text-center py-8 bg-slate-800/30 rounded-xl border border-slate-700">
                  <Clock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Aucune équipe en attente</p>
                </div>
              ) : (
                pendingTeams.map((team) => (
                  <div
                    key={team.id}
                    className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-orange-500/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>
                        <p className="text-gray-400 text-sm">
                          Inscrite le {new Date(team.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTeam(team)}
                          className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="hidden sm:inline">Modifier</span>
                        </button>
                        <button
                          onClick={() => handleValidateTeam(team.id)}
                          className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors duration-200"
                        >
                          <Check className="h-4 w-4" />
                          <span className="hidden sm:inline">Valider</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(team.id)}
                          disabled={deletingTeam === team.id}
                          className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                          {deletingTeam === team.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="hidden sm:inline">Supprimer</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-300 font-semibold">Joueurs ({team.players.length}):</p>
                      <div className="flex flex-wrap gap-2">
                        {team.players.map((player: any) => (
                          <div
                            key={player.id}
                            className="bg-slate-700 rounded-lg px-3 py-1 text-sm text-gray-300"
                          >
                            {player.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Validated Teams */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Validées ({validatedTeams.length})</h2>
            </div>

            <div className="space-y-4">
              {validatedTeams.length === 0 ? (
                <div className="text-center py-8 bg-slate-800/30 rounded-xl border border-slate-700">
                  <CheckCircle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Aucune équipe validée</p>
                </div>
              ) : (
                validatedTeams.map((team) => (
                  <div
                    key={team.id}
                    className="bg-slate-800/50 rounded-xl p-6 border border-green-500/30 bg-gradient-to-r from-green-500/5 to-transparent"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Points: {team.totalPoints}</span>
                          <span>Kills: {team.totalKills}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditTeam(team)}
                          className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="hidden sm:inline">Modifier</span>
                        </button>
                        <button
                          onClick={() => handleResetTeamStats(team.id)}
                          disabled={resettingTeam === team.id}
                          className="flex items-center space-x-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                          {resettingTeam === team.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RotateCcw className="h-4 w-4" />
                          )}
                          <span className="hidden sm:inline">Reset</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTeam(team.id)}
                          disabled={deletingTeam === team.id}
                          className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                          {deletingTeam === team.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="hidden sm:inline">Supprimer</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-300 font-semibold">Joueurs ({team.players.length}):</p>
                      <div className="flex flex-wrap gap-2">
                        {team.players.map((player: any) => (
                          <div
                            key={player.id}
                            className="bg-slate-700 rounded-lg px-3 py-1 text-sm text-gray-300"
                          >
                            {player.name} ({player.kills} kills)
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div>
              <h3 className="text-yellow-400 font-semibold">Actions importantes</h3>
              <p className="text-gray-400 text-sm mt-1">
                • <strong>Reset:</strong> Remet à zéro les statistiques de l'équipe (kills, points, matches)
                <br />
                • <strong>Supprimer:</strong> Supprime définitivement l'équipe et toutes ses données
                <br />
                • <strong>Modifier:</strong> Permet de changer le nom de l'équipe et la liste des joueurs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Team Modal */}
      <TeamEditModal
        team={editingTeam}
        isOpen={!!editingTeam}
        onClose={() => setEditingTeam(null)}
        onSave={handleSaveTeam}
      />
    </div>
  );
};