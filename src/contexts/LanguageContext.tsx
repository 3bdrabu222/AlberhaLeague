'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translatePlayerName: (name: string) => string;
  translateTeamName: (teamName: string) => string;
  translateChipName: (chipName: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>('ar'); // Arabic as default
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Update HTML dir attribute
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    if (mounted) {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Helper function to translate player names
  const translatePlayerName = (name: string): string => {
    const key = `player.name.${name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`;
    return t(key) !== key ? t(key) : name;
  };

  // Helper function to translate team names
  const translateTeamName = (teamName: string): string => {
    const key = `team.name.${teamName.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`;
    return t(key) !== key ? t(key) : teamName;
  };

  // Helper function to translate chip names
  const translateChipName = (chipName: string): string => {
    const chipMap: { [key: string]: string } = {
      'Wildcard': language === 'ar' ? 'وايلد كارد' : 'Wildcard',
      'Bench Boost': language === 'ar' ? 'بنش بوست' : 'Bench Boost',
      'Free Hit': language === 'ar' ? 'فري هت' : 'Free Hit',
      'Triple Captain': language === 'ar' ? 'تريبل كابتن' : 'Triple Captain',
      'None': language === 'ar' ? 'لا شيء' : 'None',
    };
    return chipMap[chipName] || chipName;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translatePlayerName, translateTeamName, translateChipName }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translations
const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Header
    'nav.home': 'الرئيسية',
    'nav.rankings': 'الترتيب',
    'nav.weekly': 'النتائج الأسبوعية',
    'nav.stats': 'الإحصائيات',
    'nav.compare': 'المقارنة',
    
    // Home Page
    'home.fpl': 'الدوري الإنجليزي الممتاز',
    'home.league': 'The Final Race',
    'home.season': 'موسم 2026/27',
    'home.currentGW': 'الجولة الحالية',
    'home.managers': 'المدراء',
    'home.gwOverview': '⚽ نظرة عامة على الجولة',
    'home.highestScore': 'أعلى نتيجة',
    'home.avgScore': 'المعدل',
    'home.thisGW': 'هذه الجولة',
    'home.overallLeader': 'المتصدر العام',
    'home.totalPoints': 'مجموع النقاط',
    'home.gwCompleted': 'جولات منتهية',
    'home.chipsUsage': '🎮 استخدام الرقائق هذا الموسم',
    'home.chipSeasonRule': 'كل رقاقة يمكن استخدامها مرتين: مرة في النصف الأول (ج1-19) ومرة في النصف الثاني (ج20+)',
    'home.wildcard': 'وايلد كارد',
    'home.benchBoost': 'بنش بوست',
    'home.freeHit': 'فري هت',
    'home.tripleCaptain': 'تريبل كابتن',
    'home.timesUsed': 'مرة استخدام',
    'home.firstHalf': 'النصف الأول',
    'home.secondHalf': 'النصف الثاني',
    'home.leagueStandings': '🏆 ترتيب الدوري',
    'home.viewFull': 'عرض الترتيب الكامل',
    'home.leagueTable': 'جدول الدوري',
    'home.viewStandings': 'عرض الترتيب الكامل',
    'home.gwHistory': 'سجل الجولات',
    'home.weekByWeek': 'النتائج أسبوعياً',
    'home.statistics': 'الإحصائيات',
    'home.analytics': 'التحليلات والاتجاهات',
    'home.leaderTitle': 'متصدر الدوري',
    'home.points': 'نقطة',
    'home.comparePlayers': 'قارن بين اللاعبين',
    
    // Rankings Page
    'rankings.title': '🏆 جدول الدوري',
    'rankings.subtitle': 'الترتيب العام - موسم 2026/27',
    'rankings.search': 'البحث عن المدراء...',
    'rankings.rank': 'المركز',
    'rankings.manager': 'المدير',
    'rankings.teamName': 'اسم الفريق',
    'rankings.overallPoints': 'النقاط الإجمالية',
    'rankings.actions': 'الإجراءات',
    'rankings.viewTeam': 'عرض الفريق',
    'rankings.noResults': 'لا توجد نتائج لـ',
    'rankings.quickStats': '📊 إحصائيات سريعة',
    'rankings.totalPlayers': 'مجموع اللاعبين',
    'rankings.highestScore': 'أعلى نتيجة',
    'rankings.avgScore': 'المعدل',
    
    // Weekly Page
    'weekly.title': '📅 سجل الجولات',
    'weekly.subtitle': 'عرض أداء المدراء حسب الجولة',
    'weekly.selectGW': 'اختر الجولة',
    'weekly.results': '⚽ نتائج الجولة',
    'weekly.managers': 'مدراء',
    'weekly.chipUsed': 'الرقاقة المستخدمة',
    'weekly.gwPoints': 'نقاط الجولة',
    'weekly.transferCost': 'تكلفة الانتقالات',
    'weekly.gw': 'ج',
    'weekly.weekStats': 'إحصائيات الجولة',
    'weekly.lowestScore': 'أقل نتيجة',
    'weekly.totalPlayers': 'مجموع اللاعبين',
    'weekly.cumulativeTable': 'جدول المجموع المتراكم',
    'weekly.cumulativeScore': 'المجموع المتراكم',
    'weekly.fromGWToGW': 'من GW1 إلى GW',
    
    // Player Profile
    'player.profile': 'ملف المدير',
    'player.totalPoints': 'مجموع النقاط',
    'player.bestWeek': 'أفضل أسبوع',
    'player.avgPoints': 'معدل النقاط',
    'player.worstWeek': 'أسوأ أسبوع',
    'player.chipsUsed': '🎮 الرقائق المستخدمة هذا الموسم',
    'player.noChips': 'لم يتم استخدام رقائق بعد',
    'player.week': 'الأسبوع',
    'player.weeklyPerf': 'الأداء الأسبوعي',
    'player.gwHistory': '📊 سجل الجولات',
    'player.gameweek': 'الجولة',
    'player.vsAvg': 'مقابل المعدل',
    'player.none': 'لا شيء',
    'player.backToRankings': 'العودة للترتيب',
    'player.viewWeekly': 'عرض النتائج الأسبوعية',
    'player.chipUsage': '🎮 متتبع استخدام الرقائق',
    'player.chipRuleExplanation': 'يمكن استخدام كل رقاقة مرتين في الموسم: مرة في النصف الأول (ج1-19) ومرة في النصف الثاني (ج20+)',
    'player.maxTwoUses': 'الحد الأقصى: استخدامان في الموسم',
    'player.firstHalf': 'النصف الأول',
    'player.secondHalf': 'النصف الثاني',
    'player.usedInGW': 'مستخدمة في الجولة',
    'player.notUsed': 'غير مستخدمة',
    'player.totalUsed': 'المجموع المستخدم',
    'player.gapFromLeader': 'الفارق عن المتصدر',
    'player.leader': 'المتصدر',
    
    // Stats Page
    'stats.title': '📊 إحصائيات الدوري',
    'stats.subtitle': 'تحليل شامل للأداء',
    'stats.topPlayers': 'أفضل اللاعبين',
    'stats.weeklyTrends': 'الاتجاهات الأسبوعية - أفضل 5',
    'stats.detailedStats': 'إحصائيات تفصيلية للاعبين',
    'stats.player': 'اللاعب',
    'stats.total': 'مجموع النقاط',
    'stats.avg': 'المعدل',
    'stats.avgWeek': 'المعدل/أسبوع',
    'stats.best': 'الأفضل',
    'stats.worst': 'الأسوأ',
    'stats.performance': 'الأداء',
    'stats.excellent': 'ممتاز',
    'stats.good': 'جيد',
    'stats.averagePerf': 'متوسط',
    'stats.belowAvg': 'أقل من المتوسط',
    'stats.highestWeek': 'أعلى نتيجة أسبوعية',
    'stats.mostWins': 'أكثر انتصارات أسبوعية',
    'stats.mostConsistent': 'الأكثر استقراراً',
    'stats.avgWeekly': 'معدل النتيجة الأسبوعية',
    'stats.acrossAll': 'عبر جميع اللاعبين',
    'stats.top10': 'أفضل 10 لاعبين',
    'stats.totalPlayersLabel': '📊 مجموع اللاعبين',
    'stats.totalPointsScored': '🏆 مجموع النقاط المسجلة',
    'stats.pointSpread': '📈 فارق النقاط',
    'stats.performanceHeatMap': '🗺️ خريطة الأداء الحرارية',
    'stats.heatMapDescription': 'عرض أداء جميع اللاعبين عبر الجولات - الألوان الأغمق تعني أداء أفضل',
    'stats.legend': 'المفتاح',
    'stats.low': 'منخفض',
    'stats.medium': 'متوسط',
    'stats.high': 'عالي',
    'stats.trendAnalysis': '📈 تحليل الاتجاهات',
    'stats.improving': 'يتحسن',
    'stats.declining': 'يتدهور',
    'stats.stable': 'مستقر',
    'stats.firstHalf': 'النصف الأول',
    'stats.secondHalf': 'النصف الثاني',
    'stats.change': 'التغيير',
    'stats.insufficientData': 'بيانات غير كافية',
    'stats.trendChart': 'رسم بياني للاتجاهات',
    'stats.performancePrediction': '🔮 توقعات الأداء',
    'stats.predictionDescription': 'توقع النقاط المتوقعة للجولة القادمة بناءً على الأداء الأخير',
    'stats.predictedNextGW': 'الجولة القادمة المتوقعة',
    'stats.currentAvg': 'المعدل الحالي',
    'stats.confidence': 'مستوى الثقة',
    'stats.predictionChart': 'رسم بياني للتوقعات',
    'stats.predicted': 'متوقع',
    
    // Admin Page
    'admin.title': '⚙️ لوحة إدارة FPL',
    'admin.subtitle': 'إدارة بيانات الجولات، الرقائق، وتكاليف الانتقالات',
    'admin.addGW': '➕ إضافة جولة جديدة',
    'admin.updateGW': '✏️ تحديث جولة موجودة',
    'admin.deleteGW': '🗑️ حذف جولة',
    'admin.addingGW': '📅 أنت تضيف الجولة',
    'admin.updatingGW': '📝 أنت تحدث الجولة',
    'admin.deletingGW': '⚠️ أنت على وشك حذف الجولة',
    'admin.cannotUndo': 'لا يمكن التراجع عن هذا الإجراء!',
    'admin.selectGWUpdate': 'اختر الجولة للتحديث:',
    'admin.selectGWDelete': 'اختر الجولة للحذف:',
    'admin.deleteWarning': '⚠️ حذف الجولة',
    'admin.deleteConfirm': 'تحذير: سيؤدي هذا إلى حذف الجولة بشكل دائم',
    'admin.willRemove': 'إزالة جميع النقاط من هذه الجولة',
    'admin.willSubtract': 'طرح هذه النقاط من مجاميع اللاعبين',
    'admin.willUpdate': 'تحديث جميع الترتيبات',
    'admin.cannotBeUndone': 'لا يمكن التراجع عن هذا الإجراء',
    'admin.understand': '⚠️ أفهم، تابع الحذف',
    'admin.areYouSure': 'هل أنت متأكد تماماً؟',
    'admin.yesDelete': '🗑️ نعم، احذف الجولة',
    'admin.cancel': '❌ إلغاء',
    'admin.deleting': '⏳ جاري الحذف...',
    'admin.points': 'النقاط',
    'admin.chipUsed': 'الرقاقة المستخدمة',
    'admin.transferCost': 'تكلفة الانتقالات (-4 لكل انتقال إضافي)',
    'admin.enterPoints': 'أدخل النقاط',
    'admin.currentTotal': 'المجموع الحالي',
    'admin.pts': 'نقطة',
    'admin.submit': 'إرسال',
    'admin.submitting': 'جاري الإرسال...',
    
    // Footer
    'footer.about': 'The Final Race',
    'footer.description': 'دوري كرة قدم ممتاز تنافسي يتتبع الأداء الأسبوعي والإنجازات الموسمية.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.home': 'الرئيسية',
    'footer.rankings': 'الترتيب',
    'footer.weekly': 'النتائج الأسبوعية',
    'footer.stats': 'الإحصائيات',
    'footer.seasonInfo': 'معلومات الموسم',
    'footer.currentSeason': 'الموسم الحالي: 2026/27',
    'footer.totalWeeks': 'مجموع الأسابيع',
    'footer.activePlayers': 'اللاعبون النشطون',
    'footer.rights': 'جميع الحقوق محفوظة',
    
    // Compare Page
    'compare.title': '⚖️ مقارنة اللاعبين',
    'compare.subtitle': 'قارن أداء 2-3 لاعبين جنباً إلى جنب',
    'compare.selectPlayers': 'اختر اللاعبين للمقارنة',
    'compare.selectUpTo': 'يمكنك اختيار حتى 3 لاعبين',
    'compare.statsComparison': 'مقارنة الإحصائيات',
    'compare.stat': 'الإحصائية',
    'compare.totalPoints': 'مجموع النقاط',
    'compare.averageScore': 'المعدل',
    'compare.highestWeek': 'أعلى أسبوع',
    'compare.lowestWeek': 'أقل أسبوع',
    'compare.consistency': 'الاستقرار',
    'compare.veryConsistent': 'مستقر جداً',
    'compare.consistent': 'مستقر',
    'compare.inconsistent': 'غير مستقر',
    'compare.weeklyPerformance': 'الأداء الأسبوعي',
    'compare.trendAnalysis': 'تحليل الاتجاهات',
    'compare.improving': 'يتحسن',
    'compare.declining': 'يتدهور',
    'compare.stable': 'مستقر',
    'compare.trendChange': 'التغيير في الاتجاه',
    'compare.points': 'نقطة',
    'compare.performancePrediction': 'توقعات الأداء',
    'compare.predictedNextGW': 'الجولة القادمة المتوقعة',
    'compare.basedOnRecent': 'بناءً على الأداء الأخير',
    'compare.totalPointsComparison': 'مقارنة مجموع النقاط',
    'compare.noPlayersSelected': 'لم يتم اختيار لاعبين',
    'compare.selectPlayersToCompare': 'اختر لاعبين من القائمة أعلاه للمقارنة',
    'compare.pointsDifference': 'فرق النقاط',
    'compare.pointsDifferenceFrom': 'فرق النقاط من',
    'compare.pointsDifferenceNote': 'الفرق مقارنة باللاعب الأول المختار',
    'compare.percentage': 'النسبة المئوية',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.close': 'إغلاق',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.search': 'بحث',
    'common.viewProfile': 'عرض الملف',
    
    // Player Names
    'player.name.ahmed-mohammed': 'أحمد محمد',
    'player.name.ayman-mohammed': 'أيمن محمد',
    'player.name.osama-mohammed': 'أسامة محمد',
    'player.name.ahmed-salah': 'أحمد صلاح',
    'player.name.saad-saleh': 'سعد صالح',
    'player.name.abdurabu-saleh': 'عبدربه صالح',
    'player.name.ahmed-mosab': 'احمد مصعب',
    'player.name.hakim-ebrahim': 'حكيم ابراهيم',
    
    // Team Names
    'team.name.سنقر-لا-تسرق': 'سنقر لا تسرق',
    'team.name.secretdoor': 'SecretDoor',
    'team.name.1st-of-his-name': '1st of His Name',
    'team.name.the-dark-passenger': 'ذا دارك باسنجر',
    'team.name.aa12': 'AA12',
    'team.name.the-red-team': 'The Red Team',
    'team.name.leoahmed': 'LeoAhmed',
    'team.name.ibb-city': 'IBB CITY',
    
    // Site Name
    'site.name': 'The Final Race',
    'site.fullName': 'The Final Race',
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.rankings': 'Rankings',
    'nav.weekly': 'Weekly Results',
    'nav.stats': 'Stats',
    'nav.compare': 'Compare',
    
    // Home Page
    'home.fpl': 'FANTASY PREMIER LEAGUE',
    'home.league': 'The Final Race',
    'home.season': 'Season 2026/27',
    'home.currentGW': 'Current Gameweek',
    'home.managers': 'Managers',
    'home.gwOverview': '⚽ Gameweek Overview',
    'home.highestScore': 'Highest Score',
    'home.avgScore': 'Average',
    'home.thisGW': 'This GW',
    'home.overallLeader': 'Overall Leader',
    'home.totalPoints': 'Total Points',
    'home.gwCompleted': 'Gameweeks Completed',
    'home.chipsUsage': '🎮 Chips Usage This Season',
    'home.chipSeasonRule': 'Each chip can be used twice: once in first half (GW 1-19) and once in second half (GW 20+)',
    'home.wildcard': 'Wildcard',
    'home.benchBoost': 'Bench Boost',
    'home.freeHit': 'Free Hit',
    'home.tripleCaptain': 'Triple Captain',
    'home.timesUsed': 'times used',
    'home.firstHalf': 'First Half',
    'home.secondHalf': 'Second Half',
    'home.leagueStandings': '🏆 League Standings',
    'home.viewFull': 'View Full Table',
    'home.leagueTable': 'League Table',
    'home.viewStandings': 'View complete standings',
    'home.gwHistory': 'Gameweek History',
    'home.weekByWeek': 'Week-by-week results',
    'home.statistics': 'Statistics',
    'home.analytics': 'League analytics & trends',
    'home.leaderTitle': 'League Leader',
    'home.points': 'points',
    'home.comparePlayers': 'Compare players',
    
    // Rankings Page
    'rankings.title': '🏆 League Table',
    'rankings.subtitle': 'Overall standings - Season 2026/27',
    'rankings.search': 'Search managers...',
    'rankings.rank': 'Rank',
    'rankings.manager': 'Manager',
    'rankings.teamName': 'Team Name',
    'rankings.overallPoints': 'Overall Points',
    'rankings.actions': 'Actions',
    'rankings.viewTeam': 'View Team',
    'rankings.noResults': 'No managers found matching',
    'rankings.quickStats': '📊 Quick Stats',
    'rankings.totalPlayers': 'Total Players',
    'rankings.highestScore': 'Highest Score',
    'rankings.avgScore': 'Average Score',
    
    // Weekly Page
    'weekly.title': '📅 Gameweek History',
    'weekly.subtitle': 'View manager performance by gameweek',
    'weekly.selectGW': 'Select Gameweek',
    'weekly.results': '⚽ Gameweek Results',
    'weekly.managers': 'managers',
    'weekly.chipUsed': 'Chip Used',
    'weekly.gwPoints': 'GW Points',
    'weekly.transferCost': 'Transfer Cost',
    'weekly.gw': 'GW',
    'weekly.weekStats': 'Week Statistics',
    'weekly.lowestScore': 'Lowest Score',
    'weekly.totalPlayers': 'Total Players',
    'weekly.cumulativeTable': 'Cumulative Total Table',
    'weekly.cumulativeScore': 'Cumulative Score',
    'weekly.fromGWToGW': 'From GW1 to GW',
    
    // Player Profile
    'player.profile': 'Manager Profile',
    'player.totalPoints': 'Total Points',
    'player.bestWeek': 'Best Week',
    'player.avgPoints': 'Avg Points',
    'player.worstWeek': 'Worst Week',
    'player.chipsUsed': '🎮 Chips Used This Season',
    'player.noChips': 'No chips used yet',
    'player.week': 'Week',
    'player.weeklyPerf': 'Weekly Performance',
    'player.gwHistory': '📊 Gameweek History',
    'player.gameweek': 'Gameweek',
    'player.vsAvg': 'vs Average',
    'player.none': 'None',
    'player.backToRankings': 'Back to Rankings',
    'player.viewWeekly': 'View Weekly Results',
    'player.chipUsage': '🎮 Chip Usage Tracker',
    'player.chipRuleExplanation': 'Each chip can be used twice per season: once in the first half (GW 1-19) and once in the second half (GW 20+)',
    'player.maxTwoUses': 'Maximum: 2 uses per season',
    'player.firstHalf': 'First Half',
    'player.secondHalf': 'Second Half',
    'player.usedInGW': 'Used in GW',
    'player.notUsed': 'Not Used',
    'player.totalUsed': 'Total Used',
    'player.gapFromLeader': 'Gap from Leader',
    'player.leader': 'Leader',
    
    // Stats Page
    'stats.title': '📊 League Statistics',
    'stats.subtitle': 'Comprehensive performance analysis',
    'stats.topPlayers': 'Top Players',
    'stats.weeklyTrends': 'Weekly Trends - Top 5',
    'stats.detailedStats': 'Detailed Player Statistics',
    'stats.player': 'Player',
    'stats.total': 'Total Points',
    'stats.avg': 'Average',
    'stats.avgWeek': 'Avg/Week',
    'stats.best': 'Best',
    'stats.worst': 'Worst',
    'stats.performance': 'Performance',
    'stats.excellent': 'Excellent',
    'stats.good': 'Good',
    'stats.averagePerf': 'Average',
    'stats.belowAvg': 'Below Average',
    'stats.highestWeek': 'Highest Scoring Week',
    'stats.mostWins': 'Most Weekly Wins',
    'stats.mostConsistent': 'Most Consistent',
    'stats.avgWeekly': 'Average Weekly Score',
    'stats.acrossAll': 'Across all players',
    'stats.top10': 'Top 10 Players',
    'stats.totalPlayersLabel': '📊 Total Players',
    'stats.totalPointsScored': '🏆 Total Points Scored',
    'stats.pointSpread': '📈 Point Spread',
    'stats.performanceHeatMap': '🗺️ Performance Heat Map',
    'stats.heatMapDescription': 'View all players performance across gameweeks - darker colors mean better performance',
    'stats.legend': 'Legend',
    'stats.low': 'Low',
    'stats.medium': 'Medium',
    'stats.high': 'High',
    'stats.trendAnalysis': '📈 Trend Analysis',
    'stats.improving': 'Improving',
    'stats.declining': 'Declining',
    'stats.stable': 'Stable',
    'stats.firstHalf': 'First Half',
    'stats.secondHalf': 'Second Half',
    'stats.change': 'Change',
    'stats.insufficientData': 'Insufficient Data',
    'stats.trendChart': 'Trend Chart',
    'stats.performancePrediction': '🔮 Performance Prediction',
    'stats.predictionDescription': 'Predict expected points for next gameweek based on recent performance',
    'stats.predictedNextGW': 'Predicted Next GW',
    'stats.currentAvg': 'Current Avg',
    'stats.confidence': 'Confidence',
    'stats.predictionChart': 'Prediction Chart',
    'stats.predicted': 'Predicted',
    
    // Admin Page
    'admin.title': '⚙️ FPL Admin Panel',
    'admin.subtitle': 'Manage gameweek data, chips, and transfer costs',
    'admin.addGW': '➕ Add New Gameweek',
    'admin.updateGW': '✏️ Update Existing Gameweek',
    'admin.deleteGW': '🗑️ Delete Gameweek',
    'admin.addingGW': '📅 You are adding Gameweek',
    'admin.updatingGW': '📝 You are updating Gameweek',
    'admin.deletingGW': '⚠️ You are about to delete Gameweek',
    'admin.cannotUndo': 'This action cannot be undone!',
    'admin.selectGWUpdate': 'Select Gameweek to Update:',
    'admin.selectGWDelete': 'Select Gameweek to Delete:',
    'admin.deleteWarning': '⚠️ Delete Gameweek',
    'admin.deleteConfirm': 'Warning: This will permanently delete Gameweek',
    'admin.willRemove': 'Remove all points from this gameweek',
    'admin.willSubtract': 'Subtract these points from player totals',
    'admin.willUpdate': 'Update all rankings',
    'admin.cannotBeUndone': 'This action CANNOT be undone',
    'admin.understand': '⚠️ I Understand, Proceed to Delete',
    'admin.areYouSure': 'Are you absolutely sure?',
    'admin.yesDelete': '🗑️ Yes, Delete Gameweek',
    'admin.cancel': '❌ Cancel',
    'admin.deleting': '⏳ Deleting...',
    'admin.points': 'Points',
    'admin.chipUsed': 'Chip Used',
    'admin.transferCost': 'Transfer Cost (-4 per extra transfer)',
    'admin.enterPoints': 'Enter points',
    'admin.currentTotal': 'Current Total',
    'admin.pts': 'pts',
    'admin.submit': 'Submit',
    'admin.submitting': 'Submitting...',
    
    // Footer
    'footer.about': 'The Final Race',
    'footer.description': 'A competitive fantasy football league tracking weekly performances and season-long achievements.',
    'footer.quickLinks': 'Quick Links',
    'footer.home': 'Home',
    'footer.rankings': 'Rankings',
    'footer.weekly': 'Weekly Results',
    'footer.stats': 'Statistics',
    'footer.seasonInfo': 'Season Info',
    'footer.currentSeason': 'Current Season: 2026/27',
    'footer.totalWeeks': 'Total Weeks',
    'footer.activePlayers': 'Active Players',
    'footer.rights': 'All rights reserved',
    
    // Compare Page
    'compare.title': '⚖️ Player Comparison',
    'compare.subtitle': 'Compare performance of 2-3 players side by side',
    'compare.selectPlayers': 'Select Players to Compare',
    'compare.selectUpTo': 'You can select up to 3 players',
    'compare.statsComparison': 'Stats Comparison',
    'compare.stat': 'Stat',
    'compare.totalPoints': 'Total Points',
    'compare.averageScore': 'Average Score',
    'compare.highestWeek': 'Highest Week',
    'compare.lowestWeek': 'Lowest Week',
    'compare.consistency': 'Consistency',
    'compare.veryConsistent': 'Very Consistent',
    'compare.consistent': 'Consistent',
    'compare.inconsistent': 'Inconsistent',
    'compare.weeklyPerformance': 'Weekly Performance',
    'compare.trendAnalysis': 'Trend Analysis',
    'compare.improving': 'Improving',
    'compare.declining': 'Declining',
    'compare.stable': 'Stable',
    'compare.trendChange': 'Trend Change',
    'compare.points': 'points',
    'compare.performancePrediction': 'Performance Prediction',
    'compare.predictedNextGW': 'Predicted Next GW',
    'compare.basedOnRecent': 'Based on recent performance',
    'compare.totalPointsComparison': 'Total Points Comparison',
    'compare.noPlayersSelected': 'No Players Selected',
    'compare.selectPlayersToCompare': 'Select players from the list above to compare',
    'compare.pointsDifference': 'Points Difference',
    'compare.pointsDifferenceFrom': 'Points Difference From',
    'compare.pointsDifferenceNote': 'Difference compared to the first selected player',
    'compare.percentage': 'Percentage',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.viewProfile': 'View Profile',
    
    // Player Names (English)
    'player.name.ahmed-mohammed': 'Ahmed Mohammed',
    'player.name.ayman-mohammed': 'Ayman Mohammed',
    'player.name.osama-mohammed': 'Osama Mohammed',
    'player.name.ahmed-salah': 'Ahmed Salah',
    'player.name.saad-saleh': 'Saad Saleh',
    'player.name.abdurabu-saleh': 'Abdurabu Saleh',
    'player.name.ahmed-mosab': 'Ahmed Mosab',
    'player.name.hakim-ebrahim': 'Hakim Ebrahim',
    
    // Team Names (English)
    'team.name.سنقر-لا-تسرق': 'سنقر لا تسرق',
    'team.name.secretdoor': 'SecretDoor',
    'team.name.1st-of-his-name': '1st of His Name',
    'team.name.the-dark-passenger': 'The dark passenger',
    'team.name.aa12': 'AA12',
    'team.name.the-red-team': 'The Red Team',
    'team.name.leoahmed': 'LeoAhmed',
    'team.name.ibb-city': 'IBB CITY',
    
    // Site Name
    'site.name': 'The Final Race',
    'site.fullName': 'The Final Race',
  },
};
