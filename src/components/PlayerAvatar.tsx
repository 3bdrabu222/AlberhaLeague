'use client';

import { useState } from 'react';
import { Player } from '@/types';

interface PlayerAvatarProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showRank?: boolean;
  rank?: number;
  className?: string;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ 
  player, 
  size = 'md', 
  showRank = false,
  rank,
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);
  const [triedPng, setTriedPng] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 sm:w-10 sm:h-10',
    md: 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-xl',
  };

  const imagePath = triedPng 
    ? `/players/player-${player.id}.png`
    : `/players/player-${player.id}.jpg`;

  const handleImageError = () => {
    if (!triedPng) {
      setTriedPng(true);
    } else {
      setImageError(true);
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Player Image */}
      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        {!imageError ? (
          <img
            src={imagePath}
            alt={player.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold ${textSizes[size]}`}>
            {player.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      {/* Rank Badge */}
      {showRank && rank !== undefined && (
        <div className={`absolute -bottom-1 -right-1 rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-gray-800 ${
          rank === 1 ? 'bg-yellow-400 text-yellow-900' :
          rank === 2 ? 'bg-gray-300 text-gray-700' :
          rank === 3 ? 'bg-orange-400 text-orange-900' :
          'bg-purple-600 text-white'
        } ${size === 'sm' ? 'w-5 h-5 text-[10px] sm:w-6 sm:h-6 sm:text-xs' : size === 'md' ? 'w-5 h-5 text-[10px] sm:w-6 sm:h-6 sm:text-xs md:w-7 md:h-7 md:text-sm' : 'w-6 h-6 text-xs sm:w-7 sm:h-7 sm:text-sm md:w-8 md:h-8 md:text-base'}`}>
          {rank}
        </div>
      )}
    </div>
  );
};

export default PlayerAvatar;

