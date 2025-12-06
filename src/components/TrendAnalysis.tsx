'use client';

import { getPlayers, getTotalWeeks, getPlayerStats } from '@/utils/dataUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendAnalysisProps {
  maxPlayers?: number;
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ maxPlayers = 10 }) => {
  const { t, translatePlayerName } = useLanguage();
  const players = getPlayers().slice(0, maxPlayers);
  const totalWeeks = getTotalWeeks();

  // Calculate trend for each player
  const trendData = players.map(player => {
    const stats = getPlayerStats(player.id);
    const weeklyScores = stats?.weeklyScores || [];
    
    if (weeklyScores.length < 4) {
      return {
        player,
        trend: 'insufficient',
        trendValue: 0,
        firstHalfAvg: 0,
        secondHalfAvg: 0,
        weeklyScores,
      };
    }

    const midPoint = Math.floor(weeklyScores.length / 2);
    const firstHalf = weeklyScores.slice(0, midPoint);
    const secondHalf = weeklyScores.slice(midPoint);
    
    const firstHalfAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const trendValue = secondHalfAvg - firstHalfAvg;
    
    let trend: 'improving' | 'declining' | 'stable';
    if (trendValue > 2) trend = 'improving';
    else if (trendValue < -2) trend = 'declining';
    else trend = 'stable';

    return {
      player,
      trend,
      trendValue,
      firstHalfAvg,
      secondHalfAvg,
      weeklyScores,
    };
  });

  // Prepare chart data for trend visualization
  const chartData = [];
  for (let week = 1; week <= totalWeeks; week++) {
    const entry: any = { week: `GW${week}` };
    trendData.forEach((data, index) => {
      if (data.weeklyScores[week - 1] !== undefined) {
        entry[`player${index + 1}`] = data.weeklyScores[week - 1];
      }
    });
    chartData.push(entry);
  }

  const COLORS = ['#9333EA', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316'];

  return (
    <div className="space-y-6">
      {/* Trend Cards */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">{t('stats.trendAnalysis')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendData.map((data) => (
            <Link
              key={data.player.id}
              href={`/player/${data.player.id}`}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                data.trend === 'improving'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 hover:border-green-600'
                  : data.trend === 'declining'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 hover:border-red-600'
                  : 'border-gray-300 bg-gray-50 dark:bg-gray-800 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-lg">
                  {translatePlayerName(data.player.name)}
                </div>
                <div className="text-2xl">
                  {data.trend === 'improving' && '📈'}
                  {data.trend === 'declining' && '📉'}
                  {data.trend === 'stable' && '➡️'}
                  {data.trend === 'insufficient' && '❓'}
                </div>
              </div>
              
              {data.trend !== 'insufficient' ? (
                <>
                  <div className="mb-2">
                    <span className={`font-bold text-sm ${
                      data.trend === 'improving'
                        ? 'text-green-600 dark:text-green-400'
                        : data.trend === 'declining'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {data.trend === 'improving' && t('stats.improving')}
                      {data.trend === 'declining' && t('stats.declining')}
                      {data.trend === 'stable' && t('stats.stable')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">{t('stats.firstHalf')}</div>
                      <div className="font-semibold">{data.firstHalfAvg.toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">{t('stats.secondHalf')}</div>
                      <div className="font-semibold">{data.secondHalfAvg.toFixed(1)}</div>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {t('stats.change')}: 
                      <span className={`font-bold ml-1 ${
                        data.trendValue > 0 ? 'text-green-600' : data.trendValue < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {data.trendValue > 0 ? '+' : ''}{data.trendValue.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('stats.insufficientData')}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Trend Chart */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">{t('stats.trendChart')}</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            {trendData.map((data, index) => (
              <Line
                key={data.player.id}
                type="monotone"
                dataKey={`player${index + 1}`}
                name={translatePlayerName(data.player.name)}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendAnalysis;

