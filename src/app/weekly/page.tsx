'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getTotalWeeks, getWeekData, getPlayerById } from '@/utils/dataUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import PlayerAvatar from '@/components/PlayerAvatar';

export default function Weekly() {
  const { t, translatePlayerName, translateChipName } = useLanguage();
  const totalWeeks = getTotalWeeks();
  const [selectedWeek, setSelectedWeek] = useState(1);
  const weekData = getWeekData(selectedWeek);

  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">{t('weekly.title')}</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('weekly.subtitle')}
        </p>
      </div>

      {/* Gameweek Selector */}
      <div className="card">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t('weekly.selectGW')}</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-10 xl:grid-cols-13 gap-1.5 sm:gap-2">
          {weeks.map((week) => (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={`py-1.5 sm:py-2 px-1 sm:px-2 md:px-3 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
                selectedWeek === week
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {t('weekly.gw')}{week}
            </button>
          ))}
        </div>
      </div>

      {/* Gameweek Results */}
      <div className="card overflow-hidden p-0 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6 px-4 sm:px-0 pt-4 sm:pt-0">
          <h2 className="text-xl sm:text-2xl font-bold">{t('weekly.results')} {selectedWeek}</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {weekData.length} {t('weekly.managers')}
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-2 sm:px-4 py-3 sm:py-4 text-center text-xs sm:text-sm">{t('rankings.rank')}</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-end text-xs sm:text-sm">{t('rankings.manager')}</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm hidden md:table-cell">{t('weekly.chipUsed')}</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm">{t('weekly.gwPoints')}</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm hidden sm:table-cell">{t('weekly.transferCost')}</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm">{t('rankings.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {weekData.map((entry, index) => {
                  const player = getPlayerById(entry.playerId);
                  return (
                    <tr key={entry.playerId} className="table-row">
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                        {player ? (
                          <PlayerAvatar player={player} size="md" showRank rank={index + 1} className="mx-auto" />
                        ) : (
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold mx-auto text-xs sm:text-sm ${
                            index === 0 ? 'bg-yellow-400 text-yellow-900' :
                            index === 1 ? 'bg-gray-300 text-gray-700' :
                            index === 2 ? 'bg-orange-400 text-orange-900' :
                            'bg-gray-200 dark:bg-dark-hover text-gray-700 dark:text-gray-300'
                          }`}>
                            {index + 1}
                          </div>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-end">
                        <div className="font-semibold text-sm sm:text-base md:text-lg truncate max-w-[120px] sm:max-w-none">{translatePlayerName(entry.playerName)}</div>
                        {entry.property && entry.property !== 'None' && (
                          <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 md:hidden mt-1">
                            🎮 {translateChipName(entry.property)}
                          </div>
                        )}
                        {entry.negatives && entry.negatives !== 0 && (
                          <div className="text-xs sm:text-sm text-red-500 sm:hidden mt-1">
                            {t('weekly.transferCost')}: -{entry.negatives}
                          </div>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-center hidden md:table-cell">
                        {entry.property && entry.property !== 'None' ? (
                          <span className="inline-block px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs sm:text-sm font-semibold">
                            🎮 {translateChipName(entry.property)}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                        <div className="text-xl sm:text-2xl font-bold text-purple-600">
                          {entry.points}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-center hidden sm:table-cell">
                        {entry.negatives && entry.negatives !== 0 ? (
                          <span className="text-base sm:text-lg font-bold text-red-500">
                            {entry.negatives}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">0</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                        <Link
                          href={`/player/${entry.playerId}`}
                          className="inline-block px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm"
                        >
                          {t('common.view')}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Week Stats */}
      <div className="card bg-gray-50 dark:bg-dark-hover">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t('weekly.weekStats')} {selectedWeek}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">{t('home.highestScore')}</div>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">
              {weekData[0]?.points || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
              {weekData[0]?.playerName ? translatePlayerName(weekData[0].playerName) : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">{t('weekly.lowestScore')}</div>
            <div className="text-xl sm:text-2xl font-bold">
              {weekData[weekData.length - 1]?.points || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
              {weekData[weekData.length - 1]?.playerName ? translatePlayerName(weekData[weekData.length - 1].playerName) : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">{t('home.avgScore')}</div>
            <div className="text-xl sm:text-2xl font-bold">
              {weekData.length > 0
                ? Math.round(weekData.reduce((sum, e) => sum + e.points, 0) / weekData.length)
                : 0
              }
            </div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">{t('weekly.totalPlayers')}</div>
            <div className="text-xl sm:text-2xl font-bold">
              {weekData.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
