# La Estancia Review Tracking Setup Guide

## Overview
This system tracks when NFC cards are scanned and logs the data directly to Google Sheets without any third-party software. Each time someone scans an NFC card with a staff member's code, it will be recorded in your Google Sheet.

---

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Name it something like "La Estancia Review Tracker"
4. Leave the sheet empty (the script will auto-create headers)

---

## Step 2: Set Up the Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. You'll see a code editor with some default code
3. **Delete all the default code**
4. Open the file `GoogleAppsScript.gs` from this repository
5. **Copy all the code** from `GoogleAppsScript.gs`
6. **Paste it** into the Apps Script editor
7. Click the **💾 Save** icon (or press Ctrl+S / Cmd+S)
8. Name your project something like "Review Tracker"

---

## Step 3: Deploy the Web App

1. In the Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: "Review tracking webhook" (optional)
   - **Execute as**: Select **Me** (your email)
   - **Who has access**: Select **Anyone**
5. Click **Deploy**
6. You may see an authorization screen:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to [Your Project Name] (unsafe)**
   - Click **Allow**
7. **IMPORTANT**: Copy the **Web app URL** that appears
   - It will look like: `https://script.google.com/macros/s/AKfycby.../exec`
   - Save this URL somewhere safe

---

## Step 4: Update review.html

1. Open `review.html` in a text editor
2. Find this line near the top of the `<script>` section:
   ```javascript
   const WEBHOOK_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with your Web App URL from Step 3
4. Example:
   ```javascript
   const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby.../exec";
   ```
5. Save the file

---

## Step 5: Deploy Your Website

Upload the updated `review.html` file to your web hosting:
- GitHub Pages
- Netlify
- Vercel
- Your own web server

Make sure the URL matches what's programmed on your NFC cards.

---

## Step 6: Test the System

1. Visit your review page with a staff code parameter:
   ```
   https://your-domain.com/review.html?card=EDUARDO001
   ```
2. Check your Google Sheet - you should see a new row with:
   - Timestamp
   - Staff Code (EDUARDO001)
   - Staff Name (Eduardo)
   - Card Scanned (Yes)
   - Date
   - Time

---

## Understanding Your Data

### Google Sheet Columns

| Column | Description |
|--------|-------------|
| **Timestamp** | Full date and time of the scan |
| **Staff Code** | The unique code from the NFC card |
| **Staff Name** | The staff member's name |
| **Card Scanned** | "Yes" if a valid card was scanned, "No" if accessed directly |
| **Date** | Date in YYYY-MM-DD format |
| **Time** | Time in HH:MM:SS format |

### Tracking What the Sheet Shows

- **Each row = One NFC card scan**
- The sheet automatically creates headers on first use
- Data is logged in real-time when someone scans a card
- You can see who's getting reviews by looking at which staff codes appear most

---

## Creating Reports

### Who's Getting Reviews?
1. In Google Sheets, select column B (Staff Name)
2. Click **Data** → **Pivot table**
3. Add "Staff Name" as Row
4. Add "Staff Name" as Value (COUNTA)
5. This shows you a count of reviews per staff member

### Daily/Weekly Tracking
1. Use the Date column to filter by date range
2. Click the filter icon on column E (Date)
3. Select date ranges to analyze

---

## Troubleshooting

### Data Not Appearing in Sheet?

1. **Check the Web App URL**: Make sure you copied it correctly into review.html
2. **Check Apps Script permissions**: Redeploy if needed
3. **Test the webhook directly**: Paste the Web App URL in a browser - you should see "La Estancia Review Tracker is running"

### Getting Authorization Errors?

1. Go back to Apps Script
2. Click **Deploy** → **Manage deployments**
3. Click **Edit** (pencil icon)
4. Make sure "Who has access" is set to **Anyone**
5. Click **Deploy**

### Need to Update the Script?

1. Make changes in the Apps Script editor
2. Click **Deploy** → **Manage deployments**
3. Click **Edit** → **Version**: **New version**
4. Click **Deploy**
5. **No need to update the URL** - it stays the same!

---

## Privacy & Security Notes

- Data is stored in your Google account only
- No third-party services are involved
- The webhook URL is public but only accepts scan data
- Anyone with the URL can view your Google Sheet only if you share it

---

## NFC Card URLs

Make sure your NFC cards are programmed to open:
```
https://your-domain.com/review.html?card=STAFFCODE
```

Replace:
- `your-domain.com` with your actual domain
- `STAFFCODE` with the staff member's code (e.g., EDUARDO001)

Example:
```
https://laestancia.com/review.html?card=EDUARDO001
```

---

## Adding New Staff Members

To add a new staff member to the system:

1. Open `review.html`
2. Find the `STAFF` object in the JavaScript section
3. Add a new line in this format:
   ```javascript
   "NEWCODE": "Staff Name",
   ```
4. Example:
   ```javascript
   const STAFF = {
     "EDUARDO001": "Eduardo",
     "PEDROLOPEZ002": "Pedro López",
     "NEWSTAFF013": "Maria Garcia",  // New staff member
     ...
   };
   ```
5. Save and redeploy the file
6. Program a new NFC card with the URL: `?card=NEWSTAFF013`

---

## Support

If you run into issues:
1. Check that the Web App URL is correct
2. Verify your NFC cards have the right URL format
3. Test by visiting the URL directly in a browser
4. Check the browser console (F12) for any error messages

The system is designed to fail silently - if tracking fails, users will still be redirected to leave a review.
