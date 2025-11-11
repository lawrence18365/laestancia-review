# 🚀 QUICK START GUIDE

## 30-Second Setup

1. **Open Google Sheet** → Extensions → Apps Script
2. **Line 21**: Change email to yours
3. **Run these 4 functions** (click dropdown, select, click Run ▶):
   - `initializeSheet`
   - `setupWeeklyArchive`
   - `setupWeeklyReports`
   - `setupMonthlyReports`
4. **Deploy**: Deploy → Manage Deployments → Edit → New Version → Deploy
5. **Done!** ✅

---

## What You Get

### 📊 5 Sheets Created:
1. **Leaderboard** - Weekly competition + All-time totals
2. **Raw Data** - Every scan recorded
3. **Feedback** - Customer complaints (Sheet 3 for bad reviews)
4. **Weekly History** - Past weeks archived
5. **All-Time Stats** - Full breakdown by rating

### 📧 4 Types of Emails:
1. **Instant** - Low rating alert (when <5 stars)
2. **Monday 12 AM** - Weekly winner announcement
3. **Monday 8 AM** - Weekly performance report
4. **1st of month** - Monthly comprehensive report

---

## Email WILL Work - Here's Why

✅ **Built into Google Apps Script** (MailApp.sendEmail)
✅ **No setup needed** - automatic permission when you run script
✅ **Sends from your Gmail** - the account that owns the sheet
✅ **No third-party** services or fees
✅ **Works 24/7** - even when browser closed

---

## Test It Now

### Test Email:
1. Apps Script → Select `sendWeeklyReport` from dropdown
2. Click Run ▶
3. Check your inbox!

### Test Low Rating Alert:
1. Open review.html in browser
2. Click 3 stars or lower
3. Fill feedback form
4. Check email - instant alert!

---

## Your Sheets Explained

```
📊 LEADERBOARD (Main view)
   Left side:  THIS WEEK (resets Monday)
   Right side: ALL-TIME (never resets)
   Top 3: 🥇🥈🥉 highlighted

📝 RAW DATA
   Every scan with timestamp & rating

💬 FEEDBACK (Sheet 3 - Bad Reviews)
   Customer complaints from 1-4 star ratings

📈 WEEKLY HISTORY
   Archives every week's winners

🏆 ALL-TIME STATS
   5★ 4★ 3★ 2★ 1★ breakdown per person
```

---

## Important Settings

**Line 21 in GoogleAppsScript.gs:**
```javascript
const MANAGER_EMAIL = "YOUR_EMAIL_HERE";
```

**Line 150 in review.html:**
```javascript
const WEBHOOK_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL";
```

---

## Automatic Schedule

| Day/Time | What Happens |
|----------|--------------|
| **Anytime** | Customer gives <5 stars → Instant email |
| **Monday 12 AM** | Archive last week, send winner email |
| **Monday 8 AM** | Send weekly report |
| **1st of month 9 AM** | Send monthly report |

---

## Files You Need to Upload

Upload to your web hosting:
- `review.html` - Main review page (update webhook URL line 150)
- `feedback.html` - Feedback form

---

## Pro Tips

💡 **Share Leaderboard** - Share sheet (view-only) with staff for motivation
💡 **Mobile Access** - Google Sheets app shows leaderboard on phone
💡 **Manual Reports** - Run any report function anytime to get instant update
💡 **Export Data** - Download sheets as CSV for external analysis

---

## Troubleshooting Quick Fixes

❌ **Sheets not created?**
   → Refresh browser, re-run `initializeSheet`

❌ **No emails?**
   → Check line 21 has correct email
   → Check spam folder
   → Run `sendWeeklyReport` manually to test

❌ **Permission errors?**
   → Click "Advanced" → "Go to project" → "Allow"

---

## Success Checklist

- [ ] Manager email updated (line 21)
- [ ] Ran `initializeSheet` ✓
- [ ] Ran `setupWeeklyArchive` ✓
- [ ] Ran `setupWeeklyReports` ✓
- [ ] Ran `setupMonthlyReports` ✓
- [ ] Redeployed web app
- [ ] 5 sheets exist in Google Sheet
- [ ] Tested email (ran `sendWeeklyReport` manually)
- [ ] Updated webhook URL in review.html

---

## 🎉 You're Done!

Your system is now fully automated:
- ✅ Tracks every customer review
- ✅ Weekly competition resets automatically
- ✅ Emails sent automatically
- ✅ History archived forever
- ✅ Staff rankings updated in real-time

**No maintenance required!**
