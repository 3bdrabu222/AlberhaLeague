'use client';

import { useState } from 'react';
import Link from 'next/link';
import { searchPlayers } from '@/utils/dataUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import PlayerAvatar from '@/components/PlayerAvatar';

export default function Rankings() {
  const { t, translatePlayerName, translateTeamName } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const players = searchPlayers(searchQuery);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">{t('rankings.title')}</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {t('rankings.subtitle')}
          </p>
        </div>
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder={t('rankings.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field w-full md:min-w-[250px] lg:min-w-[300px]"
          />
        </div>
      </div>

      <div className="card overflow-hidden p-0 sm:p-4 md:p-6">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-4 text-center text-xs sm:text-sm">{t('rankings.rank')}</th>
                  <th className="px-2.5 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-end text-xs sm:text-sm">{t('rankings.manager')}</th>
                  <th className="px-2.5 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-center text-xs hidden md:table-cell">{t('rankings.teamName')}</th>
                  <th className="px-2.5 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-center text-xs sm:text-sm">{t('rankings.overallPoints')}</th>
                  <th className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-4 text-center text-xs">{t('rankings.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={player.id} className="table-row hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors">
                    <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-center">
                      <PlayerAvatar player={player} size="sm" showRank rank={index + 1} className="mx-auto" />
                    </td>
                    <td className="px-2.5 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 text-end">
                      <div className="font-semibold text-xs sm:text-sm md:text-base truncate max-w-[100px] sm:max-w-none">{translatePlayerName(player.name)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 md:hidden truncate">{player.teamName ? translateTeamName(player.teamName) : '-'}</div>
                    </td>
                    <td className="px-2.5 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 text-center hidden md:table-cell">
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{player.teamName ? translateTeamName(player.teamName) : '-'}</div>
                    </td>
                    <td className="px-2.5 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 text-center">
                      <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
                        {player.totalPoints}
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-center">
                      <Link
                        href={`/player/${player.id}`}
                        className="inline-flex items-center justify-center px-2 sm:px-2.5 md:px-4 py-1 sm:py-1.5 md:py-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg transition-colors font-medium text-xs md:text-sm whitespace-nowrap"
                      >
                        {t('rankings.viewTeam')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {players.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {t('rankings.noResults')} "{searchQuery}"
          </div>
        )}
      </div>

      <div className="card bg-gray-50 dark:bg-dark-hover">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">{t('rankings.quickStats')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
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
