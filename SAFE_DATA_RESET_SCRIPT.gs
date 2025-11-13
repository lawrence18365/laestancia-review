/**
 * SAFE DATA RESET SCRIPT
 *
 * This script safely clears all test data from your sheets
 * while preserving headers, formatting, and formulas.
 *
 * HOW TO USE:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Copy this ENTIRE function into your script (paste it at the bottom)
 * 4. Save the script (Ctrl+S / Cmd+S)
 * 5. Select "resetAllTestData" from the function dropdown
 * 6. Click Run (▶ play button)
 * 7. Confirm when prompted
 *
 * WHAT IT DOES:
 * ✅ Clears all data rows from Raw Data (keeps headers)
 * ✅ Clears all data rows from Feedback (keeps headers)
 * ✅ Clears all data rows from Weekly History (keeps headers)
 * ✅ Leaves Leaderboard untouched (auto-calculates from Raw Data)
 * ✅ Leaves All-Time Stats untouched (auto-calculates from Raw Data)
 * ✅ Preserves all formatting, colors, and formulas
 *
 * WHAT IT DOESN'T DO:
 * ❌ Won't delete any sheets
 * ❌ Won't delete headers
 * ❌ Won't delete formulas
 * ❌ Won't affect your triggers or email settings
 */

function resetAllTestData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // Confirmation dialog
  const response = ui.alert(
    '⚠️ Reset All Test Data',
    'This will delete all data from:\n\n' +
    '• Raw Data sheet (row 2 onwards)\n' +
    '• Feedback sheet (row 2 onwards)\n' +
    '• Weekly History sheet (row 5 onwards)\n\n' +
    'Headers, formulas, and formatting will be preserved.\n\n' +
    'Are you sure you want to continue?',
    ui.ButtonSet.YES_NO
  );

  // If user clicks NO or closes dialog
  if (response !== ui.Button.YES) {
    ui.alert('❌ Cancelled', 'No data was deleted.', ui.ButtonSet.OK);
    return;
  }

  // Get sheets
  const rawDataSheet = ss.getSheetByName('Raw Data');
  const feedbackSheet = ss.getSheetByName('Feedback');
  const weeklyHistorySheet = ss.getSheetByName('Weekly History');

  let deletedRows = 0;

  // Clear Raw Data (keep row 1 - headers)
  if (rawDataSheet) {
    const lastRow = rawDataSheet.getLastRow();
    if (lastRow > 1) {
      rawDataSheet.deleteRows(2, lastRow - 1);
      deletedRows += (lastRow - 1);
      Logger.log(`Cleared ${lastRow - 1} rows from Raw Data`);
    }
  }

  // Clear Feedback (keep row 1 - headers)
  if (feedbackSheet) {
    const lastRow = feedbackSheet.getLastRow();
    if (lastRow > 1) {
      feedbackSheet.deleteRows(2, lastRow - 1);
      deletedRows += (lastRow - 1);
      Logger.log(`Cleared ${lastRow - 1} rows from Feedback`);
    }
  }

  // Clear Weekly History (keep rows 1-4 - title and headers)
  if (weeklyHistorySheet) {
    const lastRow = weeklyHistorySheet.getLastRow();
    if (lastRow > 4) {
      weeklyHistorySheet.deleteRows(5, lastRow - 4);
      deletedRows += (lastRow - 4);
      Logger.log(`Cleared ${lastRow - 4} rows from Weekly History`);
    }
  }

  // Success message
  ui.alert(
    '✅ Data Reset Complete!',
    `Successfully deleted ${deletedRows} rows of test data.\n\n` +
    '📊 Leaderboard and All-Time Stats will now show zeros.\n\n' +
    '✅ All headers, formulas, and formatting preserved.\n\n' +
    '🚀 Your system is ready for production!',
    ui.ButtonSet.OK
  );

  Logger.log(`Total deleted: ${deletedRows} rows`);
}


/**
 * ALTERNATIVE: Reset ONLY Raw Data
 * Use this if you only want to clear review data
 */
function resetOnlyRawData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const response = ui.alert(
    'Reset Raw Data Only?',
    'This will delete all review data but keep feedback.\n\nContinue?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  const rawDataSheet = ss.getSheetByName('Raw Data');

  if (rawDataSheet) {
    const lastRow = rawDataSheet.getLastRow();
    if (lastRow > 1) {
      rawDataSheet.deleteRows(2, lastRow - 1);
      ui.alert('✅ Success', `Deleted ${lastRow - 1} review records.`, ui.ButtonSet.OK);
    } else {
      ui.alert('ℹ️ No Data', 'Raw Data sheet is already empty.', ui.ButtonSet.OK);
    }
  }
}


/**
 * ALTERNATIVE: Reset ONLY Feedback
 * Use this if you only want to clear feedback data
 */
function resetOnlyFeedback() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const response = ui.alert(
    'Reset Feedback Only?',
    'This will delete all feedback but keep review data.\n\nContinue?',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  const feedbackSheet = ss.getSheetByName('Feedback');

  if (feedbackSheet) {
    const lastRow = feedbackSheet.getLastRow();
    if (lastRow > 1) {
      feedbackSheet.deleteRows(2, lastRow - 1);
      ui.alert('✅ Success', `Deleted ${lastRow - 1} feedback records.`, ui.ButtonSet.OK);
    } else {
      ui.alert('ℹ️ No Data', 'Feedback sheet is already empty.', ui.ButtonSet.OK);
    }
  }
}
