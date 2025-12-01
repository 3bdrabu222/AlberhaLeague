import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, week, data } = body;

    // Read current data files
    const playersPath = path.join(process.cwd(), 'src/data/players.json');
    const weeksPath = path.join(process.cwd(), 'src/data/weeks.json');

    const playersData = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
    const weeksData = JSON.parse(fs.readFileSync(weeksPath, 'utf8'));

    if (action === 'add') {
      // Add new gameweek
      const weekKey = `week${week}`;
      
      // Sort data by points
      const sortedData = [...data].sort((a, b) => b.points - a.points);
      weeksData[weekKey] = sortedData;

      // Update player totals (including transfer costs)
      data.forEach((entry: any) => {
        const player = playersData.players.find((p: any) => p.id === entry.playerId);
        if (player) {
          // Add points and subtract transfer costs (negatives are already negative numbers)
          player.totalPoints += entry.points + (entry.negatives || 0);
        }
      });

      // Re-sort players by total points
      playersData.players.sort((a: any, b: any) => b.totalPoints - a.totalPoints);

      // Save updated data
      fs.writeFileSync(playersPath, JSON.stringify(playersData, null, 2));
      fs.writeFileSync(weeksPath, JSON.stringify(weeksData, null, 2));

      return NextResponse.json({ 
        message: `Gameweek ${week} added successfully! Rankings updated.`,
        success: true 
      });

    } else if (action === 'update') {
      // Update existing gameweek
      const weekKey = `week${week}`;
      const oldWeekData = weeksData[weekKey];

      if (!oldWeekData) {
        return NextResponse.json({ 
          error: `Gameweek ${week} not found` 
        }, { status: 404 });
      }

      // Subtract old points from player totals (including transfer costs)
      oldWeekData.forEach((entry: any) => {
        const player = playersData.players.find((p: any) => p.id === entry.playerId);
        if (player) {
          player.totalPoints -= entry.points + (entry.negatives || 0);
        }
      });

      // Add new points to player totals (including transfer costs)
      data.forEach((entry: any) => {
        const player = playersData.players.find((p: any) => p.id === entry.playerId);
        if (player) {
          player.totalPoints += entry.points + (entry.negatives || 0);
        }
      });

      // Sort new week data by points
      const sortedData = [...data].sort((a, b) => b.points - a.points);
      weeksData[weekKey] = sortedData;

      // Re-sort players by total points
      playersData.players.sort((a: any, b: any) => b.totalPoints - a.totalPoints);

      // Save updated data
      fs.writeFileSync(playersPath, JSON.stringify(playersData, null, 2));
      fs.writeFileSync(weeksPath, JSON.stringify(weeksData, null, 2));

      return NextResponse.json({ 
        message: `Gameweek ${week} updated successfully! Rankings updated.`,
        success: true 
      });

    } else if (action === 'delete') {
      // Delete gameweek
      const weekKey = `week${week}`;
      const weekToDelete = weeksData[weekKey];

      if (!weekToDelete) {
        return NextResponse.json({ 
          error: `Gameweek ${week} not found` 
        }, { status: 404 });
      }

      // Subtract points from player totals (including transfer costs)
      weekToDelete.forEach((entry: any) => {
        const player = playersData.players.find((p: any) => p.id === entry.playerId);
        if (player) {
          player.totalPoints -= entry.points + (entry.negatives || 0);
        }
      });

      // Delete the week
      delete weeksData[weekKey];

      // Renumber remaining weeks if not the last week
      const totalWeeks = Object.keys(weeksData).length;
      if (week <= totalWeeks) {
        // Shift all weeks after the deleted one
        for (let i = week; i <= totalWeeks; i++) {
          const nextWeekKey = `week${i + 1}`;
          if (weeksData[nextWeekKey]) {
            weeksData[`week${i}`] = weeksData[nextWeekKey];
            delete weeksData[nextWeekKey];
          }
        }
      }

      // Re-sort players by total points
      playersData.players.sort((a: any, b: any) => b.totalPoints - a.totalPoints);

      // Save updated data
      fs.writeFileSync(playersPath, JSON.stringify(playersData, null, 2));
      fs.writeFileSync(weeksPath, JSON.stringify(weeksData, null, 2));

      return NextResponse.json({ 
        message: `Gameweek ${week} deleted successfully! All subsequent weeks have been renumbered.`,
        success: true 
      });
    }

    return NextResponse.json({ 
      error: 'Invalid action' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error processing gameweek:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}
