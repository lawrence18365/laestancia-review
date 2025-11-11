# CORS Troubleshooting Guide - La Estancia Review System

## Understanding CORS and Why It's Important

**CORS (Cross-Origin Resource Sharing)** is a security feature in web browsers that prevents websites from making requests to different domains unless explicitly allowed. When your static website tries to send data to Google Sheets, browsers may block this for security reasons.

## ✅ How We've Solved CORS Issues

Your system is now configured with **battle-tested CORS workarounds** that work with Google Apps Script:

### 1. **Content-Type: text/plain** (The Key Solution)

We use `Content-Type: text/plain;charset=utf-8` instead of `application/json`. This is **critical** because:

- ✅ Browsers treat `text/plain` as a "simple request"
- ✅ Simple requests **don't trigger preflight** OPTIONS requests
- ✅ Google Apps Script doesn't handle OPTIONS requests
- ✅ Your data still gets sent as JSON (just with a different header)

**Why this works:**
```javascript
// ❌ BAD - Triggers preflight OPTIONS request that fails
headers: {
  'Content-Type': 'application/json'
}

// ✅ GOOD - No preflight, works perfectly
headers: {
  'Content-Type': 'text/plain;charset=utf-8'
}
```

### 2. **redirect: "follow"** Parameter

We include `redirect: "follow"` in all fetch requests:

```javascript
fetch(WEBHOOK_URL, {
  redirect: "follow",  // ← Required for Google Apps Script
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain;charset=utf-8',
  },
  body: JSON.stringify(data)
})
```

**Why this works:**
- Google Apps Script Web Apps often redirect during execution
- Without `redirect: "follow"`, requests may fail
- This ensures your requests follow Google's internal redirects

### 3. **Proper Response Handling**

Our Google Apps Script returns proper `ContentService` responses:

```javascript
return ContentService
  .createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Data recorded successfully'
  }))
  .setMimeType(ContentService.MimeType.JSON);
```

---

## 🔧 Deployment Checklist (CRITICAL)

### Step 1: Deploy Google Apps Script Correctly

When you update your Google Apps Script, you **MUST** deploy it properly:

1. Go to your Google Sheet
2. Click **Extensions** → **Apps Script**
3. After making changes, click **Deploy** → **Manage deployments**
4. Click the **Edit** icon (✏️ pencil) next to your deployment
5. Under "Version", select **New version**
6. Click **Deploy**
7. **IMPORTANT:** Copy the Web App URL (it should stay the same)

**CRITICAL DEPLOYMENT SETTINGS:**
- ✅ **Execute as:** Me (your Google account)
- ✅ **Who has access:** Anyone

If these settings are wrong, you'll get CORS errors!

### Step 2: Update WEBHOOK_URL in Your HTML Files

Make sure both `review.html` and `feedback.html` have the **same Web App URL**:

```javascript
const WEBHOOK_URL = "https://script.google.com/macros/s/YOUR_ID/exec";
```

⚠️ **Common Mistake:** Using the wrong URL or leaving the placeholder URL.

### Step 3: Test the Connection

1. Open your browser's Developer Console (F12)
2. Go to the **Console** tab
3. Visit your review page: `https://your-site.com/review.html?card=EDUARDO001`
4. Click a star rating
5. Check the console for messages:
   - ✅ "Tracking successful" = Working!
   - ❌ "CORS error" = See troubleshooting below

---

## 🐛 Common CORS Errors and Solutions

### Error: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**Cause:** Google Apps Script deployment settings are incorrect

**Solution:**
1. Open Apps Script
2. Go to **Deploy** → **Manage deployments**
3. Click **Edit** (✏️)
4. Set **Who has access** to **Anyone**
5. Create **New version**
6. Click **Deploy**

### Error: "No 'Access-Control-Allow-Origin' header is present"

**Cause:** Using `application/json` instead of `text/plain`

**Solution:**
- Verify your HTML files use: `'Content-Type': 'text/plain;charset=utf-8'`
- Already fixed in the latest version!

### Error: "Failed to fetch" or "Network error"

**Possible Causes:**
1. Wrong WEBHOOK_URL
2. Google Apps Script not deployed
3. Internet connection issues

**Solution:**
1. Copy your Web App URL from Apps Script
2. Paste it directly in browser - you should see: "La Estancia Review Tracker is running"
3. If that works, update the WEBHOOK_URL in your HTML files
4. If that doesn't work, redeploy your Apps Script

### Error: Script returns HTML instead of JSON

**Cause:** Authorization error or script not deployed correctly

**Solution:**
1. Visit your Web App URL directly in a browser
2. Complete any authorization prompts
3. Redeploy with **New version**
4. Make sure "Execute as: Me" is selected

---

## 🧪 Testing Your Setup

### Quick Test Procedure

1. **Test the Apps Script directly:**
   ```
   Visit: https://script.google.com/macros/s/YOUR_ID/exec
   Expected: "La Estancia Review Tracker is running"
   ```

2. **Test a rating submission:**
   ```
   Visit: https://your-site.com/review.html?card=EDUARDO001
   Action: Click any star rating
   Check: Console should show "Tracking successful"
   Verify: New row appears in Google Sheet "Raw Data"
   ```

3. **Test a feedback submission:**
   ```
   Visit: https://your-site.com/review.html?card=EDUARDO001
   Action: Click 3 stars or below
   Fill: Feedback form
   Submit: Form
   Check: Console shows "Feedback submitted successfully"
   Verify: New row in "Feedback" sheet
   Verify: Email sent to lbarwe1@gmail.com
   ```

---

## 📊 Understanding the Complete Data Flow

Here's what happens when a customer scans a card:

### 5-Star Rating Flow:
```
Customer scans NFC card
    ↓
Opens review.html?card=EDUARDO001
    ↓
Clicks 5 stars
    ↓
Data sent to Google Apps Script (CORS-compatible)
    ↓
Recorded in "Raw Data" sheet
    ↓
Leaderboard auto-updates
    ↓
Redirect to Google Reviews
```

### Low Rating (1-4 stars) Flow:
```
Customer scans NFC card
    ↓
Opens review.html?card=EDUARDO001
    ↓
Clicks 1-4 stars
    ↓
Data sent to Google Apps Script
    ↓
Recorded in "Raw Data" sheet
    ↓
Redirect to feedback.html
    ↓
Customer fills out feedback form
    ↓
Feedback sent to Google Apps Script (CORS-compatible)
    ↓
Recorded in "Feedback" sheet
    ↓
Email sent to manager (lbarwe1@gmail.com)
```

---

## 🔐 Security Notes

### Why "Anyone" Access is Safe

You might worry about setting "Who has access: Anyone" in your deployment. Here's why it's safe:

✅ **The script only accepts data** - it doesn't expose sensitive information
✅ **Data goes to YOUR Google Sheet** - only you can see it
✅ **No authentication tokens** are exposed
✅ **Even if someone finds the URL**, they can only submit ratings/feedback
✅ **You control the script** - you can change or disable it anytime

### Additional Security Measures

1. **Rate Limiting:** Google automatically rate-limits Apps Script requests
2. **Script Ownership:** Only you can edit the script
3. **Data Privacy:** Customer feedback is private in your Google Sheet
4. **Email Notifications:** You're immediately alerted to any issues

---

## 📚 Additional Resources

### Understanding CORS
- CORS happens in the **browser**, not on the server
- Static sites (GitHub Pages, Netlify) trigger CORS more often
- Using `text/plain` is a standard workaround for this limitation

### Google Apps Script Limitations
- Cannot respond to OPTIONS preflight requests
- Requires specific deployment settings
- Must return ContentService objects for proper responses

### Why Third-Party CORS Proxies Are Bad
Some guides suggest using CORS proxies like `cors-anywhere.herokuapp.com`:
- ❌ Exposes your data to third parties
- ❌ Unreliable (proxies go down)
- ❌ Slower (extra network hop)
- ✅ Our solution keeps everything between you and Google

---

## 🆘 Still Having Issues?

### Debug Checklist

- [ ] Web App URL is correct in both HTML files
- [ ] Apps Script deployed with "New version"
- [ ] "Who has access" set to "Anyone"
- [ ] "Execute as" set to "Me"
- [ ] Browser console shows the actual error
- [ ] Visiting Web App URL directly shows "is running" message
- [ ] HTML files use `text/plain` content type
- [ ] HTML files use `redirect: "follow"`

### Getting More Information

To see detailed errors:

1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Click **Clear Console**
4. Perform the action (rate or submit feedback)
5. Look for red error messages
6. Copy the full error text

### Common Non-CORS Issues

Sometimes errors look like CORS but aren't:

- **Script Errors:** Check Apps Script logs (View → Executions)
- **Missing Sheets:** Run `initializeSheet` function
- **Wrong Data Format:** Verify JSON structure
- **Permissions:** Re-authorize the script

---

## ✨ Your System is Now CORS-Proof!

The configuration you have now uses industry best practices for avoiding CORS issues with Google Apps Script:

✅ Uses `text/plain` to prevent preflight requests
✅ Uses `redirect: "follow"` for Google's redirects
✅ Returns proper ContentService responses
✅ Logs errors for debugging
✅ Fails gracefully without breaking user experience
✅ Works on all static hosting platforms (GitHub Pages, Netlify, Vercel, etc.)

**Your system will work reliably as long as:**
1. Apps Script is deployed correctly
2. WEBHOOK_URL matches your deployment
3. The "Anyone" access setting remains

---

## 🎯 Quick Reference

### What You Need to Change (If Ever)

**In Google Apps Script:**
```javascript
const MANAGER_EMAIL = "lbarwe1@gmail.com"; // Line 21
```

**In review.html and feedback.html:**
```javascript
const WEBHOOK_URL = "YOUR_WEB_APP_URL_HERE"; // Near top of <script>
```

### What You Should NEVER Change

**Don't touch these unless you know what you're doing:**
- `Content-Type: text/plain;charset=utf-8`
- `redirect: "follow"`
- The doPost function structure
- The ContentService return statements

---

**Last Updated:** 2025-11-11
**System Status:** ✅ CORS-Compatible and Production-Ready
