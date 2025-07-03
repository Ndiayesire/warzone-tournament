import initSqlJs, { Database } from 'sql.js';

class DatabaseService {
  private db: Database | null = null;
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      const SQL = await initSqlJs({
        locateFile: (file) => `https://sql.js.org/dist/${file}`
      });

      // Try to load existing database from localStorage
      const savedDb = localStorage.getItem('warzone-tournament-db');
      if (savedDb) {
        const uint8Array = new Uint8Array(JSON.parse(savedDb));
        this.db = new SQL.Database(uint8Array);
      } else {
        this.db = new SQL.Database();
        this.createTables();
      }

      // Explicit check to ensure database object is not null
      if (!this.db) {
        throw new Error('Failed to create database instance');
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      this.db = null;
      this.initialized = false;
      throw error;
    }
  }

  private createTables(): void {
    if (!this.db) {
      throw new Error('Database not available for table creation');
    }

    try {
      // Create teams table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS teams (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          total_kills INTEGER DEFAULT 0,
          total_points INTEGER DEFAULT 0,
          is_validated BOOLEAN DEFAULT FALSE,
          created_at TEXT NOT NULL
        )
      `);

      // Create players table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS players (
          id TEXT PRIMARY KEY,
          team_id TEXT NOT NULL,
          name TEXT NOT NULL,
          kills INTEGER DEFAULT 0,
          FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE
        )
      `);

      // Create matches table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS matches (
          id TEXT PRIMARY KEY,
          team_id TEXT NOT NULL,
          position INTEGER NOT NULL,
          kills INTEGER NOT NULL,
          points INTEGER NOT NULL,
          created_at TEXT NOT NULL,
          FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE
        )
      `);

      this.saveToLocalStorage();
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  private saveToLocalStorage(): void {
    if (!this.db) return;
    
    try {
      const data = this.db.export();
      const dataArray = Array.from(data);
      localStorage.setItem('warzone-tournament-db', JSON.stringify(dataArray));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  async addTeam(teamName: string, playerNames: string[]): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const teamId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const createdAt = new Date().toISOString();

    try {
      // Insert team
      this.db.run(
        'INSERT INTO teams (id, name, created_at) VALUES (?, ?, ?)',
        [teamId, teamName, createdAt]
      );

      // Insert players
      playerNames.forEach((playerName) => {
        const playerId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        this.db!.run(
          'INSERT INTO players (id, team_id, name) VALUES (?, ?, ?)',
          [playerId, teamId, playerName]
        );
      });

      this.saveToLocalStorage();
      return teamId;
    } catch (error) {
      console.error('Error adding team:', error);
      throw error;
    }
  }

  async updateTeam(teamId: string, teamName: string, playerNames: string[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Update team name
      this.db.run('UPDATE teams SET name = ? WHERE id = ?', [teamName, teamId]);

      // Delete existing players
      this.db.run('DELETE FROM players WHERE team_id = ?', [teamId]);

      // Insert new players
      playerNames.forEach((playerName) => {
        const playerId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        this.db!.run(
          'INSERT INTO players (id, team_id, name) VALUES (?, ?, ?)',
          [playerId, teamId, playerName]
        );
      });

      this.saveToLocalStorage();
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  }

  async deleteTeam(teamId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Delete players (CASCADE should handle this, but let's be explicit)
      this.db.run('DELETE FROM players WHERE team_id = ?', [teamId]);
      
      // Delete matches
      this.db.run('DELETE FROM matches WHERE team_id = ?', [teamId]);
      
      // Delete team
      this.db.run('DELETE FROM teams WHERE id = ?', [teamId]);

      this.saveToLocalStorage();
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  }

  async resetTeamStats(teamId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Reset team stats
      this.db.run(
        'UPDATE teams SET total_kills = 0, total_points = 0 WHERE id = ?',
        [teamId]
      );

      // Reset player kills
      this.db.run('UPDATE players SET kills = 0 WHERE team_id = ?', [teamId]);

      // Delete all matches for this team
      this.db.run('DELETE FROM matches WHERE team_id = ?', [teamId]);

      this.saveToLocalStorage();
    } catch (error) {
      console.error('Error resetting team stats:', error);
      throw error;
    }
  }

  async validateTeam(teamId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      this.db.run('UPDATE teams SET is_validated = TRUE WHERE id = ?', [teamId]);
      this.saveToLocalStorage();
    } catch (error) {
      console.error('Error validating team:', error);
      throw error;
    }
  }

  async addMatch(teamId: string, position: number, playerKills: { [playerId: string]: number }): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const matchId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const createdAt = new Date().toISOString();
    const totalKills = Object.values(playerKills).reduce((sum, kills) => sum + kills, 0);
    
    // Calculate points based on position
    let points = totalKills;
    if (position === 1) {
      points = Math.round(totalKills * 1.6);
    } else if (position >= 2 && position <= 5) {
      points = Math.round(totalKills * 1.4);
    } else if (position >= 6 && position <= 10) {
      points = Math.round(totalKills * 1.2);
    }

    try {
      // Insert match
      this.db.run(
        'INSERT INTO matches (id, team_id, position, kills, points, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [matchId, teamId, position, totalKills, points, createdAt]
      );

      // Update player kills
      Object.entries(playerKills).forEach(([playerId, kills]) => {
        this.db!.run(
          'UPDATE players SET kills = kills + ? WHERE id = ?',
          [kills, playerId]
        );
      });

      // Update team totals
      this.db.run(
        'UPDATE teams SET total_kills = total_kills + ?, total_points = total_points + ? WHERE id = ?',
        [totalKills, points, teamId]
      );

      this.saveToLocalStorage();
    } catch (error) {
      console.error('Error adding match:', error);
      throw error;
    }
  }

  async getAllTeams(): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const teamsResult = this.db.exec(`
        SELECT id, name, total_kills, total_points, is_validated, created_at 
        FROM teams 
        ORDER BY created_at DESC
      `);

      if (teamsResult.length === 0) return [];

      type Player = { id: string; name: string; kills: number };
      type Team = {
        id: string;
        name: string;
        totalKills: number;
        totalPoints: number;
        isValidated: boolean;
        createdAt: string;
        players: Player[];
      };

      const teams: Team[] = teamsResult[0].values.map(row => ({
        id: row[0] as string,
        name: row[1] as string,
        totalKills: row[2] as number,
        totalPoints: row[3] as number,
        isValidated: Boolean(row[4]),
        createdAt: row[5] as string,
        players: []
      }));

      // Get players for each team
      for (const team of teams) {
        const playersResult = this.db.exec(
          'SELECT id, name, kills FROM players WHERE team_id = ? ORDER BY name',
          [team.id]
        );

        if (playersResult.length > 0) {
          team.players = playersResult[0].values.map(row => ({
            id: row[0] as string,
            name: row[1] as string,
            kills: row[2] as number
          }));
        }
      }

      return teams;
    } catch (error) {
      console.error('Error getting teams:', error);
      throw error;
    }
  }

  async getTeamRankings(): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const teams = await this.getAllTeams();
      return teams
        .filter(team => team.isValidated)
        .sort((a, b) => b.totalPoints - a.totalPoints);
    } catch (error) {
      console.error('Error getting team rankings:', error);
      throw error;
    }
  }

  async getPlayerRankings(): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const result = this.db.exec(`
        SELECT p.id, p.name, p.kills, t.name as team_name
        FROM players p
        JOIN teams t ON p.team_id = t.id
        WHERE t.is_validated = TRUE
        ORDER BY p.kills DESC
      `);

      if (result.length === 0) return [];

      return result[0].values.map(row => ({
        id: row[0],
        name: row[1],
        kills: row[2],
        teamName: row[3]
      }));
    } catch (error) {
      console.error('Error getting player rankings:', error);
      throw error;
    }
  }
}

export const databaseService = new DatabaseService();