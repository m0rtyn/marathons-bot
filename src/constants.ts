import "dotenv/config.js"

// export const GOOGLE_CREDENTIALS = process.env.GOOGLE_SECRETS
export const CREDENTIALS_PATH = "./secrets.json"
export const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

export const SS_ID = process.env.SS_ID
const SS_URL = "https://docs.google.com/spreadsheets/d/" + SS_ID
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

export const MESSAGES = {
  JOIN_MARATHON: "Would you like to join a marathon?",
  LOGGED_IN_MESSAGE: `Now, you are logged in the marathon. \nYou can check it at ${SS_URL}`,
  NEXT_CHAPTER: "Ok, next chapter",
  CHAPTER_QUESTION: "Did you read chapter", // Full: Did you read chapter 3 (page: 5)?
  NO_CHAPTER_FOUND: `There are no any chapters left. \nYou can check it at ${SS_URL}`,
  MARATHON_FINISHED: "You have finished the marathon!",
  SELECT_OTHER_CHAPTER: "Selecting other chapters yet in progress. So, I ask you again.",
  HELP: "Calm down. You can ask @m0rtyn about problems with me.",
  UNKNOWN_TEXT: "Sorry, I don't understand you. Try to use answer buttons instead of typing text. Also you can ask @m0rtyn for help about me.",
}

export enum SHEETS {
  MEMBERS = "Board",
  CONTENTS = "Contents",
  TEAMS = "Leaderboard",
}

export const CONTENTS_ADDRESS =  `${SHEETS.CONTENTS}!A1:B45`
export const MEMBER_NAMES_ADDRESS = `${SHEETS.MEMBERS}!A2:A`
