'use client';

import { useState } from 'react';
import Link from 'next/link';
import { searchPlayers } from '@/utils/dataUtils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Rankings() {
  const { t, translatePlayerName, translateTeamName } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const players = searchPlayers(searchQuery);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t('rankings.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('rankings.subtitle')}
          </p>
        </div>
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder={t('rankings.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field min-w-[300px]"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="px-4 py-4 text-center">{t('rankings.rank')}</th>
                <th className="px-6 py-4 text-end">{t('rankings.manager')}</th>
                <th className="px-6 py-4 text-center">{t('rankings.teamName')}</th>
                <th className="px-6 py-4 text-center">{t('rankings.overallPoints')}</th>
                <th className="px-6 py-4 text-center">{t('rankings.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
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
                    <div className="text-gray-600 dark:text-gray-400">{player.teamName ? translateTeamName(player.teamName) : ''}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {player.totalPoints}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/player/${player.id}`}
                      className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                    >
                      {t('rankings.viewTeam')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {players.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {t('rankings.noResults')} "{searchQuery}"
          </div>
        )}
      </div>

      <div className="card bg-gray-50 dark:bg-dark-hover">
        <h3 className="text-lg font-semibold mb-2">{t('rankings.quickStats')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">{t('rankings.totalPlayers')}:</span>
            <span className="mx-2 font-semibold">{players.length}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">{t('rankings.highestScore')}:</span>
            <span className="mx-2 font-semibold text-purple-600">{players[0]?.totalPoints || 0}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">{t('rankings.avgScore')}:</span>
            <span className="mx-2 font-semibold">
              {players.length > 0 
                ? Math.round(players.reduce((sum, p) => sum + p.totalPoints, 0) / players.length)
                : 0
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
