import React, { useState } from 'react';
import { Users, Plus, Trash2, Check, Loader2 } from 'lucide-react';
import { useTournament } from '../hooks/useTournament';

export const TeamRegistration: React.FC = () => {
  const { addTeam, isLoading, error } = useTournament();
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    if (players.length < 6) {
      setPlayers([...players, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      const newPlayers = players.filter((_, i) => i !== index);
      setPlayers(newPlayers);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || players.some(p => !p.trim())) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await addTeam(teamName, players.filter(p => p.trim()));
      setSuccessMessage('Équipe enregistrée avec succès! En attente de validation.');
      setTeamName('');
      setPlayers(['', '', '', '']);

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setSubmitError('Erreur lors de l\'enregistrement de l\'équipe. Veuillez réessayer.');
      setTimeout(() => setSubmitError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Initialisation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl mb-6">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Inscription Équipe</h1>
          <p className="text-gray-400 text-lg">
            Enregistrez votre équipe pour participer au tournoi Warzone
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-3">
            <Check className="h-5 w-5 text-green-400" />
            <span className="text-green-400">{successMessage}</span>
          </div>
        )}

        {submitError && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
          <div className="mb-8">
            <label className="block text-white font-semibold mb-3">
              Nom de l'équipe
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
              placeholder="Entrez le nom de votre équipe"
              required
            />
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-white font-semibold">
                Joueurs ({players.length}/6)
              </label>
              {players.length < 6 && (
                <button
                  type="button"
                  onClick={addPlayer}
                  className="flex items-center space-x-2 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {players.map((player, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={player}
                      onChange={(e) => handlePlayerChange(index, e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200"
                      placeholder={`Nom du joueur ${index + 1}`}
                      required
                    />
                  </div>
                  {players.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removePlayer(index)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !teamName.trim() || players.some(p => !p.trim())}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-4 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <span>Enregistrer l'équipe</span>
            )}
          </button>
        </form>

        <div className="mt-8 p-6 bg-slate-800/30 rounded-xl border border-slate-700">
          <h3 className="text-white font-semibold mb-3">Règles d'inscription:</h3>
          <ul className="text-gray-400 space-y-2">
            <li>• Minimum 2 joueurs, maximum 6 joueurs par équipe</li>
            <li>• Chaque équipe doit être validée par un administrateur</li>
            <li>• Les noms d'équipe doivent être uniques</li>
            <li>• Tous les champs sont obligatoires</li>
          </ul>
        </div>
      </div>
    </div>
  );
};