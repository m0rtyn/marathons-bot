import "dotenv/config.js"

export const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
export const CREDENTIALS_PATH = "./secrets.json"

export const SS_ID = process.env.SS_ID
export const SS_URL = "https://docs.google.com/spreadsheets/d/" + SS_ID
export const ADMIN_ID = "m0rtyn"
export const HELP_TEXT =
  "Hello user! This marathon allows you to track your progress in Martyn's marathons. Please send commands (starting with '/') to navigate the bot. Always wait for a response of the bot before entering another text. Enjoy easy transfer!"

export const BOT_TOKEN = process.env.BOT_TOKEN

export const TELEGRAM_URL = "https://api.telegram.org/bot" + BOT_TOKEN
export const WEB_APP_URL =
  process.env.NODE_ENV === "development"
    ? "https://574b-46-70-171-166.ngrok.io"
    : "https://marathons-bot.onrender.com"
export const WEBHOOK_URL = TELEGRAM_URL + "/setWebhook?url=" + WEB_APP_URL

export enum Answers {
  YES = "Yes",
  NO = "No",
  OTHER = "Other",
  LOG_ME_IN = "Log me in",
  NEVERMORE = "Nevermore",
}
