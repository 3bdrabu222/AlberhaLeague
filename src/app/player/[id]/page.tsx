'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPlayerStats, getWeekData, getTotalWeeks, getPlayers } from '@/utils/dataUtils';
import PlayerChart from '@/components/PlayerChart';
import ChipUsageTracker from '@/components/ChipUsageTracker';
import { useLanguage } from '@/contexts/LanguageContext';
import PlayerAvatar from '@/components/PlayerAvatar';

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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <PlayerAvatar player={player} size="xl" />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 truncate">{translatePlayerName(player.name)}</h1>
              <p className="text-sm sm:text-base md:text-lg opacity-90 truncate">{player.teamName ? translateTeamName(player.teamName) : ''}</p>
              <p className="text-xs sm:text-sm opacity-75">{t('player.profile')}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold">{player.totalPoints}</div>
            <div className="text-xs sm:text-sm opacity-80">{t('player.totalPoints')}</div>
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
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t('player.weeklyPerf')}</h2>
        <div className="w-full overflow-x-auto">
          <PlayerChart weeklyScores={weeklyScores} playerName={translatePlayerName(player.name)} />
        </div>
      </div>

      {/* Gameweek History Table */}
      <div className="card overflow-hidden p-0 sm:p-4 md:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-4 sm:px-0 pt-4 sm:pt-0">{t('player.gwHistory')}</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm">{t('player.gameweek')}</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm hidden md:table-cell">{t('weekly.chipUsed')}</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm">{t('weekly.gwPoints')}</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm hidden sm:table-cell">{t('weekly.transferCost')}</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm">{t('player.vsAvg')}</th>
                </tr>
              </thead>
              <tbody>
                {weeklyDetails.map((detail) => {
                  const diff = detail.points - averageScore;
                  return (
                    <tr key={detail.week} className="table-row">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base">{t('weekly.gw')} {detail.week}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-center hidden md:table-cell">
                        {detail.property && detail.property !== 'None' ? (
                          <span className="inline-block px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg font-semibold text-xs sm:text-sm">
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
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                        <span className="text-xl sm:text-2xl font-bold text-primary">{detail.points}</span>
                        {detail.property && detail.property !== 'None' && (
                          <div className="text-xs text-blue-600 dark:text-blue-400 md:hidden mt-1">
                            🎮 {translateChipName(detail.property)}
                          </div>
                        )}
                        {detail.negatives !== 0 && (
                          <div className="text-xs text-red-500 sm:hidden mt-1">
                            {t('weekly.transferCost')}: -{detail.negatives}
                          </div>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-right hidden sm:table-cell">
                        {detail.negatives !== 0 ? (
                          <span className="text-base sm:text-lg font-bold text-red-500">{detail.negatives}</span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">0</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                        <span className={`font-semibold text-sm sm:text-base ${
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
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link href="/rankings" className="btn-secondary text-center">
          ← {t('player.backToRankings')}
        </Link>
        <Link href="/weekly" className="btn-secondary text-center">
          {t('player.viewWeekly')}
        </Link>
      </div>
    </div>
  );
}
