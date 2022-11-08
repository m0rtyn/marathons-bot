
import "dotenv/config.js"

// export const GOOGLE_CREDENTIALS = process.env.GOOGLE_SECRETS
export const CREDENTIALS_PATH = "./secrets.json"
export const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]


export const SS_ID = process.env.SS_ID
export const SS_URL = "https://docs.google.com/spreadsheets/d/" + SS_ID

export enum SHEETS {
  MEMBERS = "Board",
  CONTENTS = "Contents",
  TEAMS = "Leaderboard",
}

export const CONTENTS_ADDRESS = `${SHEETS.CONTENTS}!A1:B47`
export const CHALLENGES_ADDRESS = `${SHEETS.CONTENTS}!C1:C45`

export const MEMBERS_NAMES_COLUMN = "B"
export const CHAPTERS_RANGE_START = "D"
export const CHAPTERS_RANGE_END = "AN"
export const CHAPTERS_PAGES_ROW = "2"
export const MEMBER_NAMES_ADDRESS = `${SHEETS.MEMBERS}!${MEMBERS_NAMES_COLUMN}1:${MEMBERS_NAMES_COLUMN}`
