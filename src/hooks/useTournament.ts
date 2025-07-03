import { useState, useEffect } from 'react';
import { Tournament, Team } from '../types';
import { databaseService } from '../services/database';

export const useTournament = () => {
  const [tournament, setTournament] = useState<Tournament>({
    teams: [],
    matches: [],
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      setIsLoading(true);
      await databaseService.init();
      await loadTeams();
    } catch (err) {
      setError('Erreur lors de l\'initialisation de la base de données');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTeams = async () => {
    try {
      const teams = await databaseService.getAllTeams();
      setTournament(prev => ({
        ...prev,
        teams
      }));
    } catch (err) {
      setError('Erreur lors du chargement des équipes');
      console.error(err);
    }
  };

  const addTeam = async (teamName: string, playerNames: string[]) => {
    try {
      await databaseService.addTeam(teamName, playerNames);
      await loadTeams(); // Reload teams to get updated data
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'équipe');
      console.error(err);
      throw err;
    }
  };

  const updateTeam = async (teamId: string, teamName: string, playerNames: string[]) => {
    try {
      await databaseService.updateTeam(teamId, teamName, playerNames);
      await loadTeams(); // Reload teams to get updated data
    } catch (err) {
      setError('Erreur lors de la modification de l\'équipe');
      console.error(err);
      throw err;
    }
  };

  const deleteTeam = async (teamId: string) => {
    try {
      await databaseService.deleteTeam(teamId);
      await loadTeams(); // Reload teams to get updated data
    } catch (err) {
      setError('Erreur lors de la suppression de l\'équipe');
      console.error(err);
      throw err;
    }
  };

  const resetTeamStats = async (teamId: string) => {
    try {
      await databaseService.resetTeamStats(teamId);
      await loadTeams(); // Reload teams to get updated data
    } catch (err) {
      setError('Erreur lors de la remise à zéro des statistiques');
      console.error(err);
      throw err;
    }
  };

  const validateTeam = async (teamId: string) => {
    try {
      await databaseService.validateTeam(teamId);
      await loadTeams(); // Reload teams to get updated data
    } catch (err) {
      setError('Erreur lors de la validation de l\'équipe');
      console.error(err);
      throw err;
    }
  };

  const addMatch = async (teamId: string, position: number, playerKills: { [playerId: string]: number }) => {
    try {
      await databaseService.addMatch(teamId, position, playerKills);
      await loadTeams(); // Reload teams to get updated data
    } catch (err) {
      setError('Erreur lors de l\'ajout du match');
      console.error(err);
      throw err;
    }
  };

  const getTeamRankings = async () => {
    try {
      return await databaseService.getTeamRankings();
    } catch (err) {
      setError('Erreur lors du chargement du classement des équipes');
      console.error(err);
      return [];
    }
  };

  const getPlayerRankings = async () => {
    try {
      return await databaseService.getPlayerRankings();
    } catch (err) {
      setError('Erreur lors du chargement du classement des joueurs');
      console.error(err);
      return [];
    }
  };

  return {
    tournament,
    isLoading,
    error,
    addTeam,
    updateTeam,
    deleteTeam,
    resetTeamStats,
    validateTeam,
    addMatch,
    getTeamRankings,
    getPlayerRankings,
    refreshData: loadTeams
  };
};