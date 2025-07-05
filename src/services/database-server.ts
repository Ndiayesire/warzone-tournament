// API endpoints - using relative path instead of hard-coded localhost
const API_BASE_URL = '/api';

class DatabaseService {
  private initialized = false;

  async init(): Promise<void> {
    this.initialized = true;
    return Promise.resolve();
  }

  async addTeam(teamName: string, playerNames: string[]): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamName, playerNames }),
      });

      if (!response.ok) {
        throw new Error('Failed to add team');
      }

      const data = await response.json();
      return data.teamId;
    } catch (error) {
      console.error('Error adding team:', error);
      throw error;
    }
  }

  async updateTeam(teamId: string, teamName: string, playerNames: string[]): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamName, playerNames }),
      });

      if (!response.ok) {
        throw new Error('Failed to update team');
      }
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  }

  async deleteTeam(teamId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete team');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  }

  async resetTeamStats(teamId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}/reset`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reset team stats');
      }
    } catch (error) {
      console.error('Error resetting team stats:', error);
      throw error;
    }
  }

  async validateTeam(teamId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}/validate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to validate team');
      }
    } catch (error) {
      console.error('Error validating team:', error);
      throw error;
    }
  }

  async addMatch(teamId: string, position: number, playerKills: { [playerId: string]: number }): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId, position, playerKills }),
      });

      if (!response.ok) {
        throw new Error('Failed to add match');
      }
    } catch (error) {
      console.error('Error adding match:', error);
      throw error;
    }
  }

  async getAllTeams(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/teams`);
      
      if (!response.ok) {
        throw new Error('Failed to get teams');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting teams:', error);
      throw error;
    }
  }

  async getTeamRankings(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/rankings/teams`);
      
      if (!response.ok) {
        throw new Error('Failed to get team rankings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting team rankings:', error);
      throw error;
    }
  }

  async getPlayerRankings(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/rankings/players`);
      
      if (!response.ok) {
        throw new Error('Failed to get player rankings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting player rankings:', error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();
