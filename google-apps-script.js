const SHEET_NAME = "messages";
const ID_COL = 1;
const STATE_COL = 2;
const SUBMITTED_ON_COL = 3;
const RECORD_ID_COL = 4;
const NAME_COL = 5;
const EMAIL_COL = 6;
const INST_COL = 7;
const LEVEL_COL = 8;
const MSG_COL = 9;

const MAIL_QUEUED = 'q';
const MAIL_SENT = 's';

function sendEmail(to, from, subj, html, text) {
  GmailApp.sendEmail(to, subj, text, {
    htmlBody: html,
    cc: from,                           // the student
    from: 'lessons@ministryoffolk.com', // where the email is actually sent from
    bcc: 'lessons@ministryoffolk.com',
  });
}

function getSheetByName(name) {
  var ss = SpreadsheetApp.openById("1zKWEcpLuUBIklpj48rGZrx2kFTaALv_R0hTMd6gdVf0"); // messages from squarespace spreadsheet
  var sheets = ss.getSheets();
  for (var n in sheets) {
    if (name == sheets[n].getName()) {
      return sheets[n];
    }
  } 
}

function getTeacherInfo(teacherRecordId) {
  var ss = SpreadsheetApp.openById("1fEkexKhDn3Mb8Pc3hT9Wy6Z2nQbQyNLYl7bV9L93Vr0"); // Ministry Of Folk Data Sheet
  var sheets = ss.getSheets();
  var sheet = sheets[0];
  
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  
  var range = sheet.getRange(1, 1, lastRow, lastCol);
  var values = range.getValues();
  
  var colVals = values[0];
  var recordIdCol = colVals.indexOf('RecordID');
  var emailCol = colVals.indexOf('Email');
  var nameCol = colVals.indexOf('Musician Name');
  
  var recordIds = [];
  var emails = [];
  var names = [];
  for (var i = 0; i < lastRow; i++) {
    let row = values[i];
    recordIds.push(row[recordIdCol]);
    emails.push(row[emailCol]);
    names.push(row[nameCol]);
  }
  
  var teacherRow = recordIds.indexOf(teacherRecordId);
  
  if (!teacherRow) {
    throw new Error(`Teacher record id "${teacherRecordId}" not found`);
    return;
  }

  var email = emails[teacherRow];
  var name = names[teacherRow];
  
  if (!email || email === '') {
    throw new Error(`No email found for record id "${teacherRecordId}"`);
  }
  var firstname = name.split(' ')[0];
  
  return {
    email: email,
    fullname: name,
    firstname: firstname
  };
}

function test() {
  Logger.log(getTeacherInfo(30));
}


function findLastID(sheet, row) {
  if (row < 1) {
    return;
  }
  var id = sheet.getRange(row, ID_COL).getValue();
  
  if (id) {
    return row;
  } else {
    return findLastID(sheet, row - 1);
  }
}
function findLastSentMail(sheet, row) {
  if (row < 1) {
    return 1;
  }
  var state = sheet.getRange(row, STATE_COL).getValue();
  
  if (state === MAIL_SENT) {
    return row;
  } else {
    return findLastSentMail(sheet, row - 1);
  }
}

function detectChange() {
  var sheet = getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error(`sheet "${SHEET_NAME}" not found`);
  }
  var lastRow = sheet.getLastRow();
  
  var submittedOnCol = sheet.getRange(lastRow - 1, SUBMITTED_ON_COL);
  if (!submittedOnCol.getValue()) {
    throw new Error('missing submitted-on date field');
  }
  
  // set id and status
  var lastIdRow = findLastID(sheet, lastRow);
  if (!lastIdRow || lastRow - lastIdRow <= 0) { return; }

  var newValues = [];
  for (var i = 0; i < lastRow - lastIdRow; i++) {
    newValues[i] = [i + lastIdRow, MAIL_QUEUED];
  }
  
  var numRows = lastRow - lastIdRow;
  var numCols = STATE_COL - ID_COL + 1;
  var newRowsRange = sheet.getRange(lastIdRow + 1, ID_COL, numRows, numCols);

  newRowsRange.setValues(newValues);
  
  sendQueuedMails(sheet);
}

function sendQueuedMails(sheet) {
  if (!sheet) {
    sheet = getSheetByName(SHEET_NAME);
  }
  var lastRow = sheet.getLastRow();
  var lastSentMailRow = findLastSentMail(sheet, lastRow);

  var startRow = lastSentMailRow + 1;
  var startCol = SUBMITTED_ON_COL + 1;
  var lastCol = sheet.getLastColumn();
  var numRows = lastRow - lastSentMailRow;
  var numCols = lastCol - startCol + 1;
  if (numRows <= 0) { return; }
  
  var dataRange = sheet.getRange(startRow, startCol, numRows, numCols);
  var data = dataRange.getValues();
  
  var stateVals = [];
  for (var i in data) {
    // TODO: sanitize all this
    var msg = data[i][MSG_COL - startCol];
    var inst = data[i][INST_COL - startCol];
    var level = data[i][LEVEL_COL - startCol];
    var name = data[i][NAME_COL - startCol];
    var recordId = data[i][RECORD_ID_COL - startCol];
    var from = data[i][EMAIL_COL - startCol];
    
    var teacher = getTeacherInfo(recordId);
    
    var subj = "New lesson request via Ministry of Folk";
    
    var msgHtml = `
      <p>Hi ${teacher.firstname},</p>
      <p>You have a new lesson request from <i>${name}</i>!</p>
      <table>
      <tr><td style="vertical-align: top; padding-right: 10px">Instrument/topic:</td><td style="font-style: italic;">${inst}</td></tr>
      <tr><td style="vertical-align: top">Level: </td><td style="font-style: italic;">${level}</td></tr>
      <tr><td style="vertical-align: top">Message:</td><td style="font-style: italic;">${msg}</td></tr>
      </table>
      <br>
      <p>Please respond directly to ${from}.</p>
      <div>Cheers,</div>
      <div>Ministry of Folk</div>
    `;
    var msgText = `
      Hi ${teacher.firstname},
        
      You have a new lesson request from ${name}!
        
      Instrument/topic: ${inst}
      Level: ${level}
      
      Message:
      ${msg}
    
      Please respond directly to ${from}.
    
      --
      Cheers,
      Ministry of Folk
    `;
    
    if (teacher.email && from && msg) {
      Logger.log("sending - to: " + teacher.email + ", from: " + from + ", subj: " + subj + ", msgHtml: " + msgHtml + ", msgText: " + msgText);
      sendEmail(teacher.email, from, subj, msgHtml, msgText);
    }
    stateVals.push([MAIL_SENT]);
  }
  
  var queueRange = sheet.getRange(startRow, STATE_COL, numRows);
  queueRange.setValues(stateVals);
  
  Logger.log(data);
  
}