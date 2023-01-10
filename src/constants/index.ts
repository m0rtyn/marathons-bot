import * as texts from "./texts.js"
import * as spreadsheet from "./spreadsheet.js"
import * as bot from "./bot.js"
import * as dev from "./dev.js"

export const { MESSAGES, Answers } = texts
export const { WEBHOOK_URL } = dev
export const {
  ADMIN_ID,
  HELP_TEXT,
  BOT_TOKEN,
  TELEGRAM_BOT_URL,
} = bot
export const {
  SS_ID,
  SHEETS,
  CONTENTS_ADDRESS,
  CHALLENGES_ADDRESS,
  MEMBERS_NAMES_COLUMN,
  CHAPTERS_RANGE_START,
  CHAPTERS_RANGE_END,
  CHAPTERS_PAGES_ROW,
  MEMBER_NAMES_ADDRESS,
  CREDENTIALS_PATH,
  SCOPES,
  CHAPTER_COLUMNS_OFFSET,
  MAX_CHAPTER_NUMBER,
  PROGRESS_COLUMN,
  PROGRESS_START_ROW,
} = spreadsheet
