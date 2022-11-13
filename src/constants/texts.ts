import { SS_URL } from "./spreadsheet.js"

export enum Answers {
  YES = "Yes ✅",
  NO = "No ❌",
  OTHER = "Other chapter 🟡",
  LOG_ME_IN = "Log me in 📝",
  NEVERMORE = "Nevermore 🙅",
  ADD_CHAPTER = "Add chapter 📖",
  HANDBOOK = "Get the handbook 📓",
  TABLE = "To the table 📊",
}

export const MESSAGES = {
  JOIN_MARATHON: "Would you like to join a marathon?",
  LOGGED_IN_MESSAGE: `Now, you are logged in the marathon. \nYou can check it at ${SS_URL}`,
  NEXT_CHAPTER: "Ok, next chapter",
  CHAPTER_QUESTION: "Did you read chapter", // Full: Did you read chapter 3 (page: 5)?
  NO_CHAPTER_FOUND: `There are no any chapters left. \nYou can check it at ${SS_URL}`,
  MARATHON_FINISHED: "You have finished the marathon!",
  SELECT_OTHER_CHAPTER: "Please, send me the number of the chapter you want to read",
  HELP: "Chill, you can ask @m0rtyn about problems with me.",
  UNKNOWN_TEXT: "Sorry, I don't understand you. Try to use answer buttons instead of typing text. Also you can ask @m0rtyn for help about me.",
  ERROR: "Sorry, something went wrong. Try to reboot with /start command or ask @m0rtyn for help.",
  OTHER_CHAPTER_SELECTION: "Please, send me the number of the chapter you read from picture below"
}
