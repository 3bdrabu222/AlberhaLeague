'use client';

import { getLeagueStats, getPlayers, getTotalWeeks } from '@/utils/dataUtils';
import LeagueChart from '@/components/LeagueChart';
import WeeklyTrendsChart from '@/components/WeeklyTrendsChart';
import PerformanceHeatMap from '@/components/PerformanceHeatMap';
import TrendAnalysis from '@/components/TrendAnalysis';
import PerformancePrediction from '@/components/PerformancePrediction';
import { useLanguage } from '@/contexts/LanguageContext';
import PlayerAvatar from '@/components/PlayerAvatar';

export default function Stats() {
  const { t, translatePlayerName } = useLanguage();
  const leagueStats = getLeagueStats();
  const players = getPlayers();
  const totalWeeks = getTotalWeeks();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">{t('stats.title')}</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('stats.subtitle')}
        </p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="card bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
          <div className="text-sm opacity-90 mb-2">{t('stats.highestWeek')}</div>
          <div className="text-3xl font-bold mb-1">{leagueStats.highestScoringWeek.points}</div>
          <div className="text-sm opacity-80">
            {translatePlayerName(leagueStats.highestScoringWeek.player)} - {t('player.week')} {leagueStats.highestScoringWeek.week}
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-400 to-blue-600 text-white">
          <div className="text-sm opacity-90 mb-2">{t('stats.mostWins')}</div>
          <div className="text-3xl font-bold mb-1">{leagueStats.mostWeeklyWins.wins}</div>
          <div className="text-sm opacity-80">
            {translatePlayerName(leagueStats.mostWeeklyWins.player)}
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-400 to-green-600 text-white">
          <div className="text-sm opacity-90 mb-2">{t('stats.mostConsistent')}</div>
          <div className="text-3xl font-bold mb-1">
            {leagueStats.mostConsistent.consistency.toFixed(1)}
          </div>
          <div className="text-sm opacity-80">
            {translatePlayerName(leagueStats.mostConsistent.player)}
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-400 to-purple-600 text-white">
          <div className="text-sm opacity-90 mb-2">{t('stats.avgWeekly')}</div>
          <div className="text-3xl font-bold mb-1">
            {leagueStats.averageWeeklyScore.toFixed(1)}
          </div>
          <div className="text-sm opacity-80">
            {t('stats.acrossAll')}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Players Chart */}
        <div className="card">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t('stats.top10')}</h2>
          <div className="w-full overflow-x-auto">
            <LeagueChart players={players.slice(0, 10)} />
          </div>
        </div>

        {/* Weekly Trends */}
        <div className="card">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t('stats.weeklyTrends')}</h2>
          <div className="w-full overflow-x-auto">
            <WeeklyTrendsChart players={players.slice(0, 5)} />
          </div>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="card overflow-hidden p-0 sm:p-4 md:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-4 sm:px-0 pt-4 sm:pt-0">{t('stats.detailedStats')}</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs sm:text-sm">{t('rankings.rank')}</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-end text-xs sm:text-sm">{t('stats.player')}</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm">{t('stats.total')}</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm hidden sm:table-cell">{t('stats.avgWeek')}</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm">{t('stats.performance')}</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => {
                  const avgPerWeek = (player.totalPoints / totalWeeks).toFixed(1);
                  const performance = player.totalPoints >= 700 ? t('stats.excellent') :
                                    player.totalPoints >= 650 ? t('stats.good') :
                                    player.totalPoints >= 600 ? t('stats.averagePerf') : t('stats.belowAvg');
                  const performanceColor = player.totalPoints >= 700 ? 'text-green-500' :
                                         player.totalPoints >= 650 ? 'text-blue-500' :
                                         player.totalPoints >= 600 ? 'text-yellow-500' : 'text-red-500';
                  
                  return (
                    <tr key={player.id} className="table-row">
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                        <PlayerAvatar player={player} size="md" showRank rank={index + 1} className="mx-auto" />
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-end">
                        <div className="font-semibold text-sm sm:text-base md:text-lg truncate max-w-[120px] sm:max-w-none">{translatePlayerName(player.name)}</div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 sm:hidden mt-1">
                          {t('stats.avgWeek')}: {avgPerWeek}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                        <span className="text-lg sm:text-xl font-bold text-purple-600">{player.totalPoints}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-center font-semibold hidden sm:table-cell">{avgPerWeek}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                        <span className={`font-semibold text-xs sm:text-sm ${performanceColor}`}>
                          {performance}
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

      {/* Additional Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="card bg-gray-50 dark:bg-dark-hover">
          <h3 className="font-semibold mb-2">{t('stats.totalPlayersLabel')}</h3>
          <div className="text-3xl font-bold text-purple-600">{players.length}</div>
        </div>
        <div className="card bg-gray-50 dark:bg-dark-hover">
          <h3 className="font-semibold mb-2">{t('stats.totalPointsScored')}</h3>
          <div className="text-3xl font-bold text-purple-600">
            {players.reduce((sum, p) => sum + p.totalPoints, 0)}
          </div>
        </div>
        <div className="card bg-gray-50 dark:bg-dark-hover">
          <h3 className="font-semibold mb-2">{t('stats.pointSpread')}</h3>
          <div className="text-3xl font-bold text-purple-600">
            {players[0]?.totalPoints - players[players.length - 1]?.totalPoints}
          </div>
        </div>
      </div>

      {/* Performance Heat Map */}
      <PerformanceHeatMap maxPlayers={players.length} />

      {/* Trend Analysis */}
      <TrendAnalysis maxPlayers={players.length} />

      {/* Performance Prediction */}
      <PerformancePrediction maxPlayers={players.length} />
    </div>
  );
}
