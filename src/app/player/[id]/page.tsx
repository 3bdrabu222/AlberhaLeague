'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPlayerStats, getWeekData, getTotalWeeks, getPlayers } from '@/utils/dataUtils';
import PlayerChart from '@/components/PlayerChart';
import ChipUsageTracker from '@/components/ChipUsageTracker';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PlayerProfile() {
  const { t, translatePlayerName, translateTeamName, translateChipName } = useLanguage();
  const params = useParams();
  const playerId = parseInt(params.id as string);
  const stats = getPlayerStats(playerId);
  const totalWeeks = getTotalWeeks();
  
  // Get leader's points for gap calculation
  const allPlayers = getPlayers();
  const leader = allPlayers[0]; // First player is the leader (sorted by totalPoints)
  const pointsGapFromLeader = leader ? leader.totalPoints - (stats?.player.totalPoints || 0) : 0;

  if (!stats) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">{t('common.error')}</h1>
        <Link href="/rankings" className="btn-primary">
          {t('rankings.title')}
        </Link>
      </div>
    );
  }

  const { player, weeklyScores, averageScore, highestWeek, lowestWeek, consistency } = stats;
  
  // Get detailed week data with properties and negatives
  const weeklyDetails = [];
  for (let i = 1; i <= totalWeeks; i++) {
    const weekData = getWeekData(i);
    const playerWeek = weekData.find(w => w.playerId === playerId);
    if (playerWeek) {
      weeklyDetails.push({
        week: i,
        points: playerWeek.points,
        property: playerWeek.property || 'None',
        negatives: playerWeek.negatives || 0
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{translatePlayerName(player.name)}</h1>
            <p className="text-lg opacity-90">{player.teamName ? translateTeamName(player.teamName) : ''}</p>
            <p className="text-sm opacity-75">{t('player.profile')}</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{player.totalPoints}</div>
            <div className="text-sm opacity-80">{t('player.totalPoints')}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Responsive for Mobile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="card text-center p-3 sm:p-4">
          <div className="text-2xl sm:text-3xl font-bold text-purple-600">{averageScore.toFixed(1)}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('player.avgPoints')}</div>
        </div>
        <div className="card text-center p-3 sm:p-4">
          <div className="text-2xl sm:text-3xl font-bold text-green-500">{highestWeek}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('player.bestWeek')}</div>
        </div>
        <div className="card text-center p-3 sm:p-4">
          <div className="text-2xl sm:text-3xl font-bold text-red-500">{lowestWeek}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('player.worstWeek')}</div>
        </div>
        <div className="card text-center p-3 sm:p-4">
          {pointsGapFromLeader === 0 ? (
            <>
              <div className="text-2xl sm:text-3xl font-bold text-yellow-500">👑</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('player.leader')}</div>
            </>
          ) : (
            <>
              <div className="text-2xl sm:text-3xl font-bold text-orange-500">-{pointsGapFromLeader}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{t('player.gapFromLeader')}</div>
            </>
          )}
        </div>
      </div>

      {/* Chip Usage Tracker - New Feature */}
      <ChipUsageTracker weeklyDetails={weeklyDetails} />

      {/* Weekly Performance Chart */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">{t('player.weeklyPerf')}</h2>
        <PlayerChart weeklyScores={weeklyScores} playerName={translatePlayerName(player.name)} />
      </div>

      {/* Gameweek History Table */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">{t('player.gwHistory')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-4 text-left">{t('player.gameweek')}</th>
                <th className="px-6 py-4 text-center">{t('weekly.chipUsed')}</th>
                <th className="px-6 py-4 text-right">{t('weekly.gwPoints')}</th>
                <th className="px-6 py-4 text-right">{t('weekly.transferCost')}</th>
                <th className="px-6 py-4 text-right">{t('player.vsAvg')}</th>
              </tr>
            </thead>
            <tbody>
              {weeklyDetails.map((detail) => {
                const diff = detail.points - averageScore;
                return (
                  <tr key={detail.week} className="table-row">
                    <td className="px-6 py-4 font-semibold">{t('weekly.gw')} {detail.week}</td>
                    <td className="px-6 py-4 text-center">
                      {detail.property && detail.property !== 'None' ? (
                        <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg font-semibold">
                          {detail.property === 'Wildcard' && '🃏'}
                          {detail.property === 'Bench Boost' && '💪'}
                          {detail.property === 'Free Hit' && '🎯'}
                          {detail.property === 'Triple Captain' && '👑'}
                          {' '}{translateChipName(detail.property)}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-600 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-2xl font-bold text-primary">{detail.points}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {detail.negatives !== 0 ? (
                        <span className="text-lg font-bold text-red-500">{detail.negatives}</span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-600">0</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-semibold ${
                        diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link href="/rankings" className="btn-secondary">
          ← {t('player.backToRankings')}
        </Link>
        <Link href="/weekly" className="btn-secondary">
          {t('player.viewWeekly')}
        </Link>
      </div>
    </div>
  );
}
