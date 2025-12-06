'use client';

import { getPlayers, getTotalWeeks, getWeekData, getPlayerStats } from '@/utils/dataUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

interface PerformanceHeatMapProps {
  maxPlayers?: number;
}

const PerformanceHeatMap: React.FC<PerformanceHeatMapProps> = ({ maxPlayers = 10 }) => {
  const { t, translatePlayerName } = useLanguage();
  const players = getPlayers().slice(0, maxPlayers);
  const totalWeeks = getTotalWeeks();

  // Get all weekly scores for each player
  const heatMapData = players.map(player => {
    const stats = getPlayerStats(player.id);
    const weeklyScores: number[] = [];
    for (let week = 1; week <= totalWeeks; week++) {
      const weekData = getWeekData(week);
      const playerWeek = weekData.find(w => w.playerId === player.id);
      weeklyScores.push(playerWeek?.points || 0);
    }
    return {
      player,
      weeklyScores,
      average: stats?.averageScore || 0,
    };
  });

  // Calculate min and max for color scaling
  const allScores = heatMapData.flatMap(d => d.weeklyScores);
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  const range = maxScore - minScore;

  // Get color based on score
  const getColor = (score: number): string => {
    if (score === 0) return 'bg-gray-100 dark:bg-gray-800';
    const normalized = (score - minScore) / range;
    if (normalized < 0.2) return 'bg-red-200 dark:bg-red-900/30';
    if (normalized < 0.4) return 'bg-orange-200 dark:bg-orange-900/30';
    if (normalized < 0.6) return 'bg-yellow-200 dark:bg-yellow-900/30';
    if (normalized < 0.8) return 'bg-green-200 dark:bg-green-900/30';
    return 'bg-green-400 dark:bg-green-700';
  };

  // Get text color based on background
  const getTextColor = (score: number): string => {
    if (score === 0) return 'text-gray-400 dark:text-gray-600';
    const normalized = (score - minScore) / range;
    if (normalized < 0.6) return 'text-gray-900 dark:text-gray-100';
    return 'text-white';
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">{t('stats.performanceHeatMap')}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {t('stats.heatMapDescription')}
      </p>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-3 text-end sticky right-0 bg-white dark:bg-dark-card z-10 border-r border-gray-200 dark:border-gray-700">
                  {t('stats.player')}
                </th>
                {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => (
                  <th
                    key={week}
                    className="px-2 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 min-w-[50px]"
                  >
                    GW{week}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {t('stats.avg')}
                </th>
              </tr>
            </thead>
            <tbody>
              {heatMapData.map(({ player, weeklyScores, average }) => (
                <tr key={player.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 text-end sticky right-0 bg-white dark:bg-dark-card z-10 border-r border-gray-200 dark:border-gray-700">
                    <Link
                      href={`/player/${player.id}`}
                      className="font-semibold hover:text-purple-600 transition-colors"
                    >
                      {translatePlayerName(player.name)}
                    </Link>
                  </td>
                  {weeklyScores.map((score, weekIndex) => (
                    <td
                      key={weekIndex}
                      className={`px-2 py-2 text-center ${getColor(score)} ${getTextColor(score)} font-semibold text-sm`}
                      title={`${translatePlayerName(player.name)} - GW${weekIndex + 1}: ${score} ${t('home.points')}`}
                    >
                      {score > 0 ? score : '-'}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center font-bold text-purple-600">
                    {average.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
        <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
          {t('stats.legend')}:
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-200 dark:bg-red-900/30 rounded"></div>
          <span className="text-xs">{t('stats.low')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-200 dark:bg-yellow-900/30 rounded"></div>
          <span className="text-xs">{t('stats.medium')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-400 dark:bg-green-700 rounded"></div>
          <span className="text-xs">{t('stats.high')}</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceHeatMap;

