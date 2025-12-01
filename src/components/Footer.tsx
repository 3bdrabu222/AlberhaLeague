'use client';

import { getTotalWeeks, getPlayers } from '@/utils/dataUtils';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const totalWeeks = getTotalWeeks();
  const totalPlayers = getPlayers().length;
  
  return (
    <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              {t('footer.about')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="/" className="hover:text-purple-600 transition-colors">{t('footer.home')}</a>
              </li>
              <li>
                <a href="/rankings" className="hover:text-purple-600 transition-colors">{t('footer.rankings')}</a>
              </li>
              <li>
                <a href="/weekly" className="hover:text-purple-600 transition-colors">{t('footer.weekly')}</a>
              </li>
              <li>
                <a href="/stats" className="hover:text-purple-600 transition-colors">{t('footer.stats')}</a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              {t('footer.seasonInfo')}
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>{t('footer.currentSeason')}</li>
              <li>{t('footer.totalWeeks')}: {totalWeeks}</li>
              <li>{t('footer.activePlayers')}: {totalPlayers}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} {t('site.fullName')}. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
