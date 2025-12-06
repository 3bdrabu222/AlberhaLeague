'use client';

import { getPlayers, getTotalWeeks, getPlayerStats } from '@/utils/dataUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface PerformancePredictionProps {
  maxPlayers?: number;
}

const PerformancePrediction: React.FC<PerformancePredictionProps> = ({ maxPlayers = 10 }) => {
  const { t, translatePlayerName } = useLanguage();
  const players = getPlayers().slice(0, maxPlayers);

  // Calculate predictions for each player
  const predictions = players.map(player => {
    const stats = getPlayerStats(player.id);
    const weeklyScores = stats?.weeklyScores || [];
    const currentAvg = stats?.averageScore || 0;
    
    if (weeklyScores.length < 3) {
      return {
        player,
        predictedNext: currentAvg,
        confidence: 'low',
        method: 'average',
        currentAvg,
        trend: 'stable' as const,
      };
    }

    // Method 1: Weighted average of last 3 weeks
    const recent = weeklyScores.slice(-3);
    const weights = [0.2, 0.3, 0.5];
    const weightedAvg = recent.reduce((sum, score, i) => sum + score * weights[i], 0);

    // Method 2: Linear trend (if enough data)
    let trendPrediction = weightedAvg;
    if (weeklyScores.length >= 5) {
      const last5 = weeklyScores.slice(-5);
      const trend = (last5[last5.length - 1] - last5[0]) / (last5.length - 1);
      trendPrediction = last5[last5.length - 1] + trend;
    }

    // Combine both methods
    const predictedNext = Math.round((weightedAvg * 0.7 + trendPrediction * 0.3));
    const confidence = weeklyScores.length >= 10 ? 'high' : weeklyScores.length >= 5 ? 'medium' : 'low';

    return {
      player,
      predictedNext,
      confidence,
      method: 'combined',
      currentAvg,
      trend: predictedNext > currentAvg ? 'up' : 'down',
    };
  });

  // Sort by predicted score
  predictions.sort((a, b) => b.predictedNext - a.predictedNext);

  const COLORS = ['#9333EA', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">{t('stats.performancePrediction')}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {t('stats.predictionDescription')}
      </p>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {predictions.map((pred) => (
          <Link
            key={pred.player.id}
            href={`/player/${pred.player.id}`}
            className="p-4 rounded-lg border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-lg">
                {translatePlayerName(pred.player.name)}
              </div>
              <div className="text-2xl">🔮</div>
            </div>
            <div className="mb-2">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {t('stats.predictedNextGW')}
              </div>
              <div className="text-3xl font-bold text-purple-600">
                {pred.predictedNext} {t('home.points')}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="text-gray-500 dark:text-gray-400">
                {t('stats.currentAvg')}: {(pred.currentAvg ?? 0).toFixed(1)}
              </div>
              <div className={`font-semibold ${
                pred.trend === 'up' ? 'text-green-600' : pred.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {pred.trend === 'up' ? '↑' : pred.trend === 'down' ? '↓' : '→'} {Math.abs(pred.predictedNext - (pred.currentAvg ?? 0)).toFixed(1)}
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('stats.confidence')}: 
                <span className={`font-semibold ml-1 ${
                  pred.confidence === 'high' ? 'text-green-600' :
                  pred.confidence === 'medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {pred.confidence === 'high' && t('stats.high')}
                  {pred.confidence === 'medium' && t('stats.medium')}
                  {pred.confidence === 'low' && t('stats.low')}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Prediction Chart */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">{t('stats.predictionChart')}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={predictions.map(p => ({ 
            name: translatePlayerName(p.player.name), 
            predicted: p.predictedNext,
            average: p.currentAvg ?? 0
          }))}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="predicted" name={t('stats.predicted')} fill="#9333EA" radius={[8, 8, 0, 0]}>
              {predictions.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
            <Bar dataKey="average" name={t('stats.currentAvg')} fill="#9CA3AF" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformancePrediction;
