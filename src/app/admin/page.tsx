'use client';

import { useState } from 'react';
import { getPlayers, getTotalWeeks, getWeekData } from '@/utils/dataUtils';

export default function AdminPage() {
  // Check if running in production
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="card max-w-2xl text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Admin Panel Unavailable in Production
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Due to Vercel's read-only file system, the admin panel only works in local development mode.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h2 className="font-bold text-lg mb-3 text-blue-900 dark:text-blue-100">
              📝 How to Add/Update Gameweeks:
            </h2>
            <ol className="text-left space-y-2 text-gray-700 dark:text-gray-300">
              <li>1. Run the project locally: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">npm run dev</code></li>
              <li>2. Visit: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">http://localhost:3000/admin</code></li>
              <li>3. Add/update your gameweek data</li>
              <li>4. Commit and push changes: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">git push</code></li>
              <li>5. Vercel will automatically redeploy with new data</li>
            </ol>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>💡 Future Solution:</strong> Migrate to Vercel Postgres database for live admin updates.
              <br />See <code>VERCEL_DATABASE_SETUP.md</code> for instructions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const players = getPlayers();
  const totalWeeks = getTotalWeeks();
  const [activeTab, setActiveTab] = useState<'add' | 'update' | 'delete'>('add');
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [points, setPoints] = useState<{ [key: number]: string }>({});
  const [properties, setProperties] = useState<{ [key: number]: string }>({});
  const [negatives, setNegatives] = useState<{ [key: number]: string }>({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize points for add mode
  const initializePoints = () => {
    const initialPoints: { [key: number]: string } = {};
    const initialProps: { [key: number]: string } = {};
    const initialNegs: { [key: number]: string } = {};
    players.forEach(player => {
      initialPoints[player.id] = '';
      initialProps[player.id] = 'None';
      initialNegs[player.id] = '0';
    });
    setPoints(initialPoints);
    setProperties(initialProps);
    setNegatives(initialNegs);
  };

  // Load existing week data for update mode
  const loadWeekData = (week: number) => {
    const weekData = getWeekData(week);
    const weekPoints: { [key: number]: string } = {};
    const weekProps: { [key: number]: string } = {};
    const weekNegs: { [key: number]: string } = {};
    players.forEach(player => {
      const playerWeek = weekData.find(w => w.playerId === player.id);
      weekPoints[player.id] = playerWeek ? playerWeek.points.toString() : '0';
      weekProps[player.id] = playerWeek?.property || 'None';
      weekNegs[player.id] = playerWeek?.negatives?.toString() || '0';
    });
    setPoints(weekPoints);
    setProperties(weekProps);
    setNegatives(weekNegs);
  };

  const handleTabChange = (tab: 'add' | 'update' | 'delete') => {
    setActiveTab(tab);
    setMessage('');
    setShowDeleteConfirm(false);
    if (tab === 'add') {
      initializePoints();
    } else if (tab === 'update') {
      loadWeekData(selectedWeek);
    }
  };

  const handleWeekChange = (week: number) => {
    setSelectedWeek(week);
    loadWeekData(week);
  };

  const handlePointsChange = (playerId: number, value: string) => {
    setPoints(prev => ({ ...prev, [playerId]: value }));
  };

  const handleDelete = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/gameweek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          week: selectedWeek
        })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ ${result.message}`);
        setShowDeleteConfirm(false);
        // Reload page after 2 seconds to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const gameweekData = players.map(player => ({
        playerId: player.id,
        playerName: player.name,
        teamName: player.teamName,
        points: parseInt(points[player.id]) || 0,
        property: properties[player.id] || 'None',
        negatives: parseInt(negatives[player.id]) || 0
      }));

      const response = await fetch('/api/gameweek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: activeTab,
          week: activeTab === 'update' ? selectedWeek : totalWeeks + 1,
          data: gameweekData
        })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ ${result.message}`);
        // Reset form
        if (activeTab === 'add') {
          initializePoints();
        }
        // Reload page after 2 seconds to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">⚙️ FPL Admin Panel</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage gameweek data, chips, and transfer costs
        </p>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 flex-wrap">
          <button
            onClick={() => handleTabChange('add')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'add'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            ➕ Add New Gameweek
          </button>
          <button
            onClick={() => handleTabChange('update')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'update'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            ✏️ Update Existing Gameweek
          </button>
          <button
            onClick={() => handleTabChange('delete')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'delete'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            🗑️ Delete Gameweek
          </button>
        </div>

        {/* Info Banner */}
        <div className={`mt-4 p-4 rounded-lg border ${
          activeTab === 'delete' 
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
        }`}>
          <p className={`text-sm ${
            activeTab === 'delete'
              ? 'text-red-800 dark:text-red-200'
              : 'text-blue-800 dark:text-blue-200'
          }`}>
            {activeTab === 'add' 
              ? `📅 You are adding Gameweek ${totalWeeks + 1}` 
              : activeTab === 'update'
              ? `📝 You are updating Gameweek ${selectedWeek}`
              : `⚠️ You are about to delete Gameweek ${selectedWeek} - This action cannot be undone!`}
          </p>
        </div>

        {/* Week Selector for Update Mode */}
        {activeTab === 'update' && (
          <div className="mt-6">
            <label className="block text-sm font-semibold mb-3">Select Gameweek to Update:</label>
            <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-13 gap-2">
              {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => (
                <button
                  key={week}
                  onClick={() => handleWeekChange(week)}
                  className={`py-2 px-3 rounded-lg font-semibold transition-all text-sm ${
                    selectedWeek === week
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  W{week}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Week Selector for Delete Mode */}
        {activeTab === 'delete' && (
          <div className="mt-6">
            <label className="block text-sm font-semibold mb-3">Select Gameweek to Delete:</label>
            <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-13 gap-2">
              {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className={`py-2 px-3 rounded-lg font-semibold transition-all text-sm ${
                    selectedWeek === week
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/20'
                  }`}
                >
                  W{week}
                </button>
              ))}
            </div>

            {/* Delete Confirmation Section */}
            <div className="mt-6 p-6 bg-red-50 dark:bg-red-900/10 border-2 border-red-300 dark:border-red-800 rounded-lg">
              <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-4">
                ⚠️ Delete Gameweek {selectedWeek}?
              </h3>
              <div className="space-y-3 mb-6">
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>Warning:</strong> This will permanently delete Gameweek {selectedWeek} and:
                </p>
                <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1 ml-4">
                  <li>Remove all points from this gameweek</li>
                  <li>Subtract these points from player totals</li>
                  <li>Update all rankings</li>
                  <li>This action <strong>CANNOT</strong> be undone</li>
                </ul>
              </div>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  ⚠️ I Understand, Proceed to Delete
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-center font-bold text-red-800 dark:text-red-200">
                    Are you absolutely sure?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? '⏳ Deleting...' : '🗑️ Yes, Delete Gameweek ' + selectedWeek}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form - Only show for add/update modes */}
        {activeTab !== 'delete' && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map((player) => (
              <div key={player.id} className="p-4 bg-gray-50 dark:bg-dark-hover rounded-lg">
                <label className="block mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {player.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    ({player.teamName})
                  </span>
                  {activeTab === 'add' && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                      Current Total: {player.totalPoints} pts
                    </span>
                  )}
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Points</label>
                    <input
                      type="number"
                      min="0"
                      max="200"
                      value={points[player.id] || ''}
                      onChange={(e) => handlePointsChange(player.id, e.target.value)}
                      placeholder="Enter points"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-lg font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Chip Used</label>
                    <select
                      value={properties[player.id] || 'None'}
                      onChange={(e) => setProperties(prev => ({ ...prev, [player.id]: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="None">None</option>
                      <option value="Wildcard">🃏 Wildcard</option>
                      <option value="Bench Boost">💪 Bench Boost</option>
                      <option value="Free Hit">🎯 Free Hit</option>
                      <option value="Triple Captain">👑 Triple Captain</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Transfer Cost (-4 per extra transfer)</label>
                    <input
                      type="number"
                      max="0"
                      value={negatives[player.id] || '0'}
                      onChange={(e) => setNegatives(prev => ({ ...prev, [player.id]: e.target.value }))}
                      placeholder="0"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.startsWith('✅') 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-lg"
            >
              {loading ? '⏳ Saving...' : activeTab === 'add' ? '➕ Add Gameweek' : '💾 Update Gameweek'}
            </button>
            <button
              type="button"
              onClick={() => activeTab === 'add' ? initializePoints() : loadWeekData(selectedWeek)}
              className="px-6 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg transition-all"
            >
              🔄 Reset
            </button>
          </div>
        </form>
        )}
      </div>

      {/* Current Stats */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">📊 Current Season Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-hover rounded-lg">
            <div className="text-3xl font-bold text-primary">{totalWeeks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Gameweeks</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-hover rounded-lg">
            <div className="text-3xl font-bold text-primary">{players.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Players</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-hover rounded-lg">
            <div className="text-3xl font-bold text-primary">{players[0]?.name.split(' ')[0]}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Leader</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-hover rounded-lg">
            <div className="text-3xl font-bold text-primary">{players[0]?.totalPoints}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Top Score</div>
          </div>
        </div>
      </div>
    </div>
  );
}
