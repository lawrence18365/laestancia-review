# 🔄 How to Reset Your Sheets After Testing

## When You Need This

After testing your review system, you'll want to clear out test data before going live. This guide shows you how to properly reset all sheets while maintaining functionality.

---

## ⚠️ IMPORTANT: Two Reset Methods

### Method 1: Clean Slate (Recommended for First Time)
**Use this if:** You want to start completely fresh with empty sheets

### Method 2: Delete Data Only (Keep Formatting)
**Use this if:** You just want to clear test data but keep the sheet structure

---

## 🎯 Method 1: Complete Reset (Clean Slate)

This method recreates all sheets from scratch. **Best for initial setup testing.**

### Step-by-Step Instructions:

#### 1. Delete All Existing Sheets
1. Open your Google Sheet
2. Right-click on each sheet tab (Leaderboard, Raw Data, Feedback, etc.)
3. Click **Delete**
4. Repeat until you only have 1 blank sheet left (you can't delete the last one)

#### 2. Re-run Initialize Function
1. Go to **Extensions** → **Apps Script**
2. In the function dropdown, select **initializeSheet**
3. Click **Run** (▶ play button)
4. Wait for "Execution completed"
5. Go back to your Google Sheet and refresh
6. Verify all 5 sheets are recreated:
   - **Leaderboard**
   - **Raw Data**
   - **Feedback**
   - **Weekly History**
   - **All-Time Stats**

#### 3. Verify Everything Works
1. Test a rating submission
2. Check that data appears in Raw Data
3. Check that Leaderboard updates
4. Test feedback form
5. Test email notification

**That's it!** Your sheets are now reset and ready for production.

---

## 🧹 Method 2: Clear Data Only (Keep Structure)

This method keeps your sheet structure but removes test data. **Best for clearing test data before launch.**

### Raw Data Sheet

1. Open the **Raw Data** sheet
2. Click on row **2** (first data row, not the header)
3. Hold **Shift** and click the last row with data
4. Right-click → **Delete rows 2-X**
5. ✅ Header row remains intact

### Feedback Sheet

1. Open the **Feedback** sheet
2. Click on row **2** (first data row)
3. Hold **Shift** and click the last row with data
4. Right-click → **Delete rows 2-X**
5. ✅ Header row remains intact

### Weekly History Sheet

1. Open the **Weekly History** sheet
2. Click on row **5** (first data row, after headers and title)
3. Hold **Shift** and click the last row with data
4. Right-click → **Delete rows 5-X**
5. ✅ Headers remain intact

### Leaderboard Sheet

**DO NOT DELETE ANYTHING** - It auto-calculates from Raw Data. Once you clear Raw Data, the Leaderboard will show zeros automatically.

### All-Time Stats Sheet

**DO NOT DELETE ANYTHING** - It auto-calculates from Raw Data. Once you clear Raw Data, the stats will reset automatically.

---

## 📧 Resetting Email Test Data

If you sent test emails and want to clean up:

### Option A: No Action Needed
Test emails stay in your inbox but won't affect production. You can just delete them or archive them.

### Option B: Verify Email Settings
1. Go to **Extensions** → **Apps Script**
2. Check line 21: `const MANAGER_EMAIL = "lbarwe1@gmail.com";`
3. Make sure it's correct

---

## 🔧 Resetting Automated Triggers

If you want to reset the weekly/monthly triggers:

### Check Current Triggers
1. Go to **Extensions** → **Apps Script**
2. Click the **clock icon** (⏰) in the left sidebar
3. You'll see all active triggers

### Delete All Triggers (If Needed)
1. Click the **⋮** (three dots) next to each trigger
2. Click **Delete trigger**
3. Repeat for all triggers

### Recreate Triggers
Run these functions again:
1. Select **setupWeeklyArchive** → Run
2. Select **setupWeeklyReports** → Run
3. Select **setupMonthlyReports** → Run

---

## 🎯 Quick Reset Checklist for Going Live

Use this checklist before launching to production:

- [ ] Clear all test data from Raw Data sheet (rows 2+)
- [ ] Clear all test data from Feedback sheet (rows 2+)
- [ ] Clear all test data from Weekly History sheet (rows 5+)
- [ ] Leaderboard shows zeros or empty
- [ ] All-Time Stats shows zeros or empty
- [ ] MANAGER_EMAIL is correct (lbarwe1@gmail.com)
- [ ] WEBHOOK_URL is correct in review.html
- [ ] WEBHOOK_URL is correct in feedback.html
- [ ] All triggers are set up (check Triggers tab)
- [ ] Test one final rating submission
- [ ] Test one final feedback submission
- [ ] Verify email received for test feedback
- [ ] Delete test emails from inbox

---

## 💡 Understanding What Resets and What Doesn't

### ✅ Gets Reset When You Clear Data:
- All review counts
- All ratings
- All feedback entries
- Weekly history
- Leaderboard rankings
- All-time statistics

### ❌ Does NOT Get Reset (Good!):
- Sheet structure and formatting
- Formulas in Leaderboard
- Formulas in All-Time Stats
- Email triggers
- Apps Script code
- Web App URL
- Google Apps Script deployment settings

---

## 🧪 Testing Without Messing Up Production Data

### Best Practice: Use Test Mode

If you want to test after going live without affecting real data:

1. **Create a separate Google Sheet for testing**
2. Copy the Apps Script code
3. Deploy it as a separate Web App
4. Use the test Web App URL for testing
5. Keep production URL for real NFC cards

**Benefit:** You can test anytime without touching production data!

---

## 🔄 Routine Maintenance (Optional)

### Monthly Cleanup (Optional)

You might want to clean up old data periodically:

1. **Export old data first** (File → Download → CSV)
2. Delete rows older than X months from Raw Data
3. Leaderboard and Stats will recalculate automatically

**Note:** Weekly History preserves historical weekly winners, so you can keep that forever!

---

## ⚠️ Things to NEVER Delete

**DO NOT delete these or your system will break:**

- ❌ Header rows (row 1 in most sheets)
- ❌ The entire Leaderboard sheet
- ❌ The entire All-Time Stats sheet
- ❌ Formula cells in Leaderboard
- ❌ Formula cells in All-Time Stats
- ❌ The Apps Script code
- ❌ Your Web App deployment

**If you accidentally delete something important:** Use Method 1 (Complete Reset) to rebuild everything.

---

## 🆘 Troubleshooting Reset Issues

### Issue: After reset, Leaderboard shows #REF! errors

**Cause:** Formulas broken during reset

**Fix:**
1. Delete the Leaderboard sheet entirely
2. Re-run `initializeSheet` function
3. Everything will be recreated

### Issue: After clearing data, new data doesn't appear

**Cause:** Formulas might reference wrong rows

**Fix:**
1. Use Method 1 (Complete Reset)
2. Or verify formulas reference the correct ranges

### Issue: Emails stopped working after reset

**Cause:** Triggers might have been deleted

**Fix:**
1. Go to Apps Script → Triggers tab
2. Verify triggers exist
3. If not, re-run setup functions:
   - `setupWeeklyArchive`
   - `setupWeeklyReports`
   - `setupMonthlyReports`

### Issue: Data appears in Raw Data but not in Leaderboard

**Cause:** Staff names don't match exactly

**Fix:**
1. Check Raw Data - what names appear?
2. Check Apps Script - do staff names match exactly?
3. Names are case-sensitive: "Eduardo" ≠ "eduardo"
4. Fix staff array in Apps Script if needed (lines 181, 415, 1041)

---

## 📋 Pre-Launch Reset Procedure (Step-by-Step)

Follow this exact procedure before going live:

### Day Before Launch:

1. **Final Testing**
   - Test all staff NFC cards
   - Test 5-star flow
   - Test low rating + feedback flow
   - Verify all emails received

2. **Document Everything**
   - Screenshot current Leaderboard
   - Note any issues
   - Verify all settings correct

### Launch Day Morning:

1. **Clear Test Data** (Method 2)
   - Delete rows 2+ from Raw Data
   - Delete rows 2+ from Feedback
   - Delete rows 5+ from Weekly History
   - Verify Leaderboard shows zeros

2. **Final Verification**
   - WEBHOOK_URL correct in HTML files
   - Manager email correct in Apps Script
   - Triggers all active
   - Web App deployed and accessible

3. **Final Test**
   - Submit ONE test review
   - Verify it appears
   - Delete that test row
   - ✅ Ready for production!

4. **Launch** 🚀
   - Start using real NFC cards
   - Monitor first few submissions
   - Check email notifications work

---

## 🎯 Pro Tips

### Tip 1: Keep a Backup
Before resetting, download your sheets:
- File → Download → Microsoft Excel (.xlsx)
- Save in a safe place

### Tip 2: Document Your URL
Keep your Web App URL in a safe place:
- Save in a text file
- Email to yourself
- Add to password manager

### Tip 3: Test in Private/Incognito Window
When testing, use incognito mode to simulate real user experience.

### Tip 4: Use Version Control
Before major changes:
1. Apps Script → File → Manage versions
2. Save current version
3. You can rollback if needed

---

## ✅ Reset Complete Checklist

After resetting, verify:

- [ ] Raw Data sheet exists with headers
- [ ] Feedback sheet exists with headers
- [ ] Leaderboard sheet exists and formatted
- [ ] Weekly History sheet exists
- [ ] All-Time Stats sheet exists
- [ ] Leaderboard shows all staff names
- [ ] Formulas are intact (no #REF! errors)
- [ ] Test submission works
- [ ] Data appears in correct sheets
- [ ] Leaderboard updates correctly
- [ ] Email notification works
- [ ] All triggers active

---

## 📞 When to Use Each Method

| Situation | Method |
|-----------|--------|
| First time testing | Method 1 (Complete Reset) |
| Something broke badly | Method 1 (Complete Reset) |
| Formulas showing errors | Method 1 (Complete Reset) |
| Just clearing test data | Method 2 (Clear Data Only) |
| Going live after testing | Method 2 (Clear Data Only) |
| Monthly cleanup | Method 2 (Clear Data Only) |
| Annual fresh start | Method 1 (Complete Reset) |

---

**Remember:** Method 1 is safer but requires re-running triggers. Method 2 is faster but requires careful row selection.

**Last Updated:** 2025-11-11
**Status:** ✅ Ready to Use
