// ============================================================
//  FlowMaster Plumbing Nairobi — Code.gs
//  Google Apps Script Web App — Booking Capture Backend
// ============================================================
//
//  HOW TO DEPLOY (one-time setup, ~5 minutes):
//
//  1. Open Google Sheets → create a new spreadsheet.
//     Name it "FlowMaster – Bookings".
//
//  2. Extensions → Apps Script
//
//  3. Delete any existing code, paste THIS entire file.
//
//  4. Set NOTIFY_EMAIL (and EMERGENCY_EMAIL) below.
//
//  5. Deploy → New Deployment:
//       Type           → Web App
//       Execute as     → Me
//       Who has access → Anyone
//     Copy the Web App URL.
//
//  6. Paste the URL into script.js as SHEETS_WEBHOOK_URL.
//
//  7. Done — every booking appears as a new row.
//     Emergency jobs get a red row highlight automatically.
// ============================================================

// ─── CONFIGURATION ───────────────────────────────────────────
var SHEET_NAME       = 'Bookings';
var NOTIFY_EMAIL     = '';        // e.g. 'bookings@flowmaster.co.ke'
var EMERGENCY_EMAIL  = '';        // e.g. 'dispatch@flowmaster.co.ke'
var EMAIL_SUBJECT    = '🔧 New Plumbing Booking — FlowMaster';
var EMRG_SUBJECT     = '🚨 EMERGENCY PLUMBING — FlowMaster';
// ─────────────────────────────────────────────────────────────

/**
 * Handles POST from the website booking form.
 */
function doPost(e) {
  try {
    var p = e.parameter;

    var name     = p.name        || '';
    var phone    = p.phone       || '';
    var service  = p.service     || 'Not specified';
    var urgency  = p.urgency     || 'Normal';
    var location = p.location    || 'Not specified';
    var notes    = p.notes       || '—';
    var ts       = p.submittedAt || new Date().toLocaleString();
    var pageUrl  = p.pageUrl     || '—';
    var ua       = p.userAgent   || '—';

    // Server-side validation
    if (!name || !phone) {
      return jsonResponse({ result: 'error', error: 'Name and phone are required.' });
    }

    // Detect emergency
    var isEmergency = urgency.toLowerCase().indexOf('emergency') !== -1;

    // Detect device
    var device = /android|iphone|ipad|mobile/i.test(ua) ? 'Mobile' : 'Desktop';

    // Get or create sheet
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);

      // Header row
      sheet.appendRow([
        'Timestamp (EAT)',
        'Client Name',
        'Phone',
        'Service',
        'Urgency',
        'Location / Estate',
        'Notes',
        'Status',
        'Plumber Assigned',
        'Quote Sent',
        'Job Date',
        'Invoice #',
        'Device',
        'Source URL',
      ]);

      // Header styling — terracotta & chalk theme
      var hdr = sheet.getRange(1, 1, 1, 14);
      hdr.setFontWeight('bold');
      hdr.setBackground('#c1440e');
      hdr.setFontColor('#faf7f0');
      sheet.setFrozenRows(1);

      // Column widths
      var widths = [200, 160, 140, 200, 200, 200, 280, 120, 180, 100, 130, 110, 100, 220];
      widths.forEach(function(w, i) { sheet.setColumnWidth(i + 1, w); });
    }

    // Append booking row
    sheet.appendRow([
      ts,
      name,
      phone,
      service,
      urgency,
      location,
      notes,
      isEmergency ? 'EMERGENCY' : 'New',
      '',        // Plumber Assigned
      '',        // Quote Sent (Y/N)
      '',        // Job Date
      '',        // Invoice #
      device,
      pageUrl,
    ]);

    // Row colour — emergency: red, normal: warm cream
    var lastRow = sheet.getLastRow();
    if (isEmergency) {
      sheet.getRange(lastRow, 1, 1, 14).setBackground('#fde8e0');
      sheet.getRange(lastRow, 5).setFontColor('#c1440e').setFontWeight('bold');
      sheet.getRange(lastRow, 8).setFontColor('#c1440e').setFontWeight('bold');
    } else {
      sheet.getRange(lastRow, 1, 1, 14).setBackground('#faf7f0');
    }

    // Bold service & location columns for fast scanning
    sheet.getRange(lastRow, 4, 1, 3).setFontWeight('bold');

    // ── Email notifications ──────────────────────────────────
    var emailBody =
      '🔧 New Plumbing Booking — FlowMaster\n\n' +
      'Name     : ' + name     + '\n' +
      'Phone    : ' + phone    + '\n' +
      'Service  : ' + service  + '\n' +
      'Urgency  : ' + urgency  + '\n' +
      'Location : ' + location + '\n' +
      'Notes    : ' + notes    + '\n\n' +
      'Submitted: ' + ts       + '\n' +
      'Device   : ' + device   + '\n\n' +
      'Open spreadsheet: ' + ss.getUrl();

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        isEmergency ? EMRG_SUBJECT : EMAIL_SUBJECT,
        emailBody
      );
    }

    // Separate emergency alert
    if (isEmergency && EMERGENCY_EMAIL && EMERGENCY_EMAIL !== NOTIFY_EMAIL) {
      MailApp.sendEmail(EMERGENCY_EMAIL, EMRG_SUBJECT, emailBody);
    }

    return jsonResponse({ result: 'success' });

  } catch (err) {
    Logger.log('doPost error: ' + err.message);
    return jsonResponse({ result: 'error', error: err.message });
  }
}


/**
 * GET health check — open the Web App URL in a browser to confirm it's live.
 */
function doGet() {
  return HtmlService.createHtmlOutput(
    '<h2 style="font-family:Georgia,serif;color:#c1440e;background:#1c1208;padding:40px;margin:0">' +
    '✓ FlowMaster Booking Webhook — LIVE</h2>' +
    '<p style="font-family:sans-serif;background:#1c1208;color:#b8860b;padding:0 40px 40px">' +
    'POST booking data here to log jobs.</p>'
  );
}


/**
 * JSON response helper.
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
