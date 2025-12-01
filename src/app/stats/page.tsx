'use client';

import { getLeagueStats, getPlayers, getTotalWeeks } from '@/utils/dataUtils';
import LeagueChart from '@/components/LeagueChart';
import WeeklyTrendsChart from '@/components/WeeklyTrendsChart';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Stats() {
  const { t, translatePlayerName } = useLanguage();
  const leagueStats = getLeagueStats();
  const players = getPlayers();
  const totalWeeks = getTotalWeeks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">{t('stats.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('stats.subtitle')}
        </p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Players Chart */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">{t('stats.top10')}</h2>
          <LeagueChart players={players.slice(0, 10)} />
        </div>

        {/* Weekly Trends */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">{t('stats.weeklyTrends')}</h2>
          <WeeklyTrendsChart players={players.slice(0, 5)} />
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">{t('stats.detailedStats')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-4 py-4 text-center">{t('rankings.rank')}</th>
                <th className="px-6 py-4 text-end">{t('stats.player')}</th>
                <th className="px-6 py-4 text-center">{t('stats.total')}</th>
                <th className="px-6 py-4 text-center">{t('stats.avgWeek')}</th>
                <th className="px-6 py-4 text-center">{t('stats.performance')}</th>
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
                    <td className="px-4 py-4 text-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-orange-400 text-orange-900' :
                        'bg-gray-200 dark:bg-dark-hover text-gray-700 dark:text-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="font-semibold text-lg">{translatePlayerName(player.name)}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xl font-bold text-purple-600">{player.totalPoints}</span>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold">{avgPerWeek}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${performanceColor}`}>
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

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
  );
}
