'use client';

import Link from 'next/link';
import { getPlayers, getTotalWeeks, getWeekData } from '@/utils/dataUtils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t, translatePlayerName, translateTeamName } = useLanguage();
  const players = getPlayers();
  const topPlayers = players.slice(0, 5);
  const totalPlayers = players.length;
  const totalWeeks = getTotalWeeks();
  const currentGameweek = totalWeeks;
  const latestWeekData = getWeekData(currentGameweek);
  
  // Calculate chips used by season halves
  const SEASON_SPLIT = 19;
  const chipsUsed: { [key: string]: { firstHalf: number; secondHalf: number; total: number } } = {
    'Wildcard': { firstHalf: 0, secondHalf: 0, total: 0 },
    'Bench Boost': { firstHalf: 0, secondHalf: 0, total: 0 },
    'Free Hit': { firstHalf: 0, secondHalf: 0, total: 0 },
    'Triple Captain': { firstHalf: 0, secondHalf: 0, total: 0 }
  };
  
  for (let i = 1; i <= totalWeeks; i++) {
    const weekData = getWeekData(i);
    weekData.forEach(entry => {
      if (entry.property && entry.property !== 'None') {
        if (i <= SEASON_SPLIT) {
          chipsUsed[entry.property].firstHalf += 1;
        } else {
          chipsUsed[entry.property].secondHalf += 1;
        }
        chipsUsed[entry.property].total += 1;
      }
    });
  }
  
  // Get highest scorer this week
  const weekWinner = latestWeekData[0];
  
  // Calculate average points this week
  const avgPointsThisWeek = latestWeekData.length > 0
    ? Math.round(latestWeekData.reduce((sum, e) => sum + e.points, 0) / latestWeekData.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Hero Section - FPL Style */}
      <section className="text-center py-8 sm:py-12 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl text-white">
        <div className="text-xs sm:text-sm font-semibold mb-2 opacity-90">{t('home.fpl')}</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
          {t('home.league')}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-2 opacity-90">
          {t('home.season')}
        </p>
        <div className="flex justify-center items-center gap-4 mt-4">
          <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
            <div className="text-2xl font-bold">{t('weekly.gw')} {currentGameweek}</div>
            <div className="text-xs opacity-80">{t('home.currentGW')}</div>
          </div>
          <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
            <div className="text-2xl font-bold">{totalPlayers}</div>
            <div className="text-xs opacity-80">{t('home.managers')}</div>
          </div>
        </div>
      </section>

      {/* Gameweek Overview */}
      <section className="card">
        <h2 className="text-2xl font-bold mb-6">{t('home.gwOverview')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-dark-card p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-600">{weekWinner?.points || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('home.highestScore')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{weekWinner?.playerName ? translatePlayerName(weekWinner.playerName) : 'TBD'}</div>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-600">{avgPointsThisWeek}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('home.avgScore')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{t('home.thisGW')}</div>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-600">{topPlayers[0]?.totalPoints || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('home.overallLeader')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{topPlayers[0]?.name ? translatePlayerName(topPlayers[0].name) : 'TBD'}</div>
          </div>
          <div className="bg-white dark:bg-dark-card p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-600">{totalWeeks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('home.gwCompleted')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Completed</div>
          </div>
        </div>
      </section>

      {/* Chips Usage Stats - By Season Halves */}
      <section className="card">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t('home.chipsUsage')} 🎮</h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
          {t('home.chipSeasonRule')}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
            <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">🃏</div>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{chipsUsed['Wildcard'].total}</div>
            <div className="text-xs sm:text-sm font-semibold truncate">{t('home.wildcard')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">
              {t('home.firstHalf')}: {chipsUsed['Wildcard'].firstHalf}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {t('home.secondHalf')}: {chipsUsed['Wildcard'].secondHalf}
            </div>
          </div>
          <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
            <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">💪</div>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{chipsUsed['Bench Boost'].total}</div>
            <div className="text-xs sm:text-sm font-semibold truncate">{t('home.benchBoost')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">
              {t('home.firstHalf')}: {chipsUsed['Bench Boost'].firstHalf}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {t('home.secondHalf')}: {chipsUsed['Bench Boost'].secondHalf}
            </div>
          </div>
          <div className="p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-800">
            <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">🎯</div>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{chipsUsed['Free Hit'].total}</div>
            <div className="text-xs sm:text-sm font-semibold truncate">{t('home.freeHit')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">
              {t('home.firstHalf')}: {chipsUsed['Free Hit'].firstHalf}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {t('home.secondHalf')}: {chipsUsed['Free Hit'].secondHalf}
            </div>
          </div>
          <div className="p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
            <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">👑</div>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{chipsUsed['Triple Captain'].total}</div>
            <div className="text-xs sm:text-sm font-semibold truncate">{t('home.tripleCaptain')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">
              {t('home.firstHalf')}: {chipsUsed['Triple Captain'].firstHalf}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {t('home.secondHalf')}: {chipsUsed['Triple Captain'].secondHalf}
            </div>
          </div>
        </div>
      </section>

      {/* League Standings */}
      <section className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('home.leagueStandings')}</h2>
          <Link href="/rankings" className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
            {t('home.viewFull')} →
          </Link>
        </div>
        
        <div className="space-y-3">
          {topPlayers.map((player, index) => (
            <Link
              key={player.id}
              href={`/player/${player.id}`}
              className="flex items-center justify-between p-4 bg-white dark:bg-dark-card rounded-lg hover:shadow-lg transition-all group border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  index === 0 ? 'bg-yellow-400 text-yellow-900' :
                  index === 1 ? 'bg-gray-300 text-gray-700' :
                  index === 2 ? 'bg-orange-400 text-orange-900' :
                  'bg-purple-600 text-white'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                    {translatePlayerName(player.name)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {player.teamName ? translateTeamName(player.teamName) : ''}
                  </div>
                </div>
              </div>
              <div className="text-end">
                <div className="text-2xl font-bold text-purple-600">
                  {player.totalPoints}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{t('home.points')}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions - FPL Style */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/rankings" className="card hover:shadow-xl transition-all group cursor-pointer border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl shrink-0">
              📊
            </div>
            <div>
              <h3 className="text-xl font-bold group-hover:text-purple-600 transition-colors">
                {t('home.leagueTable')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('home.viewStandings')}
              </p>
            </div>
          </div>
        </Link>

        <Link href="/weekly" className="card hover:shadow-xl transition-all group cursor-pointer border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl shrink-0">
              📅
            </div>
            <div>
              <h3 className="text-xl font-bold group-hover:text-purple-600 transition-colors">
                {t('home.gwHistory')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('home.weekByWeek')}
              </p>
            </div>
          </div>
        </Link>

        <Link href="/stats" className="card hover:shadow-xl transition-all group cursor-pointer border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl shrink-0">
              📈
            </div>
            <div>
              <h3 className="text-xl font-bold group-hover:text-purple-600 transition-colors">
                {t('home.statistics')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('home.analytics')}
              </p>
            </div>
          </div>
        </Link>

        <div className="card bg-gradient-to-br from-purple-600 to-pink-600 text-white border-2 border-purple-400">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl shrink-0">
              👑
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {t('home.leaderTitle')}
              </h3>
              <p className="text-lg opacity-90">
                {topPlayers[0]?.name ? translatePlayerName(topPlayers[0].name) : 'TBD'}
              </p>
              <p className="text-sm opacity-75">
                {topPlayers[0]?.totalPoints || 0} {t('home.points')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
