'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Player } from '@/types';
import { getWeekData, getTotalWeeks } from '@/utils/dataUtils';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeeklyTrendsChartProps {
  players: Player[];
}

const COLORS = ['#E3B341', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const WeeklyTrendsChart: React.FC<WeeklyTrendsChartProps> = ({ players }) => {
  const { translatePlayerName, t } = useLanguage();
  
  // Build data structure for all weeks
  const totalWeeks = getTotalWeeks();
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);
  const data = weeks.map((week) => {
    const weekData = getWeekData(week);
    const weekPoint: any = { week: `${t('weekly.gw')}${week}` };
    
    players.forEach((player) => {
      const playerWeek = weekData.find((w) => w.playerId === player.id);
      const translatedName = translatePlayerName(player.name);
      weekPoint[translatedName] = playerWeek?.points || 0;
    });
    
    return weekPoint;
  });

  return (
    <ResponsiveContainer width="100%" height={300} minHeight={250}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="week" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '12px',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '11px' }} />
        {players.map((player, index) => (
          <Line
            key={player.id}
            type="monotone"
            dataKey={translatePlayerName(player.name)}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeeklyTrendsChart;
