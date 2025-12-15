'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface PlayerChartProps {
  weeklyScores: number[];
  playerName: string;
}

const PlayerChart: React.FC<PlayerChartProps> = ({ weeklyScores, playerName }) => {
  const { t } = useLanguage();
  
  const data = weeklyScores.map((score, index) => ({
    week: `${t('player.week')} ${index + 1}`,
    points: score,
  }));

  const avgScore = weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
          }}
          formatter={(value: number) => [`${value} ${t('home.points')}`, '']}
        />
        <Bar dataKey="points" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.points >= avgScore ? '#E3B341' : '#94A3B8'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PlayerChart;
