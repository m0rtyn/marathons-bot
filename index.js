/* eslint-disable no-unused-vars */
import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const CREDENTIALS_PATH = './secrets.json'

const BOT_TOKEN = '5452521811:AAFbNrmLncbzPQDbMJ9eZ1wzBKb-Qy1DRTM'
const telegramUrl = 'https://api.telegram.org/bot' + BOT_TOKEN
const webAppUrl = 'https://script.google.com/macros/s/AKfycbxPNwihczsww9CqS123EgVB0GHms2xmuL48U_-4gSXGRNXnF0kGWNxArVsGoMJszr2qdA/exec'

const SS_ID = '1JNsD8ZUJoxiJ9-Ea-hxnUgdoiyuOVIKn0KBgPiaLiKw'
const ADMIN_ID = 'm0rtyn'
const HELP_TEXT = 'Hello user! This marathon allows you to track your progress in Martyn\'s marathons. Please send commands (starting with \'/\') to navigate the bot. Always wait for a response of the bot before entering another text. Enjoy easy transfer!'

const auth = new google.auth.JWT({
  // TODO: add reading from secrets 
  keyFile: CREDENTIALS_PATH,
  scopes: SCOPES,
})

const participants = await getParticipantNameList(auth)
console.log("🚀 ~ participants", participants)


async function getParticipantNameList(auth) {
  const sheets = google.sheets({ version: 'v4', auth })

  try {
    return sheets.spreadsheets.values.get({
      spreadsheetId: SS_ID,
      range: 'Board!A2:A',
    }).then(res => {
      return res?.data?.values?.flat()
    })
  } catch (err) {
    console.error(err)
  }
}