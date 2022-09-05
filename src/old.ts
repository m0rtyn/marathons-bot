// import * as fs from 'fs';
// import * as readline from 'readline'
// import * as google from 'googleapis'

// google as typeof google.GoogleApis
// const OAuth2 = google.auth.OAuth2;

// const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// const CREDENTIALS_PATH = './credentials.json';

// const BOT_TOKEN = "5452521811:AAFbNrmLncbzPQDbMJ9eZ1wzBKb-Qy1DRTM";
// const telegramUrl = "https://api.telegram.org/bot" + BOT_TOKEN;
// const webAppUrl = "https://script.google.com/macros/s/AKfycbxPNwihczsww9CqS123EgVB0GHms2xmuL48U_-4gSXGRNXnF0kGWNxArVsGoMJszr2qdA/exec";
// const SS_ID = "1JNsD8ZUJoxiJ9-Ea-hxnUgdoiyuOVIKn0KBgPiaLiKw";
// const ADMIN_ID = "m0rtyn";
// const help_text = "Hello user! This marathon allows you to track your progress in Martyn's marathons. Please send commands (starting with '/') to navigate the bot. Always wait for a response of the bot before entering another text. Enjoy easy transfer!"

// function authorize(credentials, callback) {
//   const {client_secret, client_id, redirect_uris, refresh_token} = credentials.web;
  
//   const oAuth2Client = new OAuth2(
//     client_id,
//     client_secret,
//     redirect_uris[0]
//   );

//   oAuth2Client.setCredentials(
//     { 
//       refresh_token, 
//       expiry_date: true
//     }
// );

//   // Check if we have previously stored a token.
//   fs.readFile('token.json', (err, token) => {
//     if (err) return getNewToken(oAuth2Client, callback);

//     oAuth2Client.setCredentials(JSON.parse(token.toString()));
//     callback(oAuth2Client);
//   });
// }

// // Load client secrets from a local file.
// fs.readFile(CREDENTIALS_PATH, (err, content) => {
//   if (err) return console.error('Error loading client secret file:', err);

//   const token = JSON.parse(content.toString())
//   authorize(token, printDocTitle);
// });

// type getEventsCallback = (events: any) => void
// function getNewToken(oAuth2Client: typeof OAuth2, callback: getEventsCallback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });

//   console.info('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();

//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err);

//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile('token.json', JSON.stringify(token), (err) => {
//         if (err) console.error(err);
//         console.info('Token stored to', 'token.json');
//       });

//       callback(oAuth2Client);
//     });
//   });
// }

// async function printDocTitle(auth: typeof OAuth2) {
//   const sheets = google.sheets('v4');

//   const request = {
//     spreadsheetId: SS_ID,
//     ranges: ['A1:B3'],
//     includeGridData: true,
//     auth,
//   };

//   try {
//     const response = (await sheets.spreadsheets.get(request)).data;
//     console.log("🚀 ~ printDocTitle ~ response", response);
//   } catch (err) {
//     console.error(err);
//   }
// }



// // const command7 = "/help";
// // const command10 = "/start";

// // function doGet(e) {
// //   const params = JSON.stringify(e);
// //   return HtmlService.createHtmlOutput(params);
// // }

// // function getMe() {
// //   const url = telegramUrl + "/getMe";
// //   const response = UrlFetchApp.fetch(url);
// //   return console.log(response.getContentText());
// // }

// // function setWebhook() {
// //   var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
// //   console.log(url)
// //   var response = UrlFetchApp.fetch(url);
// //   console.log(response.getContentText());
// // }
// // function deleteWebhook() {
// //   var url = telegramUrl + "/deleteWebhook?url=" + webAppUrl;
// //   var response = UrlFetchApp.fetch(url);
// //   console.log(response.getContentText());
// // }

// // function sendMessage(chat_id, text = '') {
// //   var url = telegramUrl + "/sendMessage?chat_id=" + chat_id + "&text=" + help_text;
// //   var response = UrlFetchApp.fetch(url);
// //   console.log(response.getContentText());
// // }

// // function findUserRowIndex(userId) {
// //     const spreadsheet = SpreadsheetApp.openById(ssId);
// //     const sheet = spreadsheet.getSheets()[0];
// //     const users = sheet.getRange("A2:A").getValues();
// //     const userRowIndex = users.findIndex(u => u[0] === userId)

// //     return userRowIndex
// // }

// // function getUserRow(userRowIndex) {
  
// // }

// // function doPost(e) {
// //   try {
// //     const data = JSON.parse(e.postData.contents);
// //     const userId = data.message.chat.id;

// //     const userRowIndex = findUserRowIndex(userId)
// //     const userRow = getUserRow(userRowIndex)
    
// //     sendMessage(id);
// //   } catch(e) {
// //     sendMessage(adminId, JSON.stringify(e,null,4));
// //   }
// // }

// // function tests() {
// //   const result = findUserRowIndex('m0rtyn')
// //   console.log(result)
// // }