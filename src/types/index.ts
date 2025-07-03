export interface Player {
  id: string;
  name: string;
  kills: number;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  totalKills: number;
  totalPoints: number;
  isValidated: boolean;
  createdAt: string;
}

export interface Match {
  id: string;
  teamId: string;
  position: number;
  kills: number;
  points: number;
  createdAt: string;
}

export interface Tournament {
  teams: Team[];
  matches: Match[];
  isActive: boolean;
}