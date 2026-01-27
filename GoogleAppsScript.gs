/**
 * Google Apps Script for La Estancia Review Tracking
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any default code and paste this entire script
 * 4. Save the script
 * 5. UPDATE THE MANAGER_EMAIL BELOW with your actual email
 * 6. Click the "initializeSheet" function in the dropdown and click Run (play button)
 * 7. Click "setupWeeklyReports" to set up automated weekly reports
 * 8. Click "setupMonthlyReports" to set up automated monthly reports
 * 9. Click Deploy > Manage Deployments > Edit > New Version > Deploy
 * 10. Copy your Web App URL (it should stay the same)
 * 11. Replace WEBHOOK_URL in review.html with your Web App URL
 */

// ========================================
// CONFIGURATION - UPDATE THIS!
// ========================================
const MANAGER_EMAIL = "lbarwe1@gmail.com"; // Manager email for notifications

// Admin password for staff management (change this!)
const ADMIN_PASSWORD = "laestancia2024";

/**
 * Run this function ONCE to set up your sheets
 * Click the function name in the dropdown above, then click the Run button (▶)
 */
function initializeSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Get or create Raw Data sheet
  let rawDataSheet = ss.getSheetByName('Raw Data');
  if (!rawDataSheet) {
    rawDataSheet = ss.getSheets()[0];
    if (rawDataSheet.getName() !== 'Raw Data') {
      rawDataSheet.setName('Raw Data');
    }
  }

  // Get or create Leaderboard sheet
  let leaderboardSheet = ss.getSheetByName('Leaderboard');
  if (!leaderboardSheet) {
    leaderboardSheet = ss.insertSheet('Leaderboard');
  }

  // Get or create Feedback sheet
  let feedbackSheet = ss.getSheetByName('Feedback');
  if (!feedbackSheet) {
    feedbackSheet = ss.insertSheet('Feedback');
  }

  // Get or create Weekly History sheet
  let weeklyHistorySheet = ss.getSheetByName('Weekly History');
  if (!weeklyHistorySheet) {
    weeklyHistorySheet = ss.insertSheet('Weekly History');
  }

  // Get or create All-Time Stats sheet
  let allTimeStatsSheet = ss.getSheetByName('All-Time Stats');
  if (!allTimeStatsSheet) {
    allTimeStatsSheet = ss.insertSheet('All-Time Stats');
  }

  // Get or create Staff sheet
  let staffSheet = ss.getSheetByName('Staff');
  if (!staffSheet) {
    staffSheet = ss.insertSheet('Staff');
  }

  // Setup Staff sheet FIRST (other sheets depend on it)
  setupStaffSheet(staffSheet);

  // Setup Raw Data sheet
  setupRawDataSheet(rawDataSheet);

  // Setup Leaderboard sheet (now with current week + all-time)
  setupLeaderboardSheet(leaderboardSheet, rawDataSheet);

  // Setup Feedback sheet
  setupFeedbackSheet(feedbackSheet);

  // Setup Weekly History sheet
  setupWeeklyHistorySheet(weeklyHistorySheet);

  // Setup All-Time Stats sheet
  setupAllTimeStatsSheet(allTimeStatsSheet, rawDataSheet);

  // Make Leaderboard the active sheet
  ss.setActiveSheet(leaderboardSheet);

  SpreadsheetApp.getUi().alert('✅ Sheets initialized!\n\n📊 Leaderboard - Current week + All-time\n📝 Raw Data - All timestamps\n💬 Feedback - Customer feedback\n📈 Weekly History - Past weeks archived\n🏆 All-Time Stats - Running totals\n👥 Staff - Manage your team');
}

function setupRawDataSheet(sheet) {
  // Clear and setup headers
  if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() !== 'Timestamp') {
    sheet.clear();

    // Add headers - Added Rating column
    sheet.appendRow([
      'Timestamp',
      'Staff Code',
      'Staff Name',
      'Rating',
      'Date',
      'Time'
    ]);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, 6);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1c1a18');
    headerRange.setFontColor('#e6c07b');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    headerRange.setBorder(true, true, true, true, false, false, '#e6c07b', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

    // Set column widths
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 120);
    sheet.setColumnWidth(3, 150);
    sheet.setColumnWidth(4, 80);
    sheet.setColumnWidth(5, 110);
    sheet.setColumnWidth(6, 90);

    // Freeze header
    sheet.setFrozenRows(1);
  }
}

function setupFeedbackSheet(sheet) {
  if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() !== 'Timestamp') {
    sheet.clear();

    // Add headers
    sheet.appendRow([
      'Timestamp',
      'Rating',
      'Staff Code',
      'Staff Name',
      'Customer Name',
      'Customer Email',
      'Feedback',
      'Status',
      'Date'
    ]);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, 9);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#d32f2f');
    headerRange.setFontColor('#ffffff');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    headerRange.setBorder(true, true, true, true, false, false, '#ffffff', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

    // Set column widths
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 60);
    sheet.setColumnWidth(3, 120);
    sheet.setColumnWidth(4, 130);
    sheet.setColumnWidth(5, 130);
    sheet.setColumnWidth(6, 180);
    sheet.setColumnWidth(7, 350);
    sheet.setColumnWidth(8, 100);
    sheet.setColumnWidth(9, 100);

    // Freeze header
    sheet.setFrozenRows(1);
  }
}

function setupLeaderboardSheet(sheet, rawDataSheet) {
  sheet.clear();

  // Get current week dates
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  // Title
  sheet.getRange('A1').setValue('🏆 LA ESTANCIA REVIEW LEADERBOARD');
  sheet.getRange('A1').setFontSize(18).setFontWeight('bold').setFontColor('#e6c07b');
  sheet.getRange('A1:J1').merge();

  sheet.getRange('A2').setValue(`Current Week: ${monday.toLocaleDateString('es-MX')} - Present | Resets every Monday`);
  sheet.getRange('A2').setFontSize(10).setFontColor('#999999');
  sheet.getRange('A2:J2').merge();

  // Get staff from Staff sheet (dynamic)
  const staffMap = getStaffList();
  const staff = Object.values(staffMap);

  // ===== THIS WEEK SECTION =====
  sheet.getRange('A4').setValue('📅 THIS WEEK\'S COMPETITION');
  sheet.getRange('A4').setFontSize(14).setFontWeight('bold').setFontColor('#e6c07b');
  sheet.getRange('A4:E4').merge().setBackground('#1c1a18');

  const weekHeaders = ['Rank', 'Staff Name', 'This Week', 'Avg Rating', 'Status'];
  sheet.getRange(5, 1, 1, 5).setValues([weekHeaders]);
  sheet.getRange(5, 1, 1, 5)
    .setFontWeight('bold')
    .setBackground('#e6c07b')
    .setFontColor('#000000')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setBorder(true, true, true, true, false, false, '#000000', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  const weekStartRow = 6;

  // Create formulas for THIS WEEK
  for (let i = 0; i < staff.length; i++) {
    const row = weekStartRow + i;
    const staffName = staff[i];

    // Rank
    sheet.getRange(row, 1).setValue(i + 1);

    // Staff Name
    sheet.getRange(row, 2).setValue(staffName);

    // This Week Count - Use helper column calculation
    const mondayStr = Utilities.formatDate(monday, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    sheet.getRange(row, 3).setFormula(
      `=COUNTIFS('Raw Data'!C:C,"${staffName}",'Raw Data'!E:E,">="&DATE(${monday.getFullYear()},${monday.getMonth()+1},${monday.getDate()}))`
    );

    // Avg Rating This Week
    sheet.getRange(row, 4).setFormula(
      `=IF(C${row}>0,ROUND(AVERAGEIFS('Raw Data'!D:D,'Raw Data'!C:C,"${staffName}",'Raw Data'!E:E,">="&DATE(${monday.getFullYear()},${monday.getMonth()+1},${monday.getDate()})),1),"-")`
    );

    // Status
    sheet.getRange(row, 5).setFormula(
      `=IF(C${row}=0,"No scans",IF(C${row}>=10,"🔥 Hot","Active"))`
    );
  }

  // Format THIS WEEK data
  const weekDataRange = sheet.getRange(weekStartRow, 1, staff.length, 5);
  weekDataRange.setBorder(true, true, true, true, true, true, '#333333', SpreadsheetApp.BorderStyle.SOLID);

  sheet.getRange(weekStartRow, 1, staff.length, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontSize(14);
  sheet.getRange(weekStartRow, 2, staff.length, 1).setFontWeight('bold');
  sheet.getRange(weekStartRow, 3, staff.length, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontSize(16).setFontColor('#e6c07b');
  sheet.getRange(weekStartRow, 4, staff.length, 1).setHorizontalAlignment('center');
  sheet.getRange(weekStartRow, 5, staff.length, 1).setHorizontalAlignment('center');

  // ===== ALL-TIME SECTION =====
  const allTimeStartRow = weekStartRow + staff.length + 2;

  sheet.getRange(`F4`).setValue('🏅 ALL-TIME TOTALS');
  sheet.getRange(`F4`).setFontSize(14).setFontWeight('bold').setFontColor('#4CAF50');
  sheet.getRange('F4:J4').merge().setBackground('#1c1a18');

  const allTimeHeaders = ['Rank', 'Staff Name', 'Total Reviews', 'Avg Rating', 'Last Scan'];
  sheet.getRange(5, 6, 1, 5).setValues([allTimeHeaders]);
  sheet.getRange(5, 6, 1, 5)
    .setFontWeight('bold')
    .setBackground('#4CAF50')
    .setFontColor('#000000')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setBorder(true, true, true, true, false, false, '#000000', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // Create formulas for ALL-TIME
  for (let i = 0; i < staff.length; i++) {
    const row = weekStartRow + i;
    const staffName = staff[i];

    // Rank
    sheet.getRange(row, 6).setValue(i + 1);

    // Staff Name
    sheet.getRange(row, 7).setValue(staffName);

    // Total All-Time Count
    sheet.getRange(row, 8).setFormula(
      `=COUNTIF('Raw Data'!C:C,"${staffName}")`
    );

    // All-Time Avg Rating
    sheet.getRange(row, 9).setFormula(
      `=IF(H${row}>0,ROUND(AVERAGEIF('Raw Data'!C:C,"${staffName}",'Raw Data'!D:D),1),"-")`
    );

    // Last Scan
    sheet.getRange(row, 10).setFormula(
      `=IF(H${row}>0,MAXIFS('Raw Data'!A:A,'Raw Data'!C:C,"${staffName}"),"")`
    );
  }

  // Format ALL-TIME data
  const allTimeDataRange = sheet.getRange(weekStartRow, 6, staff.length, 5);
  allTimeDataRange.setBorder(true, true, true, true, true, true, '#333333', SpreadsheetApp.BorderStyle.SOLID);

  sheet.getRange(weekStartRow, 6, staff.length, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontSize(14);
  sheet.getRange(weekStartRow, 7, staff.length, 1).setFontWeight('bold');
  sheet.getRange(weekStartRow, 8, staff.length, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontSize(16).setFontColor('#4CAF50');
  sheet.getRange(weekStartRow, 9, staff.length, 1).setHorizontalAlignment('center');
  sheet.getRange(weekStartRow, 10, staff.length, 1).setNumberFormat('yyyy-mm-dd hh:mm').setFontSize(9);

  // Set column widths
  sheet.setColumnWidth(1, 60);   // Rank
  sheet.setColumnWidth(2, 150);  // Staff Name
  sheet.setColumnWidth(3, 100);  // This Week
  sheet.setColumnWidth(4, 90);   // Avg Rating
  sheet.setColumnWidth(5, 100);  // Status
  sheet.setColumnWidth(6, 60);   // All-Time Rank
  sheet.setColumnWidth(7, 150);  // All-Time Staff Name
  sheet.setColumnWidth(8, 120);  // Total Reviews
  sheet.setColumnWidth(9, 90);   // All-Time Avg Rating
  sheet.setColumnWidth(10, 150); // Last Scan

  // Add conditional formatting for THIS WEEK top 3
  const weekTopRule1 = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=RANK($C6,$C$6:$C$17)=1')
    .setBackground('#FFD700')
    .setFontColor('#000000')
    .setRanges([sheet.getRange(weekStartRow, 1, staff.length, 5)])
    .build();

  const weekTopRule2 = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=RANK($C6,$C$6:$C$17)=2')
    .setBackground('#C0C0C0')
    .setFontColor('#000000')
    .setRanges([sheet.getRange(weekStartRow, 1, staff.length, 5)])
    .build();

  const weekTopRule3 = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=RANK($C6,$C$6:$C$17)=3')
    .setBackground('#CD7F32')
    .setFontColor('#000000')
    .setRanges([sheet.getRange(weekStartRow, 1, staff.length, 5)])
    .build();

  // Add conditional formatting for ALL-TIME top 3
  const allTimeTopRule1 = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=RANK($H6,$H$6:$H$17)=1')
    .setBackground('#FFD700')
    .setFontColor('#000000')
    .setRanges([sheet.getRange(weekStartRow, 6, staff.length, 5)])
    .build();

  const allTimeTopRule2 = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=RANK($H6,$H$6:$H$17)=2')
    .setBackground('#C0C0C0')
    .setFontColor('#000000')
    .setRanges([sheet.getRange(weekStartRow, 6, staff.length, 5)])
    .build();

  const allTimeTopRule3 = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=RANK($H6,$H$6:$H$17)=3')
    .setBackground('#CD7F32')
    .setFontColor('#000000')
    .setRanges([sheet.getRange(weekStartRow, 6, staff.length, 5)])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(weekTopRule1, weekTopRule2, weekTopRule3);
  rules.push(allTimeTopRule1, allTimeTopRule2, allTimeTopRule3);
  sheet.setConditionalFormatRules(rules);

  // Freeze header rows
  sheet.setFrozenRows(5);

  // Add note about weekly reset
  const noteRow = weekStartRow + staff.length + 2;
  sheet.getRange(`A${noteRow}`).setValue('⚡ Weekly competition resets every Monday at midnight');
  sheet.getRange(`A${noteRow}`).setFontSize(9).setFontColor('#999999').setFontStyle('italic');
  sheet.getRange(`A${noteRow}:J${noteRow}`).merge();
}

// Setup Weekly History Sheet
// SAFE: Only sets up if sheet is empty or missing headers
function setupWeeklyHistorySheet(sheet) {
  // Check if sheet already has data - DON'T clear it!
  if (sheet.getLastRow() > 1 && sheet.getRange(1, 1).getValue().toString().includes('WEEKLY')) {
    Logger.log('Weekly History sheet already has data - skipping setup to preserve history');
    return; // Exit without clearing - preserve existing data!
  }

  sheet.clear();

  sheet.getRange('A1').setValue('📈 WEEKLY PERFORMANCE HISTORY');
  sheet.getRange('A1').setFontSize(16).setFontWeight('bold').setFontColor('#e6c07b');
  sheet.getRange('A1:H1').merge();

  sheet.getRange('A2').setValue('Archive of past weekly competitions');
  sheet.getRange('A2').setFontSize(10).setFontColor('#999999');
  sheet.getRange('A2:H2').merge();

  // Headers
  const headers = ['Week Start', 'Week End', 'Staff Name', 'Total Reviews', 'Avg Rating', '5-Star Count', 'Low Ratings', 'Rank'];
  sheet.getRange(4, 1, 1, 8).setValues([headers]);
  sheet.getRange(4, 1, 1, 8)
    .setFontWeight('bold')
    .setBackground('#1c1a18')
    .setFontColor('#e6c07b')
    .setHorizontalAlignment('center')
    .setBorder(true, true, true, true, false, false, '#e6c07b', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // Set column widths
  sheet.setColumnWidth(1, 100);  // Week Start
  sheet.setColumnWidth(2, 100);  // Week End
  sheet.setColumnWidth(3, 150);  // Staff Name
  sheet.setColumnWidth(4, 120);  // Total Reviews
  sheet.setColumnWidth(5, 100);  // Avg Rating
  sheet.setColumnWidth(6, 100);  // 5-Star Count
  sheet.setColumnWidth(7, 100);  // Low Ratings
  sheet.setColumnWidth(8, 70);   // Rank

  sheet.setFrozenRows(4);
}

// Setup All-Time Stats Sheet
function setupAllTimeStatsSheet(sheet, rawDataSheet) {
  sheet.clear();

  sheet.getRange('A1').setValue('🏆 ALL-TIME PERFORMANCE STATISTICS');
  sheet.getRange('A1').setFontSize(16).setFontWeight('bold').setFontColor('#4CAF50');
  sheet.getRange('A1:I1').merge();

  sheet.getRange('A2').setValue('Running totals since inception - Never resets');
  sheet.getRange('A2').setFontSize(10).setFontColor('#999999');
  sheet.getRange('A2:I2').merge();

  // Get staff from Staff sheet (dynamic)
  const staffMap = getStaffList();
  const staff = Object.values(staffMap);

  // Headers
  const headers = ['Rank', 'Staff Name', 'Total Reviews', 'Avg Rating', '5-Star', '4-Star', '3-Star', '2-Star', '1-Star'];
  sheet.getRange(4, 1, 1, 9).setValues([headers]);
  sheet.getRange(4, 1, 1, 9)
    .setFontWeight('bold')
    .setBackground('#4CAF50')
    .setFontColor('#000000')
    .setHorizontalAlignment('center')
    .setBorder(true, true, true, true, false, false, '#000000', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  const startRow = 5;

  // Create formulas for each staff member
  for (let i = 0; i < staff.length; i++) {
    const row = startRow + i;
    const staffName = staff[i];

    // Rank
    sheet.getRange(row, 1).setValue(i + 1);

    // Staff Name
    sheet.getRange(row, 2).setValue(staffName);

    // Total Reviews
    sheet.getRange(row, 3).setFormula(`=COUNTIF('Raw Data'!C:C,"${staffName}")`);

    // Avg Rating
    sheet.getRange(row, 4).setFormula(`=IF(C${row}>0,ROUND(AVERAGEIF('Raw Data'!C:C,"${staffName}",'Raw Data'!D:D),2),"-")`);

    // 5-Star Count
    sheet.getRange(row, 5).setFormula(`=COUNTIFS('Raw Data'!C:C,"${staffName}",'Raw Data'!D:D,5)`);

    // 4-Star Count
    sheet.getRange(row, 6).setFormula(`=COUNTIFS('Raw Data'!C:C,"${staffName}",'Raw Data'!D:D,4)`);

    // 3-Star Count
    sheet.getRange(row, 7).setFormula(`=COUNTIFS('Raw Data'!C:C,"${staffName}",'Raw Data'!D:D,3)`);

    // 2-Star Count
    sheet.getRange(row, 8).setFormula(`=COUNTIFS('Raw Data'!C:C,"${staffName}",'Raw Data'!D:D,2)`);

    // 1-Star Count
    sheet.getRange(row, 9).setFormula(`=COUNTIFS('Raw Data'!C:C,"${staffName}",'Raw Data'!D:D,1)`);
  }

  // Format
  const dataRange = sheet.getRange(startRow, 1, staff.length, 9);
  dataRange.setBorder(true, true, true, true, true, true, '#333333', SpreadsheetApp.BorderStyle.SOLID);

  sheet.getRange(startRow, 1, staff.length, 1).setHorizontalAlignment('center').setFontWeight('bold');
  sheet.getRange(startRow, 2, staff.length, 1).setFontWeight('bold');
  sheet.getRange(startRow, 3, staff.length, 1).setHorizontalAlignment('center').setFontWeight('bold').setFontSize(14).setFontColor('#4CAF50');
  sheet.getRange(startRow, 4, staff.length, 6).setHorizontalAlignment('center');

  // Set column widths
  sheet.setColumnWidth(1, 60);   // Rank
  sheet.setColumnWidth(2, 150);  // Staff Name
  sheet.setColumnWidth(3, 120);  // Total
  sheet.setColumnWidth(4, 100);  // Avg Rating
  sheet.setColumnWidth(5, 80);   // 5-Star
  sheet.setColumnWidth(6, 80);   // 4-Star
  sheet.setColumnWidth(7, 80);   // 3-Star
  sheet.setColumnWidth(8, 80);   // 2-Star
  sheet.setColumnWidth(9, 80);   // 1-Star

  sheet.setFrozenRows(4);
}

/**
 * Setup Staff sheet for dynamic staff management
 * This allows adding/removing staff without code changes
 */
function setupStaffSheet(sheet) {
  // Only setup if empty or headers missing
  if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() !== 'Code') {
    sheet.clear();

    // Add headers
    sheet.appendRow(['Code', 'Name', 'Active', 'Added Date']);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, 4);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4CAF50');
    headerRange.setFontColor('#ffffff');
    headerRange.setHorizontalAlignment('center');
    headerRange.setVerticalAlignment('middle');
    headerRange.setBorder(true, true, true, true, false, false, '#ffffff', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

    // Add initial staff (migrating from hardcoded list)
    const initialStaff = [
      ['EDUARDO001', 'Eduardo', 'Yes', new Date()],
      ['PEDROLOPEZ002', 'Pedro López', 'Yes', new Date()],
      ['PEDROOROCIO003', 'Pedro Orocio', 'Yes', new Date()],
      ['EMILIANO004', 'Emiliano', 'Yes', new Date()],
      ['DAVID005', 'David', 'Yes', new Date()],
      ['LEOGASCA006', 'Leo Gasca', 'Yes', new Date()],
      ['LEOREYNOSO007', 'Leo Reynoso', 'Yes', new Date()],
      ['ULISES008', 'Ulises', 'Yes', new Date()],
      ['GERARDO009', 'Gerardo', 'Yes', new Date()],
      ['CARLOS010', 'Carlos', 'Yes', new Date()],
      ['JULIO011', 'Julio', 'Yes', new Date()],
      ['FERNANDO012', 'Fernando', 'Yes', new Date()]
    ];

    sheet.getRange(2, 1, initialStaff.length, 4).setValues(initialStaff);

    // Set column widths
    sheet.setColumnWidth(1, 150);  // Code
    sheet.setColumnWidth(2, 150);  // Name
    sheet.setColumnWidth(3, 80);   // Active
    sheet.setColumnWidth(4, 120);  // Added Date

    // Freeze header
    sheet.setFrozenRows(1);

    // Add data validation for Active column
    const activeRange = sheet.getRange(2, 3, 100, 1);
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Yes', 'No'], true)
      .build();
    activeRange.setDataValidation(rule);
  }
}

/**
 * Get staff list from Staff sheet
 */
function getStaffList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let staffSheet = ss.getSheetByName('Staff');

  // Hardcoded fallback list
  const fallbackStaff = {
    "EDUARDO001": "Eduardo",
    "PEDROLOPEZ002": "Pedro López",
    "PEDROOROCIO003": "Pedro Orocio",
    "EMILIANO004": "Emiliano",
    "DAVID005": "David",
    "LEOGASCA006": "Leo Gasca",
    "LEOREYNOSO007": "Leo Reynoso",
    "ULISES008": "Ulises",
    "GERARDO009": "Gerardo",
    "CARLOS010": "Carlos",
    "JULIO011": "Julio",
    "FERNANDO012": "Fernando"
  };

  // If no Staff sheet exists or it's empty, return fallback
  if (!staffSheet || staffSheet.getLastRow() <= 1) {
    return fallbackStaff;
  }

  const data = staffSheet.getDataRange().getValues();
  const staffMap = {};

  // Skip header row, only include active staff
  for (let i = 1; i < data.length; i++) {
    const code = data[i][0];
    const name = data[i][1];
    const active = data[i][2];

    if (code && name && active === 'Yes') {
      staffMap[code.toUpperCase()] = name;
    }
  }

  // If no active staff found, return fallback
  if (Object.keys(staffMap).length === 0) {
    return fallbackStaff;
  }

  return staffMap;
}

/**
 * Get all staff (including inactive) for admin panel
 */
function getAllStaff() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let staffSheet = ss.getSheetByName('Staff');

  if (!staffSheet) {
    return [];
  }

  const data = staffSheet.getDataRange().getValues();
  const staffList = [];

  // Skip header row
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {  // Has code
      staffList.push({
        code: data[i][0],
        name: data[i][1],
        active: data[i][2] === 'Yes',
        addedDate: data[i][3]
      });
    }
  }

  return staffList;
}

/**
 * Add a new staff member
 */
function addStaff(code, name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let staffSheet = ss.getSheetByName('Staff');

  if (!staffSheet) {
    staffSheet = ss.insertSheet('Staff');
    setupStaffSheet(staffSheet);
  }

  // Check if code already exists
  const data = staffSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().toUpperCase() === code.toUpperCase()) {
      return { success: false, message: 'Staff code already exists' };
    }
  }

  // Add new staff
  staffSheet.appendRow([code.toUpperCase(), name, 'Yes', new Date()]);

  // Rebuild leaderboard to include new staff
  rebuildLeaderboardFormulas();

  return { success: true, message: 'Staff added successfully' };
}

/**
 * Update staff member (toggle active status or update name)
 */
function updateStaff(code, name, active) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let staffSheet = ss.getSheetByName('Staff');

  if (!staffSheet) {
    return { success: false, message: 'Staff sheet not found' };
  }

  const data = staffSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().toUpperCase() === code.toUpperCase()) {
      staffSheet.getRange(i + 1, 2).setValue(name);
      staffSheet.getRange(i + 1, 3).setValue(active ? 'Yes' : 'No');
      return { success: true, message: 'Staff updated successfully' };
    }
  }

  return { success: false, message: 'Staff not found' };
}

/**
 * Delete staff member (removes from sheet)
 */
function deleteStaff(code) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let staffSheet = ss.getSheetByName('Staff');

  if (!staffSheet) {
    return { success: false, message: 'Staff sheet not found' };
  }

  const data = staffSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().toUpperCase() === code.toUpperCase()) {
      staffSheet.deleteRow(i + 1);
      return { success: true, message: 'Staff deleted successfully' };
    }
  }

  return { success: false, message: 'Staff not found' };
}

/**
 * Rebuild leaderboard formulas when staff changes
 */
function rebuildLeaderboardFormulas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawDataSheet = ss.getSheetByName('Raw Data');
  const leaderboardSheet = ss.getSheetByName('Leaderboard');

  if (leaderboardSheet && rawDataSheet) {
    setupLeaderboardSheet(leaderboardSheet, rawDataSheet);
  }

  const allTimeSheet = ss.getSheetByName('All-Time Stats');
  if (allTimeSheet && rawDataSheet) {
    setupAllTimeStatsSheet(allTimeSheet, rawDataSheet);
  }
}

/**
 * Get dashboard data (leaderboard, recent activity, stats)
 */
function getDashboardData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawDataSheet = ss.getSheetByName('Raw Data');
  const feedbackSheet = ss.getSheetByName('Feedback');
  const staffList = getStaffList();

  // Calculate this week's date range
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  // Get all raw data
  const rawData = rawDataSheet ? rawDataSheet.getDataRange().getValues() : [];
  const feedbackData = feedbackSheet ? feedbackSheet.getDataRange().getValues() : [];

  // Calculate staff stats
  const staffStats = {};
  const staffNames = Object.values(staffList);

  staffNames.forEach(name => {
    staffStats[name] = {
      name: name,
      thisWeek: 0,
      allTime: 0,
      avgRating: 0,
      ratings: [],
      thisWeekRatings: []
    };
  });

  // Process raw data
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    const staffName = row[2];
    const rating = parseInt(row[3]) || 5;
    const rowDate = new Date(row[0]);

    if (staffStats[staffName]) {
      staffStats[staffName].allTime++;
      staffStats[staffName].ratings.push(rating);

      if (rowDate >= monday) {
        staffStats[staffName].thisWeek++;
        staffStats[staffName].thisWeekRatings.push(rating);
      }
    }
  }

  // Calculate averages
  Object.keys(staffStats).forEach(name => {
    const stats = staffStats[name];
    if (stats.ratings.length > 0) {
      stats.avgRating = (stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length).toFixed(1);
    }
  });

  // Sort by this week's count for leaderboard
  const leaderboard = Object.values(staffStats)
    .sort((a, b) => b.thisWeek - a.thisWeek);

  // Get recent feedback (last 10)
  const recentFeedback = [];
  for (let i = feedbackData.length - 1; i >= 1 && recentFeedback.length < 10; i--) {
    const row = feedbackData[i];
    recentFeedback.push({
      timestamp: row[0],
      rating: row[1],
      staffName: row[3],
      customerName: row[4] || 'Anonymous',
      feedback: row[6],
      status: row[7],
      date: row[8]
    });
  }

  // Calculate overall stats
  const totalReviews = rawData.length - 1;
  const thisWeekReviews = leaderboard.reduce((sum, s) => sum + s.thisWeek, 0);
  const pendingFeedback = feedbackData.filter(row => row[7] === 'New').length;

  // Count 5-star ratings (sent to Google)
  let fiveStarCount = 0;
  for (let i = 1; i < rawData.length; i++) {
    if (parseInt(rawData[i][3]) === 5) {
      fiveStarCount++;
    }
  }

  return {
    leaderboard: leaderboard,
    recentFeedback: recentFeedback,
    stats: {
      totalReviews: totalReviews,
      thisWeekReviews: thisWeekReviews,
      pendingFeedback: pendingFeedback,
      activeStaff: staffNames.length,
      weekStart: monday.toISOString(),
      fiveStarCount: fiveStarCount
    }
  };
}

/**
 * Handles POST requests from the review system
 * CORS-compatible: Returns ContentService with proper headers
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Check if this is a feedback submission or rating submission
    if (data.type === 'feedback') {
      return handleFeedback(data, ss);
    } else {
      return handleRating(data, ss);
    }

  } catch (error) {
    // Return error response with CORS-friendly format
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleRating(data, ss) {
  let rawDataSheet = ss.getSheetByName('Raw Data');

  // If Raw Data sheet doesn't exist, create it
  if (!rawDataSheet) {
    rawDataSheet = ss.insertSheet('Raw Data');
    setupRawDataSheet(rawDataSheet);
  }

  // Get current timestamp
  const now = new Date();
  const dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const timeStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'HH:mm:ss');

  // Add the new row to Raw Data sheet with rating
  rawDataSheet.appendRow([
    now,
    data.cardCode || 'N/A',
    data.staffName || 'Unknown',
    data.rating || 'N/A',
    dateStr,
    timeStr
  ]);

  // Return success response
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Rating recorded successfully'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleFeedback(data, ss) {
  let feedbackSheet = ss.getSheetByName('Feedback');

  // If Feedback sheet doesn't exist, create it
  if (!feedbackSheet) {
    feedbackSheet = ss.insertSheet('Feedback');
    setupFeedbackSheet(feedbackSheet);
  }

  // Get current timestamp
  const now = new Date();
  const dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd');

  // Add the new row to Feedback sheet
  feedbackSheet.appendRow([
    now,
    data.rating || 'N/A',
    data.cardCode || 'N/A',
    data.staffName || 'Unknown',
    data.customerName || 'Anonymous',
    data.customerEmail || 'Not provided',
    data.feedback || '',
    'New',
    dateStr
  ]);

  // Send email notification to manager
  sendFeedbackEmail(data);

  // Return success response
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Feedback submitted successfully'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendFeedbackEmail(data) {
  const subject = `⚠️ Low Rating Alert - ${data.rating} stars from ${data.staffName}'s customer`;

  const body = `
A customer has left feedback for La Estancia with a rating below 5 stars.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RATING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⭐ Rating: ${data.rating}/5 stars
👤 Staff Member: ${data.staffName}
🔖 Staff Code: ${data.cardCode || 'N/A'}
📅 Date: ${new Date().toLocaleString('es-MX')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${data.customerName || 'Anonymous'}
Email: ${data.customerEmail || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEEDBACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${data.feedback}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

View all feedback: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}

This is an automated message from La Estancia Review Tracking System.
  `;

  try {
    MailApp.sendEmail({
      to: MANAGER_EMAIL,
      subject: subject,
      body: body
    });
  } catch (error) {
    Logger.log('Error sending email: ' + error.toString());
  }
}

function doGet(e) {
  // Handle GET requests for dashboard and staff management
  const action = e.parameter.action || 'status';

  try {
    let result;

    switch (action) {
      case 'getStaff':
        // Get staff list for review page
        result = getStaffList();
        break;

      case 'getAllStaff':
        // Get all staff (including inactive) for admin
        const password = e.parameter.password;
        if (password !== ADMIN_PASSWORD) {
          result = { error: 'Invalid password' };
        } else {
          result = getAllStaff();
        }
        break;

      case 'getDashboard':
        // Get dashboard data
        result = getDashboardData();
        break;

      case 'addStaff':
        // Add new staff member
        const addPassword = e.parameter.password;
        if (addPassword !== ADMIN_PASSWORD) {
          result = { success: false, message: 'Invalid password' };
        } else {
          const code = e.parameter.code;
          const name = e.parameter.name;
          if (!code || !name) {
            result = { success: false, message: 'Code and name are required' };
          } else {
            result = addStaff(code, name);
          }
        }
        break;

      case 'updateStaff':
        // Update staff member
        const updatePassword = e.parameter.password;
        if (updatePassword !== ADMIN_PASSWORD) {
          result = { success: false, message: 'Invalid password' };
        } else {
          const updateCode = e.parameter.code;
          const updateName = e.parameter.name;
          const active = e.parameter.active === 'true';
          result = updateStaff(updateCode, updateName, active);
        }
        break;

      case 'deleteStaff':
        // Delete staff member
        const deletePassword = e.parameter.password;
        if (deletePassword !== ADMIN_PASSWORD) {
          result = { success: false, message: 'Invalid password' };
        } else {
          const deleteCode = e.parameter.code;
          result = deleteStaff(deleteCode);
        }
        break;

      case 'status':
      default:
        result = {
          status: 'running',
          message: 'La Estancia Review Tracker is running',
          version: '2.0',
          features: ['Dynamic staff management', 'Dashboard API', 'Admin panel']
        };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ========================================
// AUTOMATED REPORTING FUNCTIONS
// ========================================

/**
 * Send weekly report every Monday morning
 * Run setupWeeklyReports() once to activate
 */
function sendWeeklyReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawDataSheet = ss.getSheetByName('Raw Data');
  const feedbackSheet = ss.getSheetByName('Feedback');

  if (!rawDataSheet) return;

  // Get data from last 7 days
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const data = rawDataSheet.getDataRange().getValues();
  const feedbackData = feedbackSheet ? feedbackSheet.getDataRange().getValues() : [];

  // Filter for last week
  const weekData = data.filter((row, index) => {
    if (index === 0) return false; // Skip header
    const rowDate = new Date(row[0]);
    return rowDate >= weekAgo;
  });

  const weekFeedback = feedbackData.filter((row, index) => {
    if (index === 0) return false;
    const rowDate = new Date(row[0]);
    return rowDate >= weekAgo;
  });

  // Calculate stats
  const totalScans = weekData.length;
  const staffStats = {};

  weekData.forEach(row => {
    const staffName = row[2];
    const rating = row[3];

    if (!staffStats[staffName]) {
      staffStats[staffName] = { count: 0, ratings: [], total5Stars: 0 };
    }

    staffStats[staffName].count++;
    if (rating && rating !== 'N/A') {
      staffStats[staffName].ratings.push(parseInt(rating));
      if (parseInt(rating) === 5) {
        staffStats[staffName].total5Stars++;
      }
    }
  });

  // Build email
  let body = `
🏆 LA ESTANCIA - WEEKLY PERFORMANCE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Report Period: ${weekAgo.toLocaleDateString('es-MX')} - ${today.toLocaleDateString('es-MX')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OVERALL SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total Customer Interactions: ${totalScans}
💬 Total Feedback Submissions: ${weekFeedback.length}
⚠️ Issues to Address: ${weekFeedback.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STAFF PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

  // Sort staff by count
  const sortedStaff = Object.entries(staffStats).sort((a, b) => b[1].count - a[1].count);

  sortedStaff.forEach(([name, stats], index) => {
    const avgRating = stats.ratings.length > 0
      ? (stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length).toFixed(1)
      : 'N/A';

    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';

    body += `${medal} ${name}
   📈 Total Scans: ${stats.count}
   ⭐ Average Rating: ${avgRating}/5
   🌟 5-Star Reviews: ${stats.total5Stars}

`;
  });

  if (weekFeedback.length > 0) {
    body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECENT FEEDBACK (NEEDS ATTENTION)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

    weekFeedback.slice(1, 6).forEach(row => { // Show up to 5 recent feedback
      body += `⭐ Rating: ${row[1]}/5 | Staff: ${row[3]}
📝 "${row[6]}"
───────────────────────────────────────────────

`;
    });
  }

  body += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 View Full Report: ${ss.getUrl()}

This is an automated weekly report from La Estancia Review Tracking System.
`;

  const subject = `📊 Weekly Report: ${totalScans} interactions, ${weekFeedback.length} feedback items`;

  try {
    MailApp.sendEmail({
      to: MANAGER_EMAIL,
      subject: subject,
      body: body
    });
    Logger.log('Weekly report sent successfully');
  } catch (error) {
    Logger.log('Error sending weekly report: ' + error.toString());
  }
}

/**
 * Send monthly report on the 1st of each month
 * Run setupMonthlyReports() once to activate
 */
function sendMonthlyReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawDataSheet = ss.getSheetByName('Raw Data');
  const feedbackSheet = ss.getSheetByName('Feedback');

  if (!rawDataSheet) return;

  // Get data from last 30 days
  const today = new Date();
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const data = rawDataSheet.getDataRange().getValues();
  const feedbackData = feedbackSheet ? feedbackSheet.getDataRange().getValues() : [];

  // Filter for last month
  const monthData = data.filter((row, index) => {
    if (index === 0) return false;
    const rowDate = new Date(row[0]);
    return rowDate >= monthAgo;
  });

  const monthFeedback = feedbackData.filter((row, index) => {
    if (index === 0) return false;
    const rowDate = new Date(row[0]);
    return rowDate >= monthAgo;
  });

  // Calculate comprehensive stats
  const totalScans = monthData.length;
  const staffStats = {};
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  monthData.forEach(row => {
    const staffName = row[2];
    const rating = row[3];

    if (!staffStats[staffName]) {
      staffStats[staffName] = { count: 0, ratings: [], total5Stars: 0, lowRatings: 0 };
    }

    staffStats[staffName].count++;
    if (rating && rating !== 'N/A') {
      const ratingNum = parseInt(rating);
      staffStats[staffName].ratings.push(ratingNum);
      ratingDistribution[ratingNum]++;

      if (ratingNum === 5) {
        staffStats[staffName].total5Stars++;
      } else if (ratingNum <= 3) {
        staffStats[staffName].lowRatings++;
      }
    }
  });

  // Calculate overall average rating
  const allRatings = Object.values(staffStats).flatMap(s => s.ratings);
  const overallAvgRating = allRatings.length > 0
    ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2)
    : 'N/A';

  // Build comprehensive email
  let body = `
🏆 LA ESTANCIA - MONTHLY PERFORMANCE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Report Period: ${monthAgo.toLocaleDateString('es-MX')} - ${today.toLocaleDateString('es-MX')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTIVE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Total Customer Interactions: ${totalScans}
⭐ Overall Average Rating: ${overallAvgRating}/5
🌟 Total 5-Star Ratings: ${ratingDistribution[5]}
💬 Feedback Submissions: ${monthFeedback.length}
⚠️ Low Ratings (≤3 stars): ${ratingDistribution[1] + ratingDistribution[2] + ratingDistribution[3]}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RATING DISTRIBUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⭐⭐⭐⭐⭐ (5 stars): ${ratingDistribution[5]} (${((ratingDistribution[5]/totalScans)*100).toFixed(1)}%)
⭐⭐⭐⭐   (4 stars): ${ratingDistribution[4]} (${((ratingDistribution[4]/totalScans)*100).toFixed(1)}%)
⭐⭐⭐     (3 stars): ${ratingDistribution[3]} (${((ratingDistribution[3]/totalScans)*100).toFixed(1)}%)
⭐⭐       (2 stars): ${ratingDistribution[2]} (${((ratingDistribution[2]/totalScans)*100).toFixed(1)}%)
⭐         (1 star):  ${ratingDistribution[1]} (${((ratingDistribution[1]/totalScans)*100).toFixed(1)}%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOP PERFORMERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

  // Sort and show top performers
  const sortedStaff = Object.entries(staffStats).sort((a, b) => b[1].count - a[1].count);

  sortedStaff.slice(0, 5).forEach(([name, stats], index) => {
    const avgRating = stats.ratings.length > 0
      ? (stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length).toFixed(2)
      : 'N/A';

    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;

    body += `${medal} ${name}
   📈 Total Interactions: ${stats.count}
   ⭐ Average Rating: ${avgRating}/5
   🌟 5-Star Reviews: ${stats.total5Stars}
   ⚠️ Low Ratings: ${stats.lowRatings}

`;
  });

  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPLETE STAFF BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

  sortedStaff.forEach(([name, stats]) => {
    const avgRating = stats.ratings.length > 0
      ? (stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length).toFixed(2)
      : 'N/A';

    body += `${name}: ${stats.count} scans | Avg: ${avgRating}⭐ | 5⭐: ${stats.total5Stars}\n`;
  });

  if (monthFeedback.length > 0) {
    body += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEEDBACK HIGHLIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total feedback items requiring attention: ${monthFeedback.length}

View all feedback in the Feedback sheet.
`;
  }

  body += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

  // Add recommendations based on data
  if (ratingDistribution[1] + ratingDistribution[2] + ratingDistribution[3] > totalScans * 0.1) {
    body += `⚠️ HIGH PRIORITY: ${((((ratingDistribution[1] + ratingDistribution[2] + ratingDistribution[3])/totalScans)*100).toFixed(1))}% of ratings are 3 stars or below. Review feedback immediately.\n\n`;
  }

  const lowestPerformer = sortedStaff[sortedStaff.length - 1];
  if (lowestPerformer && lowestPerformer[1].count < totalScans / sortedStaff.length * 0.5) {
    body += `📉 ${lowestPerformer[0]} has significantly fewer interactions than average. Consider coaching.\n\n`;
  }

  body += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 View Full Data: ${ss.getUrl()}

This is an automated monthly report from La Estancia Review Tracking System.
`;

  const subject = `📊 Monthly Report: ${totalScans} interactions | ${overallAvgRating}⭐ avg | ${monthFeedback.length} feedback`;

  try {
    MailApp.sendEmail({
      to: MANAGER_EMAIL,
      subject: subject,
      body: body
    });
    Logger.log('Monthly report sent successfully');
  } catch (error) {
    Logger.log('Error sending monthly report: ' + error.toString());
  }
}

/**
 * Set up weekly reports - Run this function ONCE
 */
function setupWeeklyReports() {
  // Delete existing weekly triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'sendWeeklyReport') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new trigger for every Monday at 8 AM
  ScriptApp.newTrigger('sendWeeklyReport')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(8)
    .create();

  SpreadsheetApp.getUi().alert('✅ Weekly reports activated!\n\nYou will receive reports every Monday at 8 AM.');
}

/**
 * Set up monthly reports - Run this function ONCE
 */
function setupMonthlyReports() {
  // Delete existing monthly triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'sendMonthlyReport') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new trigger for 1st day of month at 9 AM
  ScriptApp.newTrigger('sendMonthlyReport')
    .timeBased()
    .onMonthDay(1)
    .atHour(9)
    .create();

  SpreadsheetApp.getUi().alert('✅ Monthly reports activated!\n\nYou will receive reports on the 1st of each month at 9 AM.');
}

// ========================================
// WEEKLY ARCHIVE & RESET FUNCTIONS
// ========================================

/**
 * Archives the previous week's data and resets the weekly competition
 * This runs automatically every Monday at midnight
 */
function archiveAndResetWeeklyLeaderboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawDataSheet = ss.getSheetByName('Raw Data');
  const weeklyHistorySheet = ss.getSheetByName('Weekly History');

  if (!rawDataSheet || !weeklyHistorySheet) {
    Logger.log('Required sheets not found');
    return;
  }

  // Calculate last week's date range (Monday to Sunday)
  const today = new Date();
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - 7);
  lastMonday.setHours(0, 0, 0, 0);

  const lastSunday = new Date(lastMonday);
  lastSunday.setDate(lastMonday.getDate() + 6);
  lastSunday.setHours(23, 59, 59, 999);

  // Get all data from Raw Data sheet
  const data = rawDataSheet.getDataRange().getValues();

  // Filter for last week
  const lastWeekData = data.filter((row, index) => {
    if (index === 0) return false; // Skip header
    const rowDate = new Date(row[0]);
    return rowDate >= lastMonday && rowDate <= lastSunday;
  });

  if (lastWeekData.length === 0) {
    Logger.log('No data for last week');
    return;
  }

  // Get staff from Staff sheet (dynamic)
  const staffMap = getStaffList();
  const staff = Object.values(staffMap);

  const staffStats = {};

  staff.forEach(name => {
    staffStats[name] = {
      total: 0,
      ratings: [],
      fiveStars: 0,
      lowRatings: 0 // 3 or below
    };
  });

  // Process last week's data
  lastWeekData.forEach(row => {
    const staffName = row[2];
    const rating = row[3];

    if (staffStats[staffName]) {
      staffStats[staffName].total++;

      if (rating && rating !== 'N/A') {
        const ratingNum = parseInt(rating);
        staffStats[staffName].ratings.push(ratingNum);

        if (ratingNum === 5) {
          staffStats[staffName].fiveStars++;
        } else if (ratingNum <= 3) {
          staffStats[staffName].lowRatings++;
        }
      }
    }
  });

  // Sort staff by total reviews to assign ranks
  const sortedStaff = Object.entries(staffStats)
    .sort((a, b) => b[1].total - a[1].total);

  // Archive to Weekly History sheet
  const archiveData = [];
  sortedStaff.forEach(([name, stats], index) => {
    const avgRating = stats.ratings.length > 0
      ? (stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length).toFixed(2)
      : '-';

    archiveData.push([
      Utilities.formatDate(lastMonday, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
      Utilities.formatDate(lastSunday, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
      name,
      stats.total,
      avgRating,
      stats.fiveStars,
      stats.lowRatings,
      index + 1 // Rank
    ]);
  });

  // Append to Weekly History sheet
  if (archiveData.length > 0) {
    const lastRow = weeklyHistorySheet.getLastRow();
    weeklyHistorySheet.getRange(lastRow + 1, 1, archiveData.length, 8).setValues(archiveData);

    // Format the archived data
    const archiveRange = weeklyHistorySheet.getRange(lastRow + 1, 1, archiveData.length, 8);
    archiveRange.setBorder(true, true, true, true, true, true, '#666666', SpreadsheetApp.BorderStyle.SOLID);

    // Highlight top 3 performers
    for (let i = 0; i < Math.min(3, archiveData.length); i++) {
      const rowRange = weeklyHistorySheet.getRange(lastRow + 1 + i, 1, 1, 8);
      if (i === 0) {
        rowRange.setBackground('#FFD700').setFontWeight('bold');
      } else if (i === 1) {
        rowRange.setBackground('#C0C0C0').setFontWeight('bold');
      } else if (i === 2) {
        rowRange.setBackground('#CD7F32').setFontWeight('bold');
      }
    }

    Logger.log(`Archived week ${Utilities.formatDate(lastMonday, Session.getScriptTimeZone(), 'yyyy-MM-dd')} with ${archiveData.length} staff records`);
  }

  // Note: We don't delete data from Raw Data sheet - we keep all historical data
  // The leaderboard formulas automatically calculate "this week" based on current Monday's date

  // Send weekly winner announcement email
  if (sortedStaff.length > 0 && sortedStaff[0][1].total > 0) {
    sendWeeklyWinnerEmail(lastMonday, lastSunday, sortedStaff);
  }
}

/**
 * Send email announcing last week's winner
 */
function sendWeeklyWinnerEmail(weekStart, weekEnd, sortedStaff) {
  const winner = sortedStaff[0];
  const winnerName = winner[0];
  const winnerStats = winner[1];

  const avgRating = winnerStats.ratings.length > 0
    ? (winnerStats.ratings.reduce((a, b) => a + b, 0) / winnerStats.ratings.length).toFixed(2)
    : 'N/A';

  let body = `
🏆 LA ESTANCIA - WEEKLY COMPETITION RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Week: ${weekStart.toLocaleDateString('es-MX')} - ${weekEnd.toLocaleDateString('es-MX')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🥇 WEEKLY WINNER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Congratulations to ${winnerName}!

📊 ${winnerName}'s Performance:
   • Total Reviews: ${winnerStats.total}
   • Average Rating: ${avgRating}⭐
   • 5-Star Reviews: ${winnerStats.fiveStars}
   • Low Ratings: ${winnerStats.lowRatings}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TOP 5 PERFORMERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

  sortedStaff.slice(0, 5).forEach(([name, stats], index) => {
    const avg = stats.ratings.length > 0
      ? (stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length).toFixed(2)
      : 'N/A';

    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;

    body += `${medal} ${name}: ${stats.total} reviews (${avg}⭐)\n`;
  });

  body += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 New week started! The leaderboard has been reset.

📊 View Full History: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}

This is an automated message from La Estancia Review Tracking System.
`;

  const subject = `🏆 Weekly Winner: ${winnerName} - ${winnerStats.total} reviews!`;

  try {
    MailApp.sendEmail({
      to: MANAGER_EMAIL,
      subject: subject,
      body: body
    });
    Logger.log('Weekly winner email sent');
  } catch (error) {
    Logger.log('Error sending weekly winner email: ' + error.toString());
  }
}

/**
 * Set up weekly archive automation - Run this function ONCE
 */
function setupWeeklyArchive() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'archiveAndResetWeeklyLeaderboard') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new trigger for every Monday at midnight
  ScriptApp.newTrigger('archiveAndResetWeeklyLeaderboard')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(0)
    .nearMinute(0)
    .create();

  SpreadsheetApp.getUi().alert('✅ Weekly archive activated!\n\nEvery Monday at midnight:\n• Last week archived to Weekly History\n• Winner announcement email sent\n• Leaderboard resets for new week');
}
