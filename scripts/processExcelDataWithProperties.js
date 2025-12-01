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
  
  // Process each gameweek with properties
  const gameweeks = [
    { week: 1, pointsKey: 'Gameweek 1', propKey: '__EMPTY_3', negKey: '__EMPTY_4' },
    { week: 2, pointsKey: 'Gameweek 2', propKey: '__EMPTY_5', negKey: '__EMPTY_6' },
    { week: 3, pointsKey: 'Gameweek 3', propKey: '__EMPTY_7', negKey: '__EMPTY_8' },
    { week: 4, pointsKey: 'Gameweek 4', propKey: '__EMPTY_9', negKey: '__EMPTY_10' },
    { week: 5, pointsKey: 'Gameweek 5', propKey: '__EMPTY_11', negKey: '__EMPTY_12' },
    { week: 6, pointsKey: 'Gameweek 6', propKey: '__EMPTY_13', negKey: '__EMPTY_14' },
    { week: 7, pointsKey: 'Gameweek 7', propKey: '__EMPTY_15', negKey: '__EMPTY_16' },
    { week: 8, pointsKey: 'Gameweek 8', propKey: '__EMPTY_17', negKey: '__EMPTY_18' },
    { week: 9, pointsKey: 'Gameweek 9', propKey: '__EMPTY_19', negKey: '__EMPTY_20' },
    { week: 10, pointsKey: 'Gameweek 10', propKey: '__EMPTY_21', negKey: '__EMPTY_22' },
    { week: 11, pointsKey: 'Gameweek 11', propKey: '__EMPTY_23', negKey: '__EMPTY_24' },
    { week: 12, pointsKey: 'Gameweek 12', propKey: '__EMPTY_25', negKey: '__EMPTY_26' },
    { week: 13, pointsKey: 'Gameweek 13', propKey: '__EMPTY_27', negKey: '__EMPTY_28' },
  ];
  
  gameweeks.forEach(({ week, pointsKey, propKey, negKey }) => {
    const points = row[pointsKey] || 0;
    const property = row[propKey] || 'Non';
    const negatives = row[negKey] || 0;
    
    // Normalize property names
    let normalizedProperty = 'None';
    if (property && property !== 'Non') {
      const propLower = property.toLowerCase().trim();
      if (propLower.includes('wild') || propLower.includes('w.c')) {
        normalizedProperty = 'Wildcard';
      } else if (propLower.includes('bench') || propLower.includes('b.b')) {
        normalizedProperty = 'Bench Boost';
      } else if (propLower.includes('free') || propLower.includes('f.h')) {
        normalizedProperty = 'Free Hit';
      } else if (propLower.includes('triple') || propLower.includes('t.c')) {
        normalizedProperty = 'Triple Captain';
      }
    }
    
    weeksData[`week${week}`].push({
      playerId: playerId,
      playerName: ownerName,
      teamName: teamName,
      points: points,
      property: normalizedProperty,
      negatives: negatives
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
console.log('✅ Weekly data with properties saved to src/data/weeks.json');
console.log(`   Total weeks: ${Object.keys(weeksData).length}`);

// Display summary
console.log('\n📊 Data Summary:');
console.log('Top 5 Players:');
players.slice(0, 5).forEach((player, index) => {
  console.log(`  ${index + 1}. ${player.name} (${player.teamName}) - ${player.totalPoints} points`);
});

// Show property usage summary
console.log('\n🎮 Property Usage Summary:');
const propertyUsage = {};
Object.values(weeksData).forEach(week => {
  week.forEach(entry => {
    if (entry.property !== 'None') {
      if (!propertyUsage[entry.playerName]) {
        propertyUsage[entry.playerName] = [];
      }
      propertyUsage[entry.playerName].push(entry.property);
    }
  });
});

Object.entries(propertyUsage).forEach(([player, props]) => {
  console.log(`  ${player}: ${props.join(', ')}`);
});
