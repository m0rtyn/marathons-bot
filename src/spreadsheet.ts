import { google, sheets_v4 } from "googleapis"
import { JWT } from "googleapis-common"
import { CHAPTERS_PAGES_ROW, CHAPTERS_RANGE_END, CHAPTERS_RANGE_START, CONTENTS_ADDRESS, CREDENTIALS_PATH, MAX_CHAPTER_NUMBER, MEMBERS_NAMES_COLUMN, MEMBER_NAMES_ADDRESS, SCOPES, SHEETS, SS_ID, PROGRESS_COLUMN, PROGRESS_START_ROW } from "./constants/index.js"
import { getChapterLetter, getUserHyperlinkFormulaText } from "./utils.js"

const auth = new google.auth.JWT({
  keyFile: CREDENTIALS_PATH,
  scopes: SCOPES,
})
const sheets = google.sheets({ version: "v4", auth })

export const getValuesFromSheet = async (
  sheets: sheets_v4.Sheets,
  range: string,
  majorDimension: "ROWS" | "COLUMNS" = "ROWS"
): Promise<string[][]> => {
  try {
    return sheets.spreadsheets.values
      .get({
        spreadsheetId: SS_ID,
        range,
        majorDimension,
      })
      .then((res) => {
        return res.data.values || []
      })
  } catch (err) {
    console.error(err)
    throw new Error("The API returned an error: " + err)
  }
}

export async function getParticipantNameList(
  auth: JWT
): Promise<string[] | never> {
  return (await getValuesFromSheet(sheets, MEMBER_NAMES_ADDRESS)).flat()
}

export async function checkUser(username: string) {
  const users = await getParticipantNameList(auth)
  return users.includes(username)
}

export async function getNextChapterNumber(username: string) {
  const userRowNumber = await getUserRowNumber(username)
  const range = `${SHEETS.MEMBERS}!${CHAPTERS_RANGE_START}${userRowNumber}:${userRowNumber}` // E.g. Board!B4:4 full forth row only with user's chapters

  const values = (await (
    await getValuesFromSheet(sheets, range)
  ).flat()) as string[]

  const firstUnreadIndex = values.indexOf("FALSE")
  if (firstUnreadIndex === -1 || firstUnreadIndex === MAX_CHAPTER_NUMBER) return null

  const chapterNumber = firstUnreadIndex + 1 // +1 because of the 0-based index
  return chapterNumber
}

export async function getChapterName(
  chapterPage: number
) {
  const [chapterPages, chapterNames] = await getValuesFromSheet(
    sheets,
    CONTENTS_ADDRESS,
    "COLUMNS"
  )

  const chapterRowIndex = chapterPages.indexOf(chapterPage.toString())
  const chapterName = chapterNames[chapterRowIndex]

  return chapterName
}

export async function getUserRowNumber(username: string) {
  const users = await getParticipantNameList(auth)

  const userIndex = users.indexOf(username)
  if (userIndex === -1) return null

  return userIndex + 3 // +3 because of the 2 rows of headers and 0-based index
}

export async function setChapterAsRead(
  username: string,
  chapterNumber: number
) {
  const userRowNumber = await getUserRowNumber(username)

  if (!userRowNumber) return null

  const chapterColumnLetter = getChapterLetter(chapterNumber)
  
  const range = `${SHEETS.MEMBERS}!${chapterColumnLetter}${userRowNumber}`
  const requestBody = { values: [[true]] }
  
  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SS_ID,
      requestBody,
      valueInputOption: "USER_ENTERED",
      range,
    })

    return response
  } catch (err) {
    console.error(err)
    throw new Error("The API returned an error: " + err)
  }
}

export async function addParticipantToSheet(username: string) {
  const newRowNumber = await getParticipantNameList(auth).then(
    (users) => users.length + 1
  ) // +1 because of header
  const range = `${SHEETS.MEMBERS}!${MEMBERS_NAMES_COLUMN}${newRowNumber}`

  const userRow = [getUserHyperlinkFormulaText(username)]
  // TODO: rework to adding new row
  const requestBody = { values: [userRow] }

  try {
    const response = await sheets.spreadsheets.values.append({
      valueInputOption: "USER_ENTERED",
      spreadsheetId: SS_ID,
      range,
      requestBody,
    })

    return response
  } catch (err) {
    console.error(err)
    throw new Error("The API returned an error: " + err)
  }
}

export async function getChapterPage(chapterNumber: number) {
  const chapterColumnLetter = getChapterLetter(chapterNumber)
  const chapterPageAddress = `${SHEETS.MEMBERS}!${chapterColumnLetter}${CHAPTERS_PAGES_ROW}:${chapterColumnLetter}${CHAPTERS_PAGES_ROW}`

  const chapterPage = (await getValuesFromSheet(sheets, chapterPageAddress)).flat()[0]

  if (!chapterPage) throw new Error("Chapter page not found")

  return Number(chapterPage)
}

export const getProgress = async (username: string) => {
  const userRowNumber = await getUserRowNumber(username)
  const userChaptersRange = `${SHEETS.MEMBERS}!${CHAPTERS_RANGE_START}${userRowNumber}:${CHAPTERS_RANGE_END}${userRowNumber}` // E.g. Board!B4:Z4 full forth row only with user's chapters
  const readChapters = (await getValuesFromSheet(sheets, userChaptersRange))
    .flat()
    .filter(value => value === 'TRUE')
    .length
  // TODO: make progress calculation based of pages, not chapters
  const progress = Math.round((readChapters / MAX_CHAPTER_NUMBER) * 100)
  return progress
}

export const getBetterThanPercent = async (progress: number) => {
  const usersProgressesRange = `${SHEETS.MEMBERS}!${PROGRESS_COLUMN}${PROGRESS_START_ROW}:${PROGRESS_COLUMN}` // E.g. Board!B4:Z4 full forth row only with user's chapters
  const usersProgresses = (await getValuesFromSheet(sheets, usersProgressesRange)).flat().map((progress: string) => Number.parseInt(progress))
  
  const betterThan = usersProgresses.filter((userProgress) => progress > userProgress).length
  const betterThanPercent = Math.round((betterThan / (usersProgresses.length - 1)) * 100)
  
  return betterThanPercent
}

export const getTeamProgress = async (username: string) => 100500
export const getTeamPlace = async (username: string) => 100500
export const getTeamName = async (username: string) => "Team name"
export const getDaysLeft = async (username: string) => 100500