import { google, sheets_v4 } from "googleapis"
import { JWT } from "googleapis-common"
import { CREDENTIALS_PATH, SCOPES, SS_ID } from "./constants.js"

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

export async function getNextChapterNumber(username: string): Promise<number | null> {
  const sheets = google.sheets({ version: "v4", auth })
  const userRowNumber = await getUserRowAlpha(username)
  const range = `Board!B${userRowNumber}:${userRowNumber}`

  const values = await getValuesFromSheet(sheets, range) as string[]
  
  const firstUnreadNumber = values.indexOf("FALSE")
  if (firstUnreadNumber === -1) return null

  const chapterNumber = firstUnreadNumber + 2 // +2 because of the 0-based index and header row
  return chapterNumber
}

export async function getUserRowAlpha(
  username: string
): Promise<number | null> {
  const users = await getParticipantNameList(auth)

  const userIndex = users.indexOf(username)
  if (userIndex === -1) return null

  // +2 because of header and 0-based index
  return userIndex + 2
}

export async function setChapterAsRead(username: string, chapterAlpha: number) {
  const sheets = google.sheets({ version: "v4", auth })
  const userRowNumber = await getUserRowAlpha(username)

  if (!userRowNumber) return null

  const chapterAlphabetIndex = String.fromCharCode(chapterAlpha + 64)

  const range = `Board!${chapterAlphabetIndex}${userRowNumber}`
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

const getUserHyperlinkFormulaText = (username: string) => {
  return `=hyperlink("https://t.me/${username}"; "${username}")`
}
