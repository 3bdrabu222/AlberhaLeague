# 🔧 Fix Vercel Read-Only File System Error

## ❌ The Problem

Vercel's serverless environment has a **read-only file system**. You cannot write to JSON files in production.

**Error:** `EROFS: read-only file system, open '/var/task/src/data/players.json'`

---

## ✅ Solution: Use Vercel Postgres (Free & Easy)

### **Step 1: Create Vercel Postgres Database**

1. Go to your Vercel project dashboard
2. Click on **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Choose **"Continue"** (Free tier)
6. Name it: `alberha-league-db`
7. Click **"Create"**

Vercel will automatically add environment variables to your project.

---

### **Step 2: Install Dependencies**

```bash
npm install @vercel/postgres
```

---

### **Step 3: Create Database Schema**

Create this file: `src/lib/db-schema.sql`

```sql
-- Players table
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  team_name TEXT,
  total_points INTEGER DEFAULT 0
);

-- Weeks table
CREATE TABLE IF NOT EXISTS weeks (
  id SERIAL PRIMARY KEY,
  week_number INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  player_name TEXT NOT NULL,
  points INTEGER NOT NULL,
  property TEXT,
  negatives INTEGER DEFAULT 0,
  FOREIGN KEY (player_id) REFERENCES players(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_weeks_week_number ON weeks(week_number);
CREATE INDEX IF NOT EXISTS idx_weeks_player_id ON weeks(player_id);
```

---

### **Step 4: Initialize Database**

Create this file: `src/lib/init-db.ts`

```typescript
import { sql } from '@vercel/postgres';
import playersData from '@/data/players.json';
import weeksData from '@/data/weeks.json';

export async function initializeDatabase() {
  try {
    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        team_name TEXT,
        total_points INTEGER DEFAULT 0
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS weeks (
        id SERIAL PRIMARY KEY,
        week_number INTEGER NOT NULL,
        player_id INTEGER NOT NULL,
        player_name TEXT NOT NULL,
        points INTEGER NOT NULL,
        property TEXT,
        negatives INTEGER DEFAULT 0
      );
    `;

    // Check if data already exists
    const { rows } = await sql`SELECT COUNT(*) as count FROM players`;
    if (rows[0].count > 0) {
      console.log('Database already initialized');
      return;
    }

    // Insert players
    for (const player of playersData.players) {
      await sql`
        INSERT INTO players (id, name, team_name, total_points)
        VALUES (${player.id}, ${player.name}, ${player.teamName}, ${player.totalPoints})
      `;
    }

    // Insert weeks data
    for (const [weekKey, weekEntries] of Object.entries(weeksData)) {
      const weekNumber = parseInt(weekKey.replace('week', ''));
      
      for (const entry of weekEntries as any[]) {
        await sql`
          INSERT INTO weeks (week_number, player_id, player_name, points, property, negatives)
          VALUES (
            ${weekNumber},
            ${entry.playerId},
            ${entry.playerName},
            ${entry.points},
            ${entry.property || 'None'},
            ${entry.negatives || 0}
          )
        `;
      }
    }

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
```

---

### **Step 5: Update API Route**

Replace `src/app/api/gameweek/route.ts` with:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, week, data } = body;

    if (action === 'add') {
      // Add new gameweek
      for (const entry of data) {
        await sql`
          INSERT INTO weeks (week_number, player_id, player_name, points, property, negatives)
          VALUES (
            ${week},
            ${entry.playerId},
            ${entry.playerName},
            ${entry.points},
            ${entry.property || 'None'},
            ${entry.negatives || 0}
          )
        `;

        // Update player total points
        await sql`
          UPDATE players
          SET total_points = total_points + ${entry.points + (entry.negatives || 0)}
          WHERE id = ${entry.playerId}
        `;
      }

      return NextResponse.json({ 
        message: `Gameweek ${week} added successfully!`,
        success: true 
      });

    } else if (action === 'update') {
      // Get old week data
      const { rows: oldData } = await sql`
        SELECT * FROM weeks WHERE week_number = ${week}
      `;

      if (oldData.length === 0) {
        return NextResponse.json({ 
          error: `Gameweek ${week} not found` 
        }, { status: 404 });
      }

      // Subtract old points
      for (const entry of oldData) {
        await sql`
          UPDATE players
          SET total_points = total_points - ${entry.points + (entry.negatives || 0)}
          WHERE id = ${entry.player_id}
        `;
      }

      // Delete old week data
      await sql`DELETE FROM weeks WHERE week_number = ${week}`;

      // Add new week data
      for (const entry of data) {
        await sql`
          INSERT INTO weeks (week_number, player_id, player_name, points, property, negatives)
          VALUES (
            ${week},
            ${entry.playerId},
            ${entry.playerName},
            ${entry.points},
            ${entry.property || 'None'},
            ${entry.negatives || 0}
          )
        `;

        // Add new points
        await sql`
          UPDATE players
          SET total_points = total_points + ${entry.points + (entry.negatives || 0)}
          WHERE id = ${entry.playerId}
        `;
      }

      return NextResponse.json({ 
        message: `Gameweek ${week} updated successfully!`,
        success: true 
      });

    } else if (action === 'delete') {
      // Get week data to delete
      const { rows: weekData } = await sql`
        SELECT * FROM weeks WHERE week_number = ${week}
      `;

      if (weekData.length === 0) {
        return NextResponse.json({ 
          error: `Gameweek ${week} not found` 
        }, { status: 404 });
      }

      // Subtract points from players
      for (const entry of weekData) {
        await sql`
          UPDATE players
          SET total_points = total_points - ${entry.points + (entry.negatives || 0)}
          WHERE id = ${entry.player_id}
        `;
      }

      // Delete the week
      await sql`DELETE FROM weeks WHERE week_number = ${week}`;

      // Renumber subsequent weeks
      await sql`
        UPDATE weeks
        SET week_number = week_number - 1
        WHERE week_number > ${week}
      `;

      return NextResponse.json({ 
        message: `Gameweek ${week} deleted successfully!`,
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
```

---

### **Step 6: Update Data Utils**

Update `src/utils/dataUtils.ts`:

```typescript
import { sql } from '@vercel/postgres';

export async function getPlayers() {
  try {
    const { rows } = await sql`
      SELECT id, name, team_name as "teamName", total_points as "totalPoints"
      FROM players
      ORDER BY total_points DESC
    `;
    return rows;
  } catch (error) {
    console.error('Error fetching players:', error);
    // Fallback to JSON file in development
    if (process.env.NODE_ENV === 'development') {
      const playersData = require('@/data/players.json');
      return playersData.players;
    }
    return [];
  }
}

export async function getWeekData(week: number) {
  try {
    const { rows } = await sql`
      SELECT 
        player_id as "playerId",
        player_name as "playerName",
        points,
        property,
        negatives
      FROM weeks
      WHERE week_number = ${week}
      ORDER BY points DESC
    `;
    return rows;
  } catch (error) {
    console.error('Error fetching week data:', error);
    // Fallback to JSON file in development
    if (process.env.NODE_ENV === 'development') {
      const weeksData = require('@/data/weeks.json');
      return weeksData[`week${week}`] || [];
    }
    return [];
  }
}

export async function getTotalWeeks() {
  try {
    const { rows } = await sql`
      SELECT MAX(week_number) as max_week FROM weeks
    `;
    return rows[0]?.max_week || 0;
  } catch (error) {
    console.error('Error fetching total weeks:', error);
    // Fallback to JSON file in development
    if (process.env.NODE_ENV === 'development') {
      const weeksData = require('@/data/weeks.json');
      return Object.keys(weeksData).length;
    }
    return 0;
  }
}
```

---

### **Step 7: Create Init API Route**

Create `src/app/api/init-db/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/init-db';

export async function GET() {
  try {
    await initializeDatabase();
    return NextResponse.json({ 
      message: 'Database initialized successfully!',
      success: true 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
```

---

### **Step 8: Deploy & Initialize**

1. **Install dependencies:**
   ```bash
   npm install @vercel/postgres
   ```

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add Vercel Postgres database support"
   git push origin main
   ```

3. **Wait for Vercel to deploy**

4. **Initialize database** (one-time):
   Visit: `https://alberha-league.vercel.app/api/init-db`

5. **Test admin page:**
   Visit: `https://alberha-league.vercel.app/admin`

---

## 🎉 Done!

Your admin page will now work on Vercel! The database will persist all changes.

---

## 💡 Alternative: Quick Fix (Temporary)

If you want a quick temporary solution, you can make the admin page **development-only**:

```typescript
// In src/app/admin/page.tsx
if (process.env.NODE_ENV === 'production') {
  return <div>Admin panel is only available in development mode</div>;
}
```

Then manage gameweeks locally and redeploy after each update.

---

## 📊 Comparison

| Solution | Pros | Cons |
|----------|------|------|
| **Vercel Postgres** | ✅ Free tier<br>✅ Auto-scaling<br>✅ Persistent | ⚠️ Requires migration |
| **Local Only** | ✅ No changes needed | ❌ No live updates<br>❌ Manual redeploy |
| **MongoDB Atlas** | ✅ Free tier<br>✅ Flexible | ⚠️ External service |

**Recommended:** Use Vercel Postgres for the best experience!
