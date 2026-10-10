const SHEET_NAME = 'Leads';
const SECRET = 'nx_crm_secret_nexvanta2026'; // must equal GOOGLE_SHEET_SECRET in .env.local
const NOTIFY_EMAIL = 'hello.nexvanta56@gmail.com';
const HEADERS = ['Lead ID','Timestamp (IST)','Name','Industry','Phone','Email','Company',
  'Lead Status','Segment','Interested In','Source','Message / Notes','Page URL',
  'UTM Source','UTM Medium','UTM Campaign','Follow-up Status','Assigned To'];

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.secret !== SECRET) return out_({ ok: false, error: 'unauthorized' });
    const sheet = getSheet_();
    const now = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');

    // Update an existing lead (same session) if leadId is known
    if (d.leadId) {
      const found = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1)
        .createTextFinder(d.leadId).matchEntireCell(true).findNext();
      if (found) {
        const row = found.getRow();
        const set = (col, val) => { if (val !== undefined && val !== null && val !== '') sheet.getRange(row, col).setValue(val); };
        set(3, d.name); set(4, d.industry); set(5, d.phone); set(6, d.email); set(7, d.company);
        set(8, d.status); set(9, d.segment); set(10, d.interestedIn); set(11, d.source);
        set(12, d.message); set(13, d.pageUrl);
        return out_({ ok: true, leadId: d.leadId, updated: true });
      }
    }

    const leadId = 'NX-' + Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyMMdd') + '-' + Math.floor(1000 + Math.random() * 9000);
    sheet.appendRow([leadId, now, d.name || '', d.industry || '', d.phone || '', d.email || '',
      d.company || '', d.status || 'COLD', d.segment || 'General', d.interestedIn || '',
      d.source || '', d.message || '', d.pageUrl || '', d.utmSource || '', d.utmMedium || '',
      d.utmCampaign || '', 'New', '']);

    try {
      const hot = d.status === 'HOT';
      MailApp.sendEmail(NOTIFY_EMAIL,
        (hot ? '🔥 HOT lead: ' : 'New lead: ') + (d.name || 'Unknown') + ' — ' + (d.interestedIn || d.segment || ''),
        'Lead ID: ' + leadId + '\nName: ' + (d.name || '') + '\nPhone: ' + (d.phone || '') +
        '\nEmail: ' + (d.email || '') + '\nCompany: ' + (d.company || '') + '\nIndustry: ' + (d.industry || '') +
        '\nStatus: ' + (d.status || '') + '\nSegment: ' + (d.segment || '') + '\nInterested in: ' + (d.interestedIn || '') +
        '\nSource: ' + (d.source || '') + '\nMessage: ' + (d.message || '') + '\nPage: ' + (d.pageUrl || ''));
    } catch (mailErr) { /* never fail the lead because of email */ }

    return out_({ ok: true, leadId: leadId });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#111827').setFontColor('#F5C518');
    sheet.getRange('E:E').setNumberFormat('@'); // keep phone numbers as text
    const range = sheet.getRange('H2:H');
    sheet.setConditionalFormatRules([
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('HOT').setBackground('#F8B4B4').setRanges([range]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('WARM').setBackground('#FDE68A').setRanges([range]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('COLD').setBackground('#BFDBFE').setRanges([range]).build()
    ]);
  }
  return sheet;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Adds a menu: Nexvanta → Download as Excel (.xlsx)
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Nexvanta').addItem('Download as Excel (.xlsx)', 'downloadXlsx').addToUi();
}
function downloadXlsx() {
  const id = SpreadsheetApp.getActiveSpreadsheet().getId();
  const url = 'https://docs.google.com/spreadsheets/d/' + id + '/export?format=xlsx';
  const html = HtmlService.createHtmlOutput('<script>window.open("' + url + '");google.script.host.close();</script>');
  SpreadsheetApp.getUi().showModalDialog(html, 'Preparing Excel file...');
}
