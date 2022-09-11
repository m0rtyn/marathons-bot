import "dotenv/config.js"

// export const GOOGLE_CREDENTIALS = process.env.GOOGLE_SECRETS
export const CREDENTIALS_PATH = "./secrets.json"
export const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

export const SS_ID = process.env.SS_ID
export const SS_URL = "https://docs.google.com/spreadsheets/d/" + SS_ID
export const ADMIN_ID = "m0rtyn"
export const HELP_TEXT =
  "Hello user! This marathon allows you to track your progress in Martyn's marathons. Please send commands (starting with '/') to navigate the bot. Always wait for a response of the bot before entering another text. Enjoy easy transfer!"

export const BOT_TOKEN = process.env.BOT_TOKEN
export const TELEGRAM_BOT_URL = "https://api.telegram.org/bot" + BOT_TOKEN

export const RENDER_URL = process.env.RENDER_URL
export const NGROK_URL = process.env.NGROK_URL

export const WEB_APP_URL =
  process.env.NODE_ENV === "development" ? NGROK_URL : RENDER_URL
export const WEBHOOK_URL = TELEGRAM_BOT_URL + "/setWebhook?url=" + WEB_APP_URL

export enum Answers {
  YES = "Yes",
  NO = "No",
  OTHER = "Other",
  LOG_ME_IN = "Log me in",
  NEVERMORE = "Nevermore",
}
