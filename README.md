# Fantasy Alberha League ⚽

A modern, responsive fantasy football league website built with Next.js, TypeScript, and Tailwind CSS. Track player rankings, weekly performances, and comprehensive statistics with beautiful visualizations.

## 🌟 Features

### Core Features
- **Home Page**: League overview with top 5 players and quick stats
- **Full Rankings**: Complete player standings with search functionality
- **Weekly Results**: Week-by-week performance tracking (13 weeks)
- **Player Profiles**: Individual player statistics with performance charts
- **Statistics Dashboard**: Comprehensive league analytics with multiple charts
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices

### Technical Features
- **Next.js 14**: Latest App Router with server and client components
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern utility-first styling
- **Recharts**: Interactive and responsive charts
- **JSON Data Source**: Easy-to-update player and weekly data
- **Auto-calculated Stats**: Rankings, averages, and analytics computed automatically

## 📁 Project Structure

```
FantasyAlberhaLeague/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── layout.tsx            # Root layout with theme provider
│   │   ├── page.tsx              # Home page
│   │   ├── globals.css           # Global styles
│   │   ├── rankings/             # Rankings page
│   │   ├── weekly/               # Weekly results page
│   │   ├── stats/                # Statistics page
│   │   └── player/[id]/          # Dynamic player profile pages
│   ├── components/               # Reusable React components
│   │   ├── Header.tsx            # Navigation header
│   │   ├── Footer.tsx            # Footer component
│   │   ├── PlayerChart.tsx       # Player performance bar chart
│   │   ├── LeagueChart.tsx       # Top players bar chart
│   │   └── WeeklyTrendsChart.tsx # Weekly trends line chart
│   ├── contexts/                 # React contexts
│   │   └── ThemeContext.tsx      # Dark/Light mode context
│   ├── data/                     # JSON data files
│   │   ├── players.json          # Player data with total points
│   │   └── weeks.json            # Weekly scores for all players
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts              # Shared types
│   └── utils/                    # Utility functions
│       └── dataUtils.ts          # Data processing and calculations
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.js                # Next.js configuration
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm package manager

### Installation

1. **Navigate to the project directory**
   ```bash
   cd "c:/Users/Admin/Desktop/desk top/gp 2/FantasyAlberhaLeague"
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📊 Updating Data

### Player Data
Edit `src/data/players.json`:
```json
{
  "players": [
    {
      "id": 1,
      "name": "Player Name",
      "totalPoints": 485
    }
  ]
}
```

### Weekly Data
Edit `src/data/weeks.json`:
```json
{
  "week1": [
    {
      "playerId": 1,
      "playerName": "Player Name",
      "points": 85
    }
  ]
}
```

**Note**: Make sure `totalPoints` in `players.json` equals the sum of all weekly points for each player.

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to change the primary color scheme:
```typescript
colors: {
  primary: {
    DEFAULT: '#E3B341',  // Gold
    dark: '#C99B2E',
    light: '#F0C968',
  },
}
```

### Adding More Weeks
1. Add new week data to `src/data/weeks.json` (e.g., `week7`)
2. Update the weeks array in `src/app/weekly/page.tsx`
3. Update the calculation logic in `src/utils/dataUtils.ts`

## 📱 Pages Overview

### 1. Home Page (`/`)
- League title and overview
- Top 5 players leaderboard
- Quick stats cards
- Navigation to other pages

### 2. Rankings Page (`/rankings`)
- Complete player standings
- Search functionality
- Sortable by total points
- Links to player profiles

### 3. Weekly Results Page (`/weekly`)
- Week selector (1-6)
- Weekly leaderboard
- Week-specific statistics
- Performance comparison

### 4. Player Profile Page (`/player/[id]`)
- Player name and total points
- Average, highest, and lowest scores
- Consistency rating
- Weekly performance chart
- Week-by-week breakdown table

### 5. Statistics Page (`/stats`)
- Key league statistics
- Top 10 players bar chart
- Weekly trends line chart
- Detailed player statistics table
- Additional insights

## 🛠️ Technologies Used

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: SVG (inline)
- **Font**: Inter (Google Fonts)

## 🌙 Dark Mode

The website includes a dark/light mode toggle that:
- Persists user preference in localStorage
- Respects system preferences by default
- Smoothly transitions between themes
- Applies to all components and charts

## 📈 Future Enhancements

### Suggested Improvements
1. **Backend Integration**
   - Connect to a database (PostgreSQL, MongoDB)
   - Real-time updates
   - Admin panel for data management

2. **Additional Features**
   - Player comparison tool
   - Historical season data
   - Export data to PDF/Excel
   - Email notifications for weekly updates
   - User authentication and personalized dashboards

3. **Advanced Analytics**
   - Predictive analytics
   - Form trends
   - Head-to-head comparisons
   - Achievement badges

4. **Social Features**
   - Comments and discussions
   - Share results on social media
   - League chat

5. **Mobile App**
   - React Native version
   - Push notifications
   - Offline support

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill the process on port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

**Module not found errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors**
```bash
# Clean build
rm -rf .next
npm run build
```

## 📝 License

This project is created for the Fantasy Alberha League. Feel free to modify and use it for your own fantasy league!

## 👥 Support

For questions or issues:
1. Check the troubleshooting section
2. Review the code comments
3. Consult Next.js and Tailwind CSS documentation

## 🎯 Quick Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

# Maintenance
npm update           # Update dependencies
npm audit fix        # Fix security vulnerabilities
```

---

**Built with ❤️ for Fantasy Alberha League**
