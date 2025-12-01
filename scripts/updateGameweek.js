const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function updateGameweek() {
  console.log('\n📝 Update Existing Gameweek Data\n');
  
  // Read current data
  const playersData = JSON.parse(fs.readFileSync('src/data/players.json', 'utf8'));
  const weeksData = JSON.parse(fs.readFileSync('src/data/weeks.json', 'utf8'));
  
  const totalWeeks = Object.keys(weeksData).length;
  console.log(`Total Gameweeks: ${totalWeeks}\n`);
  
  const weekNum = await question('Which gameweek do you want to update? (1-' + totalWeeks + '): ');
  const weekToUpdate = parseInt(weekNum);
  
  if (weekToUpdate < 1 || weekToUpdate > totalWeeks) {
    console.log('❌ Invalid gameweek number!');
    rl.close();
    return;
  }
  
  const weekKey = `week${weekToUpdate}`;
  const oldWeekData = weeksData[weekKey];
  
  console.log(`\n📊 Current Gameweek ${weekToUpdate} Data:`);
  oldWeekData.forEach(entry => {
    console.log(`  ${entry.playerName}: ${entry.points} points`);
  });
  console.log('\n');
  
  // First, subtract old points from player totals
  oldWeekData.forEach(entry => {
    const player = playersData.players.find(p => p.id === entry.playerId);
    if (player) {
      player.totalPoints -= entry.points;
    }
  });
  
  const newWeekData = [];
  
  // Collect new points for each player
  for (const player of playersData.players) {
    const oldEntry = oldWeekData.find(e => e.playerId === player.id);
    const oldPoints = oldEntry ? oldEntry.points : 0;
    
    const points = await question(`Enter NEW points for ${player.name} (was ${oldPoints}): `);
    const pointsNum = parseInt(points) || 0;
    
    newWeekData.push({
      playerId: player.id,
      playerName: player.name,
      teamName: player.teamName,
      points: pointsNum
    });
    
    // Add new points to player total
    player.totalPoints += pointsNum;
  }
  
  // Sort new week data by points
  newWeekData.sort((a, b) => b.points - a.points);
  
  // Update week data
  weeksData[weekKey] = newWeekData;
  
  // Re-sort players by total points
  playersData.players.sort((a, b) => b.totalPoints - a.totalPoints);
  
  // Save updated data
  fs.writeFileSync('src/data/players.json', JSON.stringify(playersData, null, 2));
  fs.writeFileSync('src/data/weeks.json', JSON.stringify(weeksData, null, 2));
  
  console.log('\n✅ Gameweek ' + weekToUpdate + ' updated successfully!\n');
  console.log('📊 Updated Rankings:');
  playersData.players.forEach((player, index) => {
    console.log(`  ${index + 1}. ${player.name} - ${player.totalPoints} points`);
  });
  console.log('\n🌐 Refresh your browser to see the updates!\n');
  
  rl.close();
}

updateGameweek().catch(error => {
  console.error('Error:', error);
  rl.close();
});
