// スプレッドシートのURL https://docs.google.com/spreadsheets/d/【ここ】/edit の【ここ】部分を貼る
const SHEET_ID = "ここにスプレッドシートのIDを貼る";
const SHEET_NAME = "community";

function doGet(e) {
  const callback = e.parameter.callback;
  const items = getItems();
  const json = JSON.stringify(items);
  if (callback) {
    return ContentService
      .createTextOutput(callback + "(" + json + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = getSheet();
  sheet.appendRow([new Date(), data.name || "", data.desc || "", data.url || ""]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["timestamp", "name", "desc", "url"]);
  }
  return sheet;
}

function getItems() {
  const sheet = getSheet();
  const rows = sheet.getDataRange().getValues();
  const items = [];
  for (let i = 1; i < rows.length; i++) {
    const [ts, name, desc, url] = rows[i];
    if (name) items.push({ name: name, desc: desc, url: url });
  }
  return items.reverse();
}
