# 🎮 Gameweek Management Guide

## Overview
Your Fantasy Alberha League website is now set up to easily add and update gameweeks as your season progresses. The website automatically adjusts to show all available gameweeks.

## 📊 Current Status
- **Current Gameweeks**: 13
- **Total Players**: 6
- **Website**: Automatically updates when you add new gameweeks

---

## 🆕 Adding a New Gameweek

When a new gameweek is completed, use this command:

```bash
npm run add-week
```

### What happens:
1. The script will show you all current players
2. You'll be prompted to enter points for each player
3. The script automatically:
   - Adds the new gameweek data
   - Updates player total points
   - Re-sorts rankings
   - Saves everything to JSON files

### Example:
```
🎮 Add New Gameweek Data

📅 Adding Gameweek 14

Current Players:
  1. Ahmed Mohammed (Ahmed Alshre'e) - Current Total: 721
  2. Osama Mohammed (The fool) - Current Total: 720
  3. Saad Saleh (Jupa 34) - Current Total: 714
  4. Ahmed Salah (The dark passenger) - Current Total: 708
  5. Ayman Mohammed (Aemn) - Current Total: 691
  6. Abdurabu Saleh (Marvelous Team) - Current Total: 618

Enter points for Ahmed Mohammed: 75
Enter points for Osama Mohammed: 68
Enter points for Saad Saleh: 72
Enter points for Ahmed Salah: 65
Enter points for Ayman Mohammed: 70
Enter points for Abdurabu Saleh: 55

✅ Gameweek 14 added successfully!

📊 Updated Rankings:
  1. Ahmed Mohammed - 796 points
  2. Osama Mohammed - 788 points
  3. Saad Saleh - 786 points
  4. Ahmed Salah - 773 points
  5. Ayman Mohammed - 761 points
  6. Abdurabu Saleh - 673 points

🌐 Refresh your browser to see the updates!
```

---

## ✏️ Updating an Existing Gameweek

If you need to correct points for a gameweek:

```bash
npm run update-week
```

### What happens:
1. Shows total number of gameweeks
2. Asks which gameweek to update
3. Shows current points for that week
4. Prompts for new points for each player
5. Automatically recalculates totals

### Example:
```
📝 Update Existing Gameweek Data

Total Gameweeks: 13

Which gameweek do you want to update? (1-13): 10

📊 Current Gameweek 10 Data:
  Abdurabu Saleh: 89 points
  Osama Mohammed: 74 points
  Ayman Mohammed: 72 points
  Saad Saleh: 68 points
  Ahmed Mohammed: 64 points
  Ahmed Salah: 57 points

Enter NEW points for Ahmed Mohammed (was 64): 70
Enter NEW points for Osama Mohammed (was 74): 74
Enter NEW points for Saad Saleh (was 68): 68
Enter NEW points for Ahmed Salah (was 57): 60
Enter NEW points for Ayman Mohammed (was 72): 72
Enter NEW points for Abdurabu Saleh (was 89): 89

✅ Gameweek 10 updated successfully!
```

---

## 📥 Re-importing from Excel

If you update your Excel file with new data:

```bash
npm run import-excel
```

**⚠️ Warning**: This will completely replace all current data with data from the Excel file.

---

## 🔄 Workflow for Each Gameweek

### Step-by-Step Process:

1. **Gameweek Completes**
   - Collect final points for all players

2. **Add to Website**
   ```bash
   npm run add-week
   ```
   - Enter points for each player when prompted

3. **Verify**
   - Refresh your browser at http://localhost:3000
   - Check the new gameweek appears
   - Verify rankings are correct

4. **Fix Mistakes (if needed)**
   ```bash
   npm run update-week
   ```
   - Select the gameweek to fix
   - Enter corrected points

---

## 📁 Data Files

The scripts update these files automatically:
- `src/data/players.json` - Player totals and info
- `src/data/weeks.json` - Weekly scores

**💡 Tip**: You can manually edit these files if needed, but using the scripts is safer and easier.

---

## 🌐 Website Updates

The website is **fully dynamic** and will automatically:
- ✅ Show all available gameweeks in the Weekly Results page
- ✅ Update charts to include new weeks
- ✅ Recalculate all statistics
- ✅ Update player averages
- ✅ Adjust rankings

**No code changes needed!** Just add the data and refresh the browser.

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Add new gameweek | `npm run add-week` |
| Update existing gameweek | `npm run update-week` |
| Re-import from Excel | `npm run import-excel` |
| Start website | `npm run dev` |
| Build for production | `npm run build` |

---

## 💾 Backup Recommendation

Before adding/updating data, consider backing up your data files:

```bash
# Windows PowerShell
Copy-Item src/data/players.json src/data/players.backup.json
Copy-Item src/data/weeks.json src/data/weeks.backup.json
```

---

## 🐛 Troubleshooting

### Issue: Script won't run
**Solution**: Make sure you're in the project directory
```bash
cd "c:/Users/Admin/Desktop/desk top/gp 2/FantasyAlberhaLeague"
```

### Issue: Website doesn't show new gameweek
**Solution**: 
1. Make sure the script completed successfully
2. Refresh your browser (Ctrl+F5 for hard refresh)
3. Check the browser console for errors

### Issue: Rankings look wrong
**Solution**: 
1. Check the JSON files in `src/data/`
2. Use `npm run update-week` to fix incorrect data
3. Or manually edit the JSON files

---

## 📞 Need Help?

If you encounter issues:
1. Check the console output for error messages
2. Verify the JSON files are valid (use a JSON validator)
3. Restart the development server: `npm run dev`

---

**Happy Gaming! 🎮⚽**
