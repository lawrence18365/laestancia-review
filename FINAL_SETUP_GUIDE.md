# 🎉 Final Setup Guide - La Estancia Review System

## System Overview

Your review tracking system is now **complete** and **production-ready** with:

✅ **Raw Data Tracking** - Every scan recorded with timestamp and rating
✅ **Weekly Leaderboard** - Resets every Monday, tracks current week
✅ **All-Time Statistics** - Historical data preserved forever
✅ **Feedback Collection** - Low ratings (1-4 stars) trigger feedback form
✅ **Email Notifications** - Instant alerts to manager for low ratings
✅ **CORS-Proof** - Works reliably with static hosting
✅ **Automated Reports** - Weekly and monthly performance emails

---

## 📋 Complete Setup Checklist

### Part 1: Google Sheets Configuration

#### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "La Estancia Review Tracker"

#### Step 2: Install the Apps Script
1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code
3. Copy **ALL** the code from `GoogleAppsScript.gs` in this repository
4. Paste it into the Apps Script editor
5. Click **Save** (💾 icon)
6. Name the project "La Estancia Tracker"

#### Step 3: Initialize the System
1. In the function dropdown, select **initializeSheet**
2. Click **Run** (▶ play button)
3. **First time:** Grant permissions when prompted:
   - Click "Review Permissions"
   - Choose your Google account
   - Click "Advanced"
   - Click "Go to [Project Name] (unsafe)"
   - Click "Allow"
4. Wait for "Execution completed"
5. Verify 5 sheets were created:
   - **Leaderboard** (Main view)
   - **Raw Data** (All scans)
   - **Feedback** (Customer complaints)
   - **Weekly History** (Archive)
   - **All-Time Stats** (Lifetime totals)

#### Step 4: Set Up Automated Features
Run these functions **ONE TIME EACH**:

1. Select **setupWeeklyArchive** from dropdown, click Run
   - Archives last week every Monday midnight
   - Sends winner announcement email
   - Resets weekly competition

2. Select **setupWeeklyReports** from dropdown, click Run
   - Sends performance report every Monday 8 AM

3. Select **setupMonthlyReports** from dropdown, click Run
   - Sends comprehensive report 1st of month at 9 AM

#### Step 5: Deploy the Web App
1. Click **Deploy** → **New deployment**
2. Click gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone ⚠️ **CRITICAL**
5. Click **Deploy**
6. **COPY THE WEB APP URL** - looks like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
7. Save this URL - you'll need it next!

---

### Part 2: Website Configuration

#### Step 6: Update review.html
1. Open `review.html` in your code editor
2. Find line ~150 (look for `const WEBHOOK_URL`)
3. Replace the URL with your Web App URL from Step 5:
   ```javascript
   const WEBHOOK_URL = "https://script.google.com/macros/s/YOUR_ID/exec";
   ```
4. Save the file

#### Step 7: Update feedback.html
1. Open `feedback.html` in your code editor
2. Find line ~196 (look for `const WEBHOOK_URL`)
3. Replace with the **same URL** from Step 5:
   ```javascript
   const WEBHOOK_URL = "https://script.google.com/macros/s/YOUR_ID/exec";
   ```
4. Save the file

#### Step 8: Deploy Your Website
Upload both HTML files to your hosting platform:
- **GitHub Pages** (current)
- Netlify
- Vercel
- Your own server

Make sure the URL matches what's programmed on your NFC cards.

---

## 🧪 Testing Everything

### Test 1: Apps Script Endpoint
1. Visit your Web App URL directly in browser
2. Expected result: "La Estancia Review Tracker is running"
3. ❌ If you see an error → Check deployment settings

### Test 2: 5-Star Rating
1. Visit: `https://your-site.com/review.html?card=EDUARDO001`
2. Click 5 stars
3. Expected: Redirect to Google Reviews
4. Verify: New row in "Raw Data" sheet with rating 5
5. Verify: Leaderboard updates

### Test 3: Low Rating with Feedback
1. Visit: `https://your-site.com/review.html?card=PEDROLOPEZ002`
2. Click 3 stars
3. Expected: Redirect to feedback form
4. Fill out form with test feedback
5. Submit form
6. Verify: New row in "Raw Data" sheet with rating 3
7. Verify: New row in "Feedback" sheet with your feedback
8. Verify: Email received at **lbarwe1@gmail.com** 📧

### Test 4: Weekly Reports (Optional)
1. Go to Apps Script
2. Select **sendWeeklyReport** from dropdown
3. Click Run
4. Check email at **lbarwe1@gmail.com**
5. Should receive detailed performance report

---

## 📊 Understanding Your Google Sheets

### Leaderboard Sheet (Main View)

**Left Side - THIS WEEK'S COMPETITION:**
- Shows current week (Monday to Sunday)
- Resets every Monday midnight
- Top 3 highlighted (Gold, Silver, Bronze)
- Columns: Rank, Staff Name, This Week Count, Avg Rating, Status

**Right Side - ALL-TIME TOTALS:**
- Never resets
- Historical data since day one
- Top 3 highlighted (Gold, Silver, Bronze)
- Columns: Rank, Staff Name, Total Reviews, Avg Rating, Last Scan

### Raw Data Sheet
Every single scan is recorded here with:
- Timestamp (full date and time)
- Staff Code (EDUARDO001, etc.)
- Staff Name
- **Rating** (1-5 stars)
- Date (YYYY-MM-DD)
- Time (HH:MM:SS)

**This sheet NEVER deletes data** - it's your permanent record.

### Feedback Sheet (⚠️ Attention Needed)
Low ratings (1-4 stars) with customer feedback:
- Timestamp
- Rating (1-4)
- Staff Code
- Staff Name
- Customer Name (if provided)
- Customer Email (if provided)
- **Feedback Text** (what customer said)
- Status (New/Reviewed)
- Date

### Weekly History Sheet
Archive of past weekly competitions:
- Week Start Date
- Week End Date
- Staff Name
- Total Reviews that week
- Average Rating
- 5-Star Count
- Low Ratings count
- **Rank** (their placement that week)

New rows added every Monday when the week archives.

### All-Time Stats Sheet
Detailed breakdown by star rating:
- Rank
- Staff Name
- Total Reviews
- Average Rating
- 5-Star count
- 4-Star count
- 3-Star count
- 2-Star count
- 1-Star count

Updates automatically with each new review.

---

## 📧 Email Notifications

You (lbarwe1@gmail.com) will receive:

### 1. Instant Low Rating Alerts
**When:** Customer gives 1-4 stars and submits feedback
**Contains:**
- Rating (1-4 stars)
- Staff member name and code
- Customer name and email (if provided)
- Full feedback text
- Timestamp

**Example:**
```
Subject: ⚠️ Low Rating Alert - 3 stars from Pedro López's customer

⭐ Rating: 3/5 stars
👤 Staff Member: Pedro López
📅 Date: 11/11/2025 10:30 AM

FEEDBACK:
"The food was good but service was slow..."
```

### 2. Weekly Winner Announcement
**When:** Every Monday at 12:00 AM (midnight)
**Contains:**
- Last week's winner
- Winner's stats (total reviews, avg rating)
- Top 5 performers
- Announcement of new week

### 3. Weekly Performance Report
**When:** Every Monday at 8:00 AM
**Contains:**
- Total customer interactions last week
- Staff performance rankings
- Average ratings per staff
- Recent feedback highlights

### 4. Monthly Comprehensive Report
**When:** 1st of each month at 9:00 AM
**Contains:**
- 30-day performance summary
- Rating distribution (% of 5-star, 4-star, etc.)
- Top performers breakdown
- Complete staff analysis
- Recommendations based on data

---

## 🔧 Maintaining Your System

### Adding New Staff Members

1. **Update review.html** (around line 154):
   ```javascript
   const STAFF = {
     "EDUARDO001": "Eduardo",
     "PEDROLOPEZ002": "Pedro López",
     "NEWSTAFF013": "Maria Garcia",  // ← Add new line
     ...
   };
   ```

2. **Update GoogleAppsScript.gs** (lines 181-184, 415-418, 1041-1044):
   Find the staff array and add the new name:
   ```javascript
   const staff = [
     'Eduardo', 'Pedro López', 'Pedro Orocio', 'Emiliano',
     'David', 'Leo Gasca', 'Leo Reynoso', 'Ulises',
     'Gerardo', 'Carlos', 'Julio', 'Fernando',
     'Maria Garcia'  // ← Add here
   ];
   ```

3. **Redeploy:**
   - Apps Script: Deploy → Manage → Edit → New Version
   - Website: Upload new review.html

4. **Program NFC card** with:
   ```
   https://your-site.com/review.html?card=NEWSTAFF013
   ```

### Updating Manager Email

If you need to change the notification email:

1. Open GoogleAppsScript.gs
2. Line 21: Change email address
   ```javascript
   const MANAGER_EMAIL = "newemail@gmail.com";
   ```
3. Save and deploy new version

### Adding More Manager Emails

To notify multiple people:

```javascript
const MANAGER_EMAIL = "lbarwe1@gmail.com, manager2@example.com, owner@example.com";
```

### Viewing Execution Logs

To see what's happening behind the scenes:

1. Apps Script editor
2. Left sidebar → **Executions**
3. See all runs, timestamps, and any errors

---

## 🎯 Weekly Workflow

### For Managers

**Monday Morning:**
1. Check email for weekly winner announcement (midnight)
2. Check email for performance report (8 AM)
3. Review Leaderboard sheet - see current week standings
4. Check Feedback sheet for any new issues

**Throughout Week:**
1. Monitor email for low rating alerts
2. Address customer feedback promptly
3. Update Feedback sheet status when handled
4. Check Leaderboard occasionally to motivate staff

**End of Week:**
1. Review Weekly History for past week's archive
2. Identify trends and patterns
3. Plan coaching or recognition for next week

### For Staff (Optional Sharing)

You can share the Leaderboard sheet with staff (read-only):

1. Open Google Sheet
2. Click **Share** button
3. Add staff emails
4. Set to **Viewer** (not Editor)
5. Share only the **Leaderboard** tab

Staff can see:
- Their current week performance
- Their all-time stats
- How they rank vs colleagues
- Real-time updates

**DO NOT** share Feedback sheet - keep customer feedback private.

---

## 🔐 Security & Privacy

### What's Public
- ❌ Nothing! Your data is private
- The Web App URL is technically public but:
  - Only accepts review data
  - Doesn't expose any information
  - Can only add rows to YOUR sheet

### What's Private
- ✅ All customer feedback
- ✅ Staff performance data
- ✅ Email notifications
- ✅ Google Sheet contents
- ✅ Apps Script code

### Access Control
- **Google Sheet:** Only you can see it
- **Apps Script:** Only you can edit it
- **Emails:** Only sent to lbarwe1@gmail.com
- **Data:** Stored in your Google Drive

---

## 🆘 Common Issues & Solutions

### Issue: Data not showing in Google Sheet

**Check:**
1. Is WEBHOOK_URL correct in HTML files?
2. Visit Web App URL - should say "is running"
3. Check browser console (F12) for errors
4. Verify Apps Script deployed with "Anyone" access

**Fix:**
1. Copy Web App URL from Apps Script
2. Update both HTML files
3. Redeploy website
4. Test again

### Issue: No emails received

**Check:**
1. Spam/Junk folder
2. Manager email in line 21 is correct
3. Triggers are set up (Extensions → Apps Script → Triggers tab)
4. Test by manually running `sendWeeklyReport`

**Fix:**
1. Verify lbarwe1@gmail.com in line 21
2. Re-run setupWeeklyReports, setupMonthlyReports
3. Check Apps Script Executions for errors

### Issue: CORS errors in browser console

**Check:**
1. Apps Script "Who has access" = Anyone
2. HTML files use `text/plain` content type
3. HTML files use `redirect: "follow"`

**Fix:**
1. Redeploy Apps Script with correct settings
2. See CORS_TROUBLESHOOTING.md for detailed help

### Issue: Leaderboard not updating

**Possible Causes:**
1. Data not reaching Google Sheet (see first issue)
2. Formulas broken

**Fix:**
1. Verify new rows in Raw Data sheet
2. If data is there but Leaderboard blank, re-run `initializeSheet`
3. Check that staff names in Raw Data match staff array exactly

### Issue: Weekly reset not happening

**Check:**
1. Triggers tab in Apps Script
2. Should see trigger for "archiveAndResetWeeklyLeaderboard"

**Fix:**
1. Re-run `setupWeeklyArchive` function
2. Check Executions tab for errors
3. Manually run `archiveAndResetWeeklyLeaderboard` to test

---

## 📈 Advanced Usage

### Exporting Data

You can export any sheet for external analysis:

1. Open Google Sheet
2. Select the sheet tab you want
3. File → Download → CSV/Excel/PDF

### Creating Custom Reports

Google Sheets has built-in analysis tools:

1. **Pivot Tables:** Data → Pivot table
2. **Charts:** Insert → Chart
3. **Filters:** Data → Create a filter

Example - Daily review count chart:
1. Select Raw Data sheet
2. Insert → Chart
3. Chart type: Line chart
4. X-axis: Date column
5. Y-axis: Count of rows

### Mobile Access

Install Google Sheets app on your phone:
- View leaderboard anytime
- Check raw data on the go
- Receive email notifications instantly
- Share with staff easily

---

## ✅ Post-Setup Verification

Before going live, verify:

- [ ] All 5 sheets exist in Google Sheet
- [ ] Apps Script deployed with "Anyone" access
- [ ] Web App URL returns "is running" message
- [ ] Both HTML files have correct WEBHOOK_URL
- [ ] Manager email is lbarwe1@gmail.com
- [ ] 5-star test redirects to Google Reviews
- [ ] Low rating test creates feedback entry
- [ ] Email received for low rating test
- [ ] Leaderboard updates with test data
- [ ] All-Time Stats updates with test data
- [ ] Weekly triggers are set up
- [ ] NFC cards programmed with correct URLs

---

## 🎉 You're Ready to Launch!

Your system is now complete with:

✅ **Automatic tracking** of all customer interactions
✅ **Real-time leaderboard** with weekly competition
✅ **Historical data** preserved forever
✅ **Customer feedback** collection for low ratings
✅ **Email alerts** for issues requiring attention
✅ **Automated reports** for performance analysis
✅ **CORS-proof** configuration for reliable operation
✅ **Zero cost** - all free Google tools
✅ **Scalable** - handles unlimited reviews

## 📞 Support

If you encounter issues:

1. Check this guide
2. Read CORS_TROUBLESHOOTING.md
3. Review SETUP_INSTRUCTIONS.md
4. Check Apps Script Executions tab
5. Look at browser console for errors

---

## 🔄 System Architecture Summary

```
Customer scans NFC card
         ↓
   Opens review.html?card=STAFFCODE
         ↓
   Rates 1-5 stars
         ↓
    ┌────┴────┐
    ↓         ↓
  5 stars   1-4 stars
    ↓         ↓
→ Google  → feedback.html
  Reviews    ↓
         Fill form & submit
              ↓
    ┌─────────┴─────────┐
    ↓                   ↓
Google Apps Script      Email to manager
    ↓                   lbarwe1@gmail.com
    ↓
Google Sheets
├─ Raw Data (all scans)
├─ Leaderboard (current + all-time)
├─ Feedback (complaints)
├─ Weekly History (archives)
└─ All-Time Stats (lifetime)
    ↓
Automated Reports
├─ Weekly winner (Monday 12 AM)
├─ Weekly report (Monday 8 AM)
└─ Monthly report (1st at 9 AM)
```

---

**System Version:** 2.0 - CORS-Optimized
**Last Updated:** 2025-11-11
**Status:** ✅ Production Ready

**Congratulations on completing your review tracking system!** 🎉
