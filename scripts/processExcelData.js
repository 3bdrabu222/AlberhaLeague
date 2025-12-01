const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = XLSX.readFile('Fantasy Alberha League.xlsx');
const worksheet = workbook.Sheets['Fantasy Alberha League'];
const rawData = XLSX.utils.sheet_to_json(worksheet);

// Remove header row
const dataRows = rawData.slice(1);

// Process players
const players = [];
const weeksData = {};

// Initialize weeks (1-13)
for (let i = 1; i <= 13; i++) {
  weeksData[`week${i}`] = [];
}

dataRows.forEach((row, index) => {
  // Skip if not a valid player row
  if (!row.__EMPTY_1 || !row.__EMPTY_2) return;
  
  const playerId = index + 1;
  const teamName = row.__EMPTY_1;
  const ownerName = row.__EMPTY_2;
  const totalPoints = row.__EMPTY_30 || 0;
  
  // Add player
  players.push({
    id: playerId,
    name: ownerName,
    teamName: teamName,
    totalPoints: totalPoints
  });
  
  // Add weekly scores
  const weekKeys = [
    'Gameweek 1', 'Gameweek 2', 'Gameweek 3', 'Gameweek 4', 
    'Gameweek 5', 'Gameweek 6', 'Gameweek 7', 'Gameweek 8',
    'Gameweek 9', 'Gameweek 10', 'Gameweek 11', 'Gameweek 12', 'Gameweek 13'
  ];
  
  weekKeys.forEach((weekKey, weekIndex) => {
    const points = row[weekKey] || 0;
    const weekNum = weekIndex + 1;
    
    weeksData[`week${weekNum}`].push({
      playerId: playerId,
      playerName: ownerName,
      teamName: teamName,
      points: points
    });
  });
});

// Sort players by total points
players.sort((a, b) => b.totalPoints - a.totalPoints);

// Sort each week by points
Object.keys(weeksData).forEach(week => {
  weeksData[week].sort((a, b) => b.points - a.points);
});

// Save players data
fs.writeFileSync('src/data/players.json', JSON.stringify({ players }, null, 2));
console.log('✅ Players data saved to src/data/players.json');
console.log(`   Total players: ${players.length}`);

// Save weeks data
fs.writeFileSync('src/data/weeks.json', JSON.stringify(weeksData, null, 2));
console.log('✅ Weekly data saved to src/data/weeks.json');
console.log(`   Total weeks: ${Object.keys(weeksData).length}`);

// Display summary
console.log('\n📊 Data Summary:');
console.log('Top 5 Players:');
players.slice(0, 5).forEach((player, index) => {
  console.log(`  ${index + 1}. ${player.name} (${player.teamName}) - ${player.totalPoints} points`);
});
