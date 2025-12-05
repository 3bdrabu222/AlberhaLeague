'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface ChipUsage {
  chipName: string;
  firstHalfWeek?: number;
  secondHalfWeek?: number;
}

interface ChipUsageTrackerProps {
  weeklyDetails: Array<{
    week: number;
    property?: string;
  }>;
}

const SEASON_SPLIT = 19; // Gameweek 19 is the split point

const ChipUsageTracker: React.FC<ChipUsageTrackerProps> = ({ weeklyDetails }) => {
  const { t, translateChipName } = useLanguage();

  // Track chip usage by half
  const chipUsage: { [key: string]: ChipUsage } = {
    'Wildcard': { chipName: 'Wildcard' },
    'Bench Boost': { chipName: 'Bench Boost' },
    'Free Hit': { chipName: 'Free Hit' },
    'Triple Captain': { chipName: 'Triple Captain' },
  };

  // Populate chip usage from weekly details
  weeklyDetails.forEach(detail => {
    if (detail.property && detail.property !== 'None') {
      const chip = chipUsage[detail.property];
      if (chip) {
        if (detail.week <= SEASON_SPLIT) {
          // First half (GW 1-19)
          if (!chip.firstHalfWeek) {
            chip.firstHalfWeek = detail.week;
          }
        } else {
          // Second half (GW 20+)
          if (!chip.secondHalfWeek) {
            chip.secondHalfWeek = detail.week;
          }
        }
      }
    }
  });

  const getChipIcon = (chipName: string) => {
    switch (chipName) {
      case 'Wildcard': return '🃏';
      case 'Bench Boost': return '💪';
      case 'Free Hit': return '🎯';
      case 'Triple Captain': return '👑';
      default: return '🎮';
    }
  };

  const getChipColor = (chipName: string) => {
    switch (chipName) {
      case 'Wildcard': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'Bench Boost': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'Free Hit': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'Triple Captain': return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{t('player.chipUsage')}</h2>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
        {t('player.chipRuleExplanation')}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {Object.values(chipUsage).map((chip) => (
          <div 
            key={chip.chipName}
            className={`border-2 rounded-lg p-3 sm:p-4 ${getChipColor(chip.chipName)}`}
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl shrink-0">{getChipIcon(chip.chipName)}</span>
              <div className="min-w-0">
                <h3 className="font-bold text-base sm:text-lg truncate">{translateChipName(chip.chipName)}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {t('player.maxTwoUses')}
                </p>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {/* First Half */}
              <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {t('player.firstHalf')} (GW 1-19)
                    </div>
                    {chip.firstHalfWeek ? (
                      <div className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">
                        ✅ {t('player.usedInGW')} {chip.firstHalfWeek}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        ⭕ {t('player.notUsed')}
                      </div>
                    )}
                  </div>
                  {chip.firstHalfWeek && (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">
                      ✓
                    </div>
                  )}
                </div>
              </div>

              {/* Second Half */}
              <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {t('player.secondHalf')} (GW 20+)
                    </div>
                    {chip.secondHalfWeek ? (
                      <div className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">
                        ✅ {t('player.usedInGW')} {chip.secondHalfWeek}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        ⭕ {t('player.notUsed')}
                      </div>
                    )}
                  </div>
                  {chip.secondHalfWeek && (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">
                      ✓
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Usage Summary */}
            <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-600 dark:text-gray-400">
                  {t('player.totalUsed')}:
                </span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {(chip.firstHalfWeek ? 1 : 0) + (chip.secondHalfWeek ? 1 : 0)} / 2
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChipUsageTracker;
