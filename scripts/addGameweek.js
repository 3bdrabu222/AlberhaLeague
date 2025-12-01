const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function addGameweek() {
  console.log('\n🎮 Add New Gameweek Data\n');
  
  // Read current data
  const playersData = JSON.parse(fs.readFileSync('src/data/players.json', 'utf8'));
  const weeksData = JSON.parse(fs.readFileSync('src/data/weeks.json', 'utf8'));
  
  // Find next week number
  const currentWeeks = Object.keys(weeksData).length;
  const nextWeek = currentWeeks + 1;
  
  console.log(`📅 Adding Gameweek ${nextWeek}\n`);
  console.log('Current Players:');
  playersData.players.forEach((player, index) => {
    console.log(`  ${index + 1}. ${player.name} (${player.teamName}) - Current Total: ${player.totalPoints}`);
  });
  console.log('\n');
  
  const newWeekData = [];
  
  // Collect points for each player
  for (const player of playersData.players) {
    const points = await question(`Enter points for ${player.name}: `);
    const pointsNum = parseInt(points) || 0;
    
    newWeekData.push({
      playerId: player.id,
      playerName: player.name,
      teamName: player.teamName,
      points: pointsNum
    });
    
    // Update player total
    player.totalPoints += pointsNum;
  }
  
  // Sort new week data by points
  newWeekData.sort((a, b) => b.points - a.points);
  
  // Add new week to weeks data
  weeksData[`week${nextWeek}`] = newWeekData;
  
  // Re-sort players by total points
  playersData.players.sort((a, b) => b.totalPoints - a.totalPoints);
  
  // Save updated data
  fs.writeFileSync('src/data/players.json', JSON.stringify(playersData, null, 2));
  fs.writeFileSync('src/data/weeks.json', JSON.stringify(weeksData, null, 2));
  
  console.log('\n✅ Gameweek ' + nextWeek + ' added successfully!\n');
  console.log('📊 Updated Rankings:');
  playersData.players.forEach((player, index) => {
    console.log(`  ${index + 1}. ${player.name} - ${player.totalPoints} points`);
  });
  console.log('\n🌐 Refresh your browser to see the updates!\n');
  
  rl.close();
}

addGameweek().catch(error => {
  console.error('Error:', error);
  rl.close();
});
