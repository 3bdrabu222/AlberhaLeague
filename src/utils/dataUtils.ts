import playersData from '@/data/players.json';
import weeksData from '@/data/weeks.json';
import { Player, WeeklyScore, PlayerStats, LeagueStats } from '@/types';

export const getPlayers = (): Player[] => {
  return playersData.players.sort((a, b) => b.totalPoints - a.totalPoints);
};

export const getWeekData = (week: number): WeeklyScore[] => {
  const weekKey = `week${week}` as keyof typeof weeksData;
  return weeksData[weekKey]?.sort((a, b) => b.points - a.points) || [];
};

export const getAllWeeksData = () => {
  return weeksData;
};

export const getTotalWeeks = (): number => {
  return Object.keys(weeksData).length;
};

export const getPlayerById = (id: number): Player | undefined => {
  return playersData.players.find(p => p.id === id);
};

export const getPlayerStats = (playerId: number): PlayerStats | null => {
  const player = getPlayerById(playerId);
  if (!player) return null;

  const totalWeeks = getTotalWeeks();
  const weeklyScores: number[] = [];
  for (let i = 1; i <= totalWeeks; i++) {
    const weekData = getWeekData(i);
    const playerWeek = weekData.find(w => w.playerId === playerId);
    if (playerWeek) {
      weeklyScores.push(playerWeek.points);
    }
  }

  const averageScore = weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;
  const highestWeek = Math.max(...weeklyScores);
  const lowestWeek = Math.min(...weeklyScores);
  
  // Calculate consistency (lower standard deviation = more consistent)
  const variance = weeklyScores.reduce((sum, score) => {
    return sum + Math.pow(score - averageScore, 2);
  }, 0) / weeklyScores.length;
  const consistency = Math.sqrt(variance);

  return {
    player,
    weeklyScores,
    averageScore,
    highestWeek,
    lowestWeek,
    consistency,
  };
};

export const getLeagueStats = (): LeagueStats => {
  const totalWeeks = getTotalWeeks();
  let highestScoringWeek = { week: 1, player: '', points: 0 };
  const weeklyWins: { [key: string]: number } = {};
  
  // Find highest scoring week and count weekly wins
  for (let i = 1; i <= totalWeeks; i++) {
    const weekData = getWeekData(i);
    if (weekData.length > 0) {
      const topPlayer = weekData[0];
      if (topPlayer.points > highestScoringWeek.points) {
        highestScoringWeek = {
          week: i,
          player: topPlayer.playerName,
          points: topPlayer.points,
        };
      }
      
      // Count wins
      weeklyWins[topPlayer.playerName] = (weeklyWins[topPlayer.playerName] || 0) + 1;
    }
  }

  // Find player with most weekly wins
  let mostWeeklyWins = { player: '', wins: 0 };
  Object.entries(weeklyWins).forEach(([player, wins]) => {
    if (wins > mostWeeklyWins.wins) {
      mostWeeklyWins = { player, wins };
    }
  });

  // Find most consistent player
  const players = getPlayers();
  let mostConsistent = { player: '', consistency: Infinity };
  players.forEach(player => {
    const stats = getPlayerStats(player.id);
    if (stats && stats.consistency < mostConsistent.consistency) {
      mostConsistent = {
        player: player.name,
        consistency: stats.consistency,
      };
    }
  });

  // Calculate average weekly score
  let totalScores = 0;
  let totalEntries = 0;
  for (let i = 1; i <= totalWeeks; i++) {
    const weekData = getWeekData(i);
    weekData.forEach(entry => {
      totalScores += entry.points;
      totalEntries++;
    });
  }
  const averageWeeklyScore = totalScores / totalEntries;

  return {
    highestScoringWeek,
    mostWeeklyWins,
    mostConsistent,
    averageWeeklyScore,
  };
};

export const searchPlayers = (query: string): Player[] => {
  const players = getPlayers();
  if (!query) return players;
  
  const lowerQuery = query.toLowerCase();
  return players.filter(player => 
    player.name.toLowerCase().includes(lowerQuery)
  );
};
