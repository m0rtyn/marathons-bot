import { google, sheets_v4 } from "googleapis"
import { JWT } from "googleapis-common"
import { CREDENTIALS_PATH, SCOPES, SS_ID } from "./constants.js"
import { getChapterLetter, getUserHyperlinkFormulaText } from "./utils.js"

const auth = new google.auth.JWT({
  keyFile: CREDENTIALS_PATH,
  scopes: SCOPES,
})

export const getValuesFromSheet = async (
  sheets: sheets_v4.Sheets,
  range: string
) => {
  try {
    return sheets.spreadsheets.values
      .get({
        spreadsheetId: SS_ID,
        range,
      })
      .then((res) => {
        return res.data.values?.flat() || []
      })
  } catch (err) {
    console.error(err)
    throw new Error("The API returned an error: " + err)
  }
}

export async function getParticipantNameList(
  auth: JWT
): Promise<string[] | never> {
  const sheets = google.sheets({ version: "v4", auth })

  return getValuesFromSheet(sheets, "Board!A2:A")
}

export async function checkUser(username: string) {
  const users = await getParticipantNameList(auth)
  return users.includes(username)
}

export async function getNextChapterNumber(username: string) {
  const sheets = google.sheets({ version: "v4", auth })
  const userRowNumber = await getUserRowNumber(username)
  const range = `Board!B${userRowNumber}:${userRowNumber}` // E.g. Board!B4:4 full forth row only with user's chapters

  const values = await getValuesFromSheet(sheets, range) as string[]
  
  const firstUnreadIndex = values.indexOf("FALSE")
  if (firstUnreadIndex === -1) return null

  const chapterNumber = firstUnreadIndex + 1 // +1 because of the 0-based index
  return chapterNumber
}

export async function getUserRowNumber(
  username: string
) {
  const users = await getParticipantNameList(auth)

  const userIndex = users.indexOf(username)
  if (userIndex === -1) return null

  // +2 because of header and 0-based index
  return userIndex + 2
}

export async function setChapterAsRead(username: string, chapterNumber: number) {
  const sheets = google.sheets({ version: "v4", auth })
  const userRowNumber = await getUserRowNumber(username)

  if (!userRowNumber) return null

  const chapterAlpha = getChapterLetter(chapterNumber)

  const range = `Board!${chapterAlpha}${userRowNumber}`
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
  const sheets = google.sheets({ version: "v4", auth })

  const newRowNumber = await getParticipantNameList(auth).then((users) => users.length + 1) // +1 because of header
  const range = `Board!A${newRowNumber}`

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

