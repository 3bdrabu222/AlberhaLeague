# 🗑️ Delete Gameweek Guide

## Overview
You can now delete gameweeks from your Fantasy League website through the admin panel. This is useful if you accidentally added a gameweek or need to remove incorrect data.

---

## ⚠️ Important Warnings

**CRITICAL**: Deleting a gameweek is **PERMANENT** and **CANNOT BE UNDONE**!

When you delete a gameweek:
- ✅ All points from that gameweek are removed
- ✅ Player total points are automatically recalculated
- ✅ All subsequent gameweeks are renumbered (e.g., if you delete Week 10, Week 11 becomes Week 10)
- ✅ Rankings are updated automatically
- ❌ **The data cannot be recovered** (unless you have a backup)

---

## 🚀 How to Delete a Gameweek

### Step 1: Access Admin Panel
Go to: **http://localhost:3000/admin**

### Step 2: Click "🗑️ Delete Gameweek" Tab
The tab will turn red to indicate this is a destructive action.

### Step 3: Select the Gameweek to Delete
- Click on the week button (e.g., W14)
- The button will turn red when selected
- You'll see a warning message

### Step 4: Read the Warning
A red warning box will appear showing:
- Which gameweek you're about to delete
- What will happen when you delete it
- A reminder that this cannot be undone

### Step 5: Confirm Deletion
1. Click "⚠️ I Understand, Proceed to Delete"
2. A second confirmation will appear asking "Are you absolutely sure?"
3. Click "🗑️ Yes, Delete Gameweek X" to confirm
4. Or click "❌ Cancel" to abort

### Step 6: Wait for Completion
- The system will process the deletion
- You'll see a success message
- The page will automatically reload after 2 seconds
- All data will be updated

---

## 📋 Example Scenario

**Situation**: You accidentally added Gameweek 14 with wrong data and want to remove it.

**Steps**:
1. Go to http://localhost:3000/admin
2. Click "🗑️ Delete Gameweek"
3. Click on "W14"
4. Read the warning
5. Click "⚠️ I Understand, Proceed to Delete"
6. Click "🗑️ Yes, Delete Gameweek 14"
7. Wait for success message
8. Page reloads - Gameweek 14 is gone!

**Result**:
- Gameweek 14 data is deleted
- All player totals are reduced by their Week 14 points
- Rankings are recalculated
- If there was a Week 15, it's now Week 14

---

## 🔄 What Happens After Deletion

### Automatic Updates:
1. **Player Totals**: Points from deleted week are subtracted
2. **Rankings**: All players are re-sorted by new totals
3. **Week Numbers**: Subsequent weeks are renumbered
4. **Charts**: All charts update to reflect new data
5. **Stats**: All statistics are recalculated

### Example:
**Before Deletion** (14 weeks total):
- Week 1, Week 2, ..., Week 10, Week 11, Week 12, Week 13, Week 14

**Delete Week 10**:
- Week 10 data is removed
- Week 11 becomes Week 10
- Week 12 becomes Week 11
- Week 13 becomes Week 12
- Week 14 becomes Week 13

**After Deletion** (13 weeks total):
- Week 1, Week 2, ..., Week 9, Week 10, Week 11, Week 12, Week 13

---

## 💡 Best Practices

### ✅ DO:
- **Double-check** which week you're deleting
- **Read all warnings** before confirming
- **Backup your data** before deleting (copy JSON files)
- **Use Update instead** if you just need to fix points

### ❌ DON'T:
- Delete a week without being absolutely sure
- Delete multiple weeks in a row without checking
- Ignore the warning messages
- Delete weeks if you just need to correct points (use Update instead)

---

## 🆚 Delete vs Update

### Use **Update** when:
- ✅ Points are wrong but the week should exist
- ✅ You made a data entry mistake
- ✅ You want to correct specific player scores

### Use **Delete** when:
- ✅ The entire week was added by mistake
- ✅ The week shouldn't exist at all
- ✅ You need to completely remove a gameweek

---

## 💾 Backup Recommendation

**Before deleting**, create a backup:

```bash
# Windows PowerShell
Copy-Item src/data/players.json src/data/players.backup.json
Copy-Item src/data/weeks.json src/data/weeks.backup.json
```

This way, if you delete the wrong week, you can restore from backup.

---

## 🔧 Restoring from Backup

If you accidentally deleted the wrong week:

1. **Stop the dev server** (Ctrl+C)
2. **Restore the backup files**:
   ```bash
   Copy-Item src/data/players.backup.json src/data/players.json
   Copy-Item src/data/weeks.backup.json src/data/weeks.json
   ```
3. **Restart the dev server**: `npm run dev`
4. **Refresh your browser**

---

## 🐛 Troubleshooting

### Issue: Can't find the Delete tab
**Solution**: Refresh the page (Ctrl+F5)

### Issue: Delete button is disabled
**Solution**: Make sure you've selected a week first

### Issue: Error message appears
**Solution**: 
- Check that the week exists
- Make sure the dev server is running
- Try refreshing and attempting again

### Issue: Page doesn't reload after deletion
**Solution**: Manually refresh (F5)

---

## 🎯 Summary

The delete feature is powerful but **permanent**. Always:
1. ✅ Be absolutely sure you want to delete
2. ✅ Read all warnings
3. ✅ Consider using Update instead
4. ✅ Backup your data first
5. ✅ Double-check the week number

**Remember**: There's no undo button! 🚨
