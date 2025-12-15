'use client';

import { useState } from 'react';
import { getPlayers, getPlayerStats, getTotalWeeks, getWeekData } from '@/utils/dataUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Player } from '@/types';
import Link from 'next/link';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import PlayerAvatar from '@/components/PlayerAvatar';

const COLORS = ['#9333EA', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function ComparePage() {
  const { t, translatePlayerName, translateTeamName } = useLanguage();
  const players = getPlayers();
  const totalWeeks = getTotalWeeks();
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);

  const handlePlayerSelect = (playerId: number) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else if (selectedPlayers.length < 3) {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  const selectedPlayersData = selectedPlayers.map(id => {
    const player = players.find(p => p.id === id);
    if (!player) return null;
    const stats = getPlayerStats(id);
    return { player, stats };
  }).filter(Boolean) as Array<{ player: Player; stats: ReturnType<typeof getPlayerStats> }>;

  // Prepare comparison data
  const comparisonData = selectedPlayersData.map(({ player, stats }) => ({
    id: player.id,
    name: player.name,
    teamName: player.teamName,
    totalPoints: player.totalPoints,
    averageScore: stats?.averageScore || 0,
    highestWeek: stats?.highestWeek || 0,
    lowestWeek: stats?.lowestWeek || 0,
    consistency: stats?.consistency || 0,
    weeklyScores: stats?.weeklyScores || [],
  }));

  // Prepare weekly comparison chart data
  const weeklyChartData = [];
  for (let week = 1; week <= totalWeeks; week++) {
    const weekEntry: any = { week: `GW ${week}` };
    comparisonData.forEach((data, index) => {
      weekEntry[`player${index + 1}`] = data.weeklyScores[week - 1] || 0;
    });
    weeklyChartData.push(weekEntry);
  }

  // Calculate trend analysis
  const trendAnalysis = comparisonData.map((data) => {
    const scores = data.weeklyScores;
    if (scores.length < 4) return { ...data, trend: 'insufficient', trendValue: 0 };
    
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const trendValue = secondAvg - firstAvg;
    const trend = trendValue > 2 ? 'improving' : trendValue < -2 ? 'declining' : 'stable';
    
    return { ...data, trend, trendValue };
  });

  // Performance prediction
  const predictions = comparisonData.map((data) => {
    const scores = data.weeklyScores;
    if (scores.length < 3) return { ...data, predictedNext: data.averageScore };
    
    // Use last 3 weeks weighted average
    const recent = scores.slice(-3);
    const weights = [0.2, 0.3, 0.5]; // More weight to recent weeks
    const weightedAvg = recent.reduce((sum, score, i) => sum + score * weights[i], 0);
    
    return { ...data, predictedNext: Math.round(weightedAvg) };
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">{t('compare.title')}</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('compare.subtitle')}
        </p>
      </div>

      {/* Player Selection */}
      <div className="card">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t('compare.selectPlayers')}</h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
          {t('compare.selectUpTo')} ({selectedPlayers.length}/3)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {players.map((player) => {
            const isSelected = selectedPlayers.includes(player.id);
            return (
              <button
                key={player.id}
                onClick={() => handlePlayerSelect(player.id)}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-right ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 text-xs sm:text-sm ${
                    isSelected ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {isSelected && '✓'}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <PlayerAvatar player={player} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base sm:text-lg truncate">{translatePlayerName(player.name)}</div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        {player.teamName ? translateTeamName(player.teamName) : ''}
                      </div>
                      <div className="text-base sm:text-lg font-bold text-purple-600 mt-1">
                        {player.totalPoints} {t('home.points')}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Results */}
      {selectedPlayersData.length > 0 && (
        <>
          {/* Stats Comparison Table */}
          <div className="card overflow-hidden p-0 sm:p-4 md:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-4 sm:px-0 pt-4 sm:pt-0">{t('compare.statsComparison')}</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="px-4 py-4 text-end">{t('compare.stat')}</th>
                    {comparisonData.map((data, index) => {
                      const player = players.find(p => p.id === data.id);
                      return (
                        <th key={data.id} className="px-4 py-4 text-center">
                          <div className="flex flex-col items-center gap-2">
                            {player && <PlayerAvatar player={player} size="md" />}
                            <div className="font-semibold">{translatePlayerName(data.name)}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {data.teamName ? translateTeamName(data.teamName) : ''}
                            </div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-row">
                    <td className="px-4 py-4 font-semibold">{t('compare.totalPoints')}</td>
                    {comparisonData.map((data) => (
                      <td key={data.id} className="px-4 py-4 text-center">
                        <span className="text-2xl font-bold text-purple-600">{data.totalPoints}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="table-row">
                    <td className="px-4 py-4 font-semibold">{t('compare.averageScore')}</td>
                    {comparisonData.map((data) => (
                      <td key={data.id} className="px-4 py-4 text-center">
                        <span className="text-xl font-bold">{data.averageScore.toFixed(1)}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="table-row">
                    <td className="px-4 py-4 font-semibold">{t('compare.highestWeek')}</td>
                    {comparisonData.map((data) => (
                      <td key={data.id} className="px-4 py-4 text-center">
                        <span className="text-xl font-bold text-green-500">{data.highestWeek}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="table-row">
                    <td className="px-4 py-4 font-semibold">{t('compare.lowestWeek')}</td>
                    {comparisonData.map((data) => (
                      <td key={data.id} className="px-4 py-4 text-center">
                        <span className="text-xl font-bold text-red-500">{data.lowestWeek}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="table-row">
                    <td className="px-4 py-4 font-semibold">{t('compare.consistency')}</td>
                    {comparisonData.map((data) => (
                      <td key={data.id} className="px-4 py-4 text-center">
                        <span className="text-lg font-semibold">
                          {data.consistency.toFixed(1)}
                          <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">
                            ({data.consistency < 10 ? t('compare.veryConsistent') : data.consistency < 15 ? t('compare.consistent') : t('compare.inconsistent')})
                          </span>
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Weekly Performance Chart */}
          <div className="card">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t('compare.weeklyPerformance')}</h2>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} minWidth={600}>
              <LineChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                {comparisonData.map((data, index) => (
                  <Line
                    key={data.id}
                    type="monotone"
                    dataKey={`player${index + 1}`}
                    name={translatePlayerName(data.name)}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="card">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t('compare.trendAnalysis')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {trendAnalysis.map((data) => (
                <div
                  key={data.id}
                  className={`p-4 rounded-lg border-2 ${
                    data.trend === 'improving'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : data.trend === 'declining'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <div className="font-semibold text-lg mb-2">
                    {translatePlayerName(data.name)}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {data.trend === 'improving' && (
                      <>
                        <span className="text-2xl">📈</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {t('compare.improving')}
                        </span>
                      </>
                    )}
                    {data.trend === 'declining' && (
                      <>
                        <span className="text-2xl">📉</span>
                        <span className="font-bold text-red-600 dark:text-red-400">
                          {t('compare.declining')}
                        </span>
                      </>
                    )}
                    {data.trend === 'stable' && (
                      <>
                        <span className="text-2xl">➡️</span>
                        <span className="font-bold text-gray-600 dark:text-gray-400">
                          {t('compare.stable')}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('compare.trendChange')}: {data.trendValue > 0 ? '+' : ''}
                    {data.trendValue.toFixed(1)} {t('compare.points')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Prediction */}
          <div className="card">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t('compare.performancePrediction')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {predictions.map((data) => (
                <div
                  key={data.id}
                  className="p-4 rounded-lg border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20"
                >
                  <div className="font-semibold text-lg mb-2">
                    {translatePlayerName(data.name)}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🔮</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t('compare.predictedNextGW')}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">
                    {data.predictedNext} {t('home.points')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {t('compare.basedOnRecent')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side by Side Bar Chart */}
          <div className="card">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t('compare.totalPointsComparison')}</h2>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} minWidth={400}>
              <BarChart data={comparisonData.map(d => ({ name: translatePlayerName(d.name), points: d.totalPoints }))}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="points" fill="#9333EA" radius={[8, 8, 0, 0]}>
                  {comparisonData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {selectedPlayersData.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">⚖️</div>
          <h3 className="text-2xl font-bold mb-2">{t('compare.noPlayersSelected')}</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('compare.selectPlayersToCompare')}
          </p>
        </div>
      )}
    </div>
  );
}

