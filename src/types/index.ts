export interface Player {
  id: number;
  name: string;
  teamName?: string;
  totalPoints: number;
}

export interface WeeklyScore {
  playerId: number;
  playerName: string;
  teamName?: string;
  points: number;
  property?: string;
  negatives?: number;
}

export interface WeekData {
  [key: string]: WeeklyScore[];
}

export interface PlayerStats {
  player: Player;
  weeklyScores: number[];
  averageScore: number;
  highestWeek: number;
  lowestWeek: number;
  consistency: number;
}

export interface LeagueStats {
  highestScoringWeek: {
    week: number;
    player: string;
    points: number;
  };
  mostWeeklyWins: {
    player: string;
    wins: number;
  };
  mostConsistent: {
    player: string;
    consistency: number;
  };
  averageWeeklyScore: number;
}
