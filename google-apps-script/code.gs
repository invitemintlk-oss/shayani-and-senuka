/**
 * Shayani & Senaka – Wedding Invitation backend (Google Apps Script)
 *
 * Paste this whole file into: Google Sheet → Extensions → Apps Script → Code.gs
 * Then: Deploy → New deployment → Web app
 *        Execute as: Me   |   Who has access: Anyone
 * Copy the Web App URL into VITE_GOOGLE_APPS_SCRIPT_URL (.env + Vercel env vars).
 *
 * Sheets "RSVP" and "Wishes" are created automatically (with styled headers)
 * the first time they are needed. You can also run setupSheets() once manually.
 */

const SPREADSHEET_ID = '1CULITKV9nZkyrqOX9x2xvO-hXvqK-8xCGxPFRpKPyPk';

const SHEETS = {
  RSVP: {
    name: 'RSVP',
    headers: ['Timestamp', 'Full Name', 'Attendance', 'Guests', 'Dietary Notes', 'Invite Name'],
    widths: [170, 220, 110, 80, 280, 200],
  },
  WISHES: {
    name: 'Wishes',
    headers: ['Timestamp', 'Guest Name', 'Message'],
    widths: [170, 220, 480],
  },
};

const HEADER_BG = '#47705A';
const HEADER_FG = '#FFFFFF';

// ───────────────────────── Entry points ─────────────────────────

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const p = (e && e.parameter) || {};
    const type = normalizeType_(p.sheet);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (type === 'RSVP') {
      const sheet = getOrCreateSheet_(ss, SHEETS.RSVP);
      sheet.appendRow([
        new Date(),
        clean_(p.name),
        clean_(p.attendance) || 'Yes',
        clean_(p.guests),
        clean_(p.dietary),
        clean_(p.invite),
      ]);
      return json_({ ok: true, sheet: SHEETS.RSVP.name, row: sheet.getLastRow() });
    }

    if (type === 'WISHES') {
      if (!clean_(p.name) || !clean_(p.message)) {
        return json_({ ok: false, error: 'Name and message are required.' });
      }
      const sheet = getOrCreateSheet_(ss, SHEETS.WISHES);
      sheet.appendRow([new Date(), clean_(p.name), clean_(p.message)]);
      return json_({ ok: true, sheet: SHEETS.WISHES.name, row: sheet.getLastRow() });
    }

    return json_({ ok: false, error: 'Unknown sheet. Use "RSVP" or "Wishes".' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

/** GET ?action=wishes  → latest wishes (newest first) for the website guestbook. */
function doGet(e) {
  try {
    const action = String((e && e.parameter && e.parameter.action) || '').toLowerCase();

    if (action === 'wishes') {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = getOrCreateSheet_(ss, SHEETS.WISHES);
      const lastRow = sheet.getLastRow();
      if (lastRow < 2) return json_({ ok: true, wishes: [] });

      const values = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
      const wishes = values
        .filter(function (r) { return r[1] && r[2]; })
        .map(function (r) {
          return {
            createdAt: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
            name: String(r[1]),
            message: String(r[2]),
          };
        })
        .reverse()
        .slice(0, 100);

      return json_({ ok: true, wishes: wishes });
    }

    return json_({ ok: true, message: 'Shayani & Senaka wedding endpoint is running.' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

/** Optional: run once from the Apps Script editor to create both sheets immediately. */
function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  getOrCreateSheet_(ss, SHEETS.RSVP);
  getOrCreateSheet_(ss, SHEETS.WISHES);
}

// ───────────────────────── Helpers ─────────────────────────

function normalizeType_(value) {
  const v = String(value || '').trim().toUpperCase();
  if (v === 'RSVP') return 'RSVP';
  if (v === 'WISH' || v === 'WISHES') return 'WISHES';
  return '';
}

function getOrCreateSheet_(ss, def) {
  let sheet = ss.getSheetByName(def.name);
  if (!sheet) sheet = ss.insertSheet(def.name);
  ensureHeaders_(sheet, def);
  return sheet;
}

function ensureHeaders_(sheet, def) {
  const width = def.headers.length;
  const current = sheet.getRange(1, 1, 1, width).getValues()[0];
  const matches = def.headers.every(function (h, i) { return current[i] === h; });
  if (matches) return;

  // If row 1 already holds data (not headers), push it down first.
  if (sheet.getLastRow() > 0 && current.some(function (c) { return c !== ''; })) {
    sheet.insertRowBefore(1);
  }

  const header = sheet.getRange(1, 1, 1, width);
  header
    .setValues([def.headers])
    .setFontWeight('bold')
    .setBackground(HEADER_BG)
    .setFontColor(HEADER_FG)
    .setHorizontalAlignment('center');

  sheet.setFrozenRows(1);
  def.widths.forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });
  sheet.getRange(2, 1, Math.max(sheet.getMaxRows() - 1, 1), 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
}

function clean_(value) {
  // Trim, cap length, and stop spreadsheet formula injection (=, +, -, @).
  let s = String(value == null ? '' : value).trim().slice(0, 2000);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
