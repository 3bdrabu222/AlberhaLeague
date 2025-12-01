'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getTotalWeeks, getWeekData } from '@/utils/dataUtils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Weekly() {
  const { t, translatePlayerName, translateChipName } = useLanguage();
  const totalWeeks = getTotalWeeks();
  const [selectedWeek, setSelectedWeek] = useState(1);
  const weekData = getWeekData(selectedWeek);

  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">{t('weekly.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('weekly.subtitle')}
        </p>
      </div>

      {/* Gameweek Selector */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">{t('weekly.selectGW')}</h3>
        <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-13 gap-2">
          {weeks.map((week) => (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={`py-2 px-3 rounded-lg font-semibold transition-all text-sm ${
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
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('weekly.results')} {selectedWeek}</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {weekData.length} {t('weekly.managers')}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-4 py-4 text-center">{t('rankings.rank')}</th>
                <th className="px-6 py-4 text-end">{t('rankings.manager')}</th>
                <th className="px-6 py-4 text-center">{t('weekly.chipUsed')}</th>
                <th className="px-6 py-4 text-center">{t('weekly.gwPoints')}</th>
                <th className="px-6 py-4 text-center">{t('weekly.transferCost')}</th>
                <th className="px-6 py-4 text-center">{t('rankings.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {weekData.map((entry, index) => (
                <tr key={entry.playerId} className="table-row">
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
                    <div className="font-semibold text-lg">{translatePlayerName(entry.playerName)}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {entry.property && entry.property !== 'None' ? (
                      <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                        🎮 {translateChipName(entry.property)}
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-600 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {entry.points}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {entry.negatives && entry.negatives !== 0 ? (
                      <span className="text-lg font-bold text-red-500">
                        {entry.negatives}
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-600">0</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/player/${entry.playerId}`}
                      className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                    >
                      {t('common.view')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Week Stats */}
      <div className="card bg-gray-50 dark:bg-dark-hover">
        <h3 className="text-lg font-semibold mb-4">{t('weekly.weekStats')} {selectedWeek}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('home.highestScore')}</div>
            <div className="text-2xl font-bold text-purple-600">
              {weekData[0]?.points || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {weekData[0]?.playerName ? translatePlayerName(weekData[0].playerName) : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('weekly.lowestScore')}</div>
            <div className="text-2xl font-bold">
              {weekData[weekData.length - 1]?.points || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {weekData[weekData.length - 1]?.playerName ? translatePlayerName(weekData[weekData.length - 1].playerName) : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('home.avgScore')}</div>
            <div className="text-2xl font-bold">
              {weekData.length > 0
                ? Math.round(weekData.reduce((sum, e) => sum + e.points, 0) / weekData.length)
                : 0
              }
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('weekly.totalPlayers')}</div>
            <div className="text-2xl font-bold">
              {weekData.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
