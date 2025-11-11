# EMAIL SETUP GUIDE - La Estancia Review System

## ✅ YES, Email Functionality WILL Work!

Google Apps Script has **built-in email functionality** through `MailApp.sendEmail()`. No external setup needed!

---

## 📧 How Email Works in Google Apps Script

When you run the script from your Google Account, it automatically has permission to send emails **on your behalf**. The emails will come from **your Gmail account** (the one that owns the Google Sheet).

### What Emails You'll Receive:

1. **⚠️ Low Rating Alerts** (Instant)
   - Triggers when customer gives 1-4 stars
   - Contains customer feedback
   - Shows which staff member

2. **🏆 Weekly Winner** (Monday 12:00 AM)
   - Announces last week's winner
   - Shows top 5 performers

3. **📊 Weekly Report** (Monday 8:00 AM)
   - Full week performance breakdown
   - Staff rankings
   - Recent feedback highlights

4. **📊 Monthly Report** (1st of month 9:00 AM)
   - Comprehensive 30-day analysis
   - Rating distribution
   - Recommendations

---

## 🔧 SETUP INSTRUCTIONS (Step-by-Step)

### Step 1: Update Manager Email

1. Open your Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Find **Line 21** at the top of the script:
   ```javascript
   const MANAGER_EMAIL = "manager@laestancia.com";
   ```
4. Replace `manager@laestancia.com` with **YOUR ACTUAL EMAIL**:
   ```javascript
   const MANAGER_EMAIL = "your.email@gmail.com";
   ```
5. Click **Save** (💾 icon)

---

### Step 2: Initialize All Sheets

1. In Apps Script, find the dropdown at the top (says "Select function")
2. Select **initializeSheet**
3. Click **Run** (▶ play button)
4. **First time only**: You'll see a permission dialog:
   - Click **Review Permissions**
   - Choose your Google account
   - Click **Advanced**
   - Click **"Go to [Your Project Name] (unsafe)"**
   - Click **Allow**
5. Wait for completion (you'll see "Execution completed" at bottom)
6. Check your Google Sheet - you should now have 5 sheets:
   - **Leaderboard** (Sheet 1)
   - **Raw Data** (Sheet 2)
   - **Feedback** (Sheet 3) - For bad reviews
   - **Weekly History** (Sheet 4) - Past weeks archive
   - **All-Time Stats** (Sheet 5) - Running totals

---

### Step 3: Activate Weekly Archive & Reset

1. In the function dropdown, select **setupWeeklyArchive**
2. Click **Run** (▶)
3. You'll see: "Weekly archive activated!"
4. This sets up:
   - Monday midnight: Archive last week
   - Monday midnight: Send winner email
   - Monday midnight: Reset weekly competition

---

### Step 4: Activate Weekly Reports

1. Select **setupWeeklyReports** from dropdown
2. Click **Run** (▶)
3. You'll see: "Weekly reports activated!"
4. Every Monday 8 AM: Performance report email

---

### Step 5: Activate Monthly Reports

1. Select **setupMonthlyReports** from dropdown
2. Click **Run** (▶)
3. You'll see: "Monthly reports activated!"
4. Every 1st of month 9 AM: Comprehensive report email

---

### Step 6: Redeploy the Web App

1. Click **Deploy** → **Manage Deployments**
2. Click the **Edit** icon (✏️ pencil)
3. Under "Version", select **New version**
4. Click **Deploy**
5. Copy the URL (should be the same as before)

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Manager email updated to your real email
- [ ] `initializeSheet` completed successfully
- [ ] 5 sheets exist (Leaderboard, Raw Data, Feedback, Weekly History, All-Time Stats)
- [ ] `setupWeeklyArchive` activated
- [ ] `setupWeeklyReports` activated
- [ ] `setupMonthlyReports` activated
- [ ] Web app redeployed with new version

---

## 🧪 Testing Email Functionality

### Test Low Rating Alert:

1. Open your `review.html` in a browser
2. Add `?card=EDUARDO001` to the URL
3. Click **3 stars** (or lower)
4. Fill out the feedback form
5. Submit
6. **Check your email** - you should receive an alert within seconds!

### Test Manual Reports:

You can manually trigger any report to test:

1. In Apps Script, select function from dropdown:
   - `sendWeeklyReport`
   - `sendMonthlyReport`
   - `archiveAndResetWeeklyLeaderboard` (sends winner email)
2. Click **Run**
3. Check your email

---

## 📍 Sheet Locations

Your sheets are organized like this:

```
Your Google Spreadsheet
├── Leaderboard (Main view - Sheet 1)
│   ├── THIS WEEK'S COMPETITION (Left)
│   └── ALL-TIME TOTALS (Right)
│
├── Raw Data (Sheet 2)
│   └── Every scan with timestamp & rating
│
├── Feedback (Sheet 3) ⚠️ BAD REVIEWS
│   └── Customer complaints from low ratings
│
├── Weekly History (Sheet 4)
│   └── Archive of past weekly winners
│
└── All-Time Stats (Sheet 5)
    └── Detailed rating breakdowns
```

---

## ❓ Common Questions

### Q: Will emails work if I close my browser?
**A: YES!** Once triggers are set up, they run automatically in Google's cloud. You don't need to keep anything open.

### Q: Who sends the emails?
**A: Your Gmail account.** The emails come from the Google account that owns the spreadsheet.

### Q: Can I send to multiple emails?
**A: YES!** Change line 21 to:
```javascript
const MANAGER_EMAIL = "manager1@email.com, manager2@email.com, manager3@email.com";
```

### Q: How do I test if emails work?
**A:** Manually run `sendWeeklyReport` from the Apps Script dropdown and check your inbox.

### Q: What if I don't receive emails?
**A: Check:**
1. Spam/junk folder
2. Manager email is correct (line 21)
3. Triggers are set up (Extensions → Apps Script → Triggers tab)
4. Script has email permissions (should have asked during first run)

### Q: Can I customize email content?
**A: YES!** Edit the email functions:
- `sendFeedbackEmail()` - Low rating alerts
- `sendWeeklyWinnerEmail()` - Winner announcement
- `sendWeeklyReport()` - Weekly performance
- `sendMonthlyReport()` - Monthly analysis

---

## 🎯 What Happens Automatically

Once setup is complete, here's the automatic schedule:

| Time | Action | What Happens |
|------|--------|--------------|
| **When customer gives <5 stars** | Instant Alert | Manager receives email with feedback |
| **Monday 12:00 AM** | Weekly Archive | Last week archived, winner announced via email |
| **Monday 8:00 AM** | Weekly Report | Performance report sent to manager |
| **1st of month 9:00 AM** | Monthly Report | Comprehensive analysis sent to manager |

---

## 🔐 Security & Privacy

- Emails sent from **your Gmail account**
- Only **you** (the sheet owner) can see the data
- Customer feedback is **private** (only in your sheet)
- No third-party services involved
- All data stored in **your Google Drive**

---

## 💡 Pro Tips

1. **Add to favorites**: Bookmark the Google Sheet for quick access
2. **Mobile access**: Google Sheets app lets you view leaderboard on phone
3. **Share with staff**: Share the Leaderboard sheet (read-only) with staff to increase motivation
4. **Export history**: Download Weekly History as CSV for external analysis
5. **Custom reports**: Manually run `sendWeeklyReport` anytime you want a status update

---

## 🆘 Troubleshooting

### Problem: "initializeSheet" not working
**Solution:** Make sure you:
1. Saved the script (Ctrl+S / Cmd+S)
2. Granted all permissions when prompted
3. Are connected to internet

### Problem: Sheets not appearing
**Solution:**
1. Refresh your Google Sheet tab
2. Check if sheets are just hidden (right-click sheet tabs)
3. Re-run `initializeSheet`

### Problem: Emails not sending
**Solution:**
1. Check line 21 has correct email
2. Run `sendWeeklyReport` manually to test
3. Check Apps Script execution logs (View → Executions)
4. Verify triggers exist (Extensions → Apps Script → Triggers)

---

## ✨ You're All Set!

Once you complete the setup steps above, your system will:

✅ Track all customer reviews automatically
✅ Send instant alerts for low ratings
✅ Reset weekly competition every Monday
✅ Archive historical data forever
✅ Send automated performance reports
✅ Motivate staff with competitive leaderboard

**No third-party software. No monthly fees. All built-in Google tools!**
