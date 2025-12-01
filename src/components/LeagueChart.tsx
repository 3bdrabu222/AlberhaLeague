'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Player } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface LeagueChartProps {
  players: Player[];
}

const LeagueChart: React.FC<LeagueChartProps> = ({ players }) => {
  const { translatePlayerName } = useLanguage();
  
  const data = players.map((player) => ({
    name: translatePlayerName(player.name).split(' ')[0], // First name only for better display
    points: player.totalPoints,
    fullName: translatePlayerName(player.name), // Full name for tooltip
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
        <YAxis />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
          }}
        />
        <Bar dataKey="points" fill="#E3B341" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LeagueChart;
