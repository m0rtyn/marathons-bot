import { google } from "googleapis"
import { JWT } from "googleapis-common"
import { CREDENTIALS_PATH, SCOPES, SS_ID } from "./constants.js"

const auth = new google.auth.JWT({
  // TODO: add reading from secrets 
  keyFile: CREDENTIALS_PATH,
  scopes: SCOPES,
})

export async function getParticipantNameList(auth: JWT): Promise<string[]> {
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

export async function checkUser (username: string)  {
  const users = await getParticipantNameList(auth)
  return users?.includes(username)
}

export async function getNextChapter (username: string) {
  const sheets = google.sheets({ version: 'v4', auth })
  const userRowNumber = (await getUserRowIndex(username)) + 1
  const range = `Board!B${userRowNumber}:${userRowNumber}`

  const values = await sheets.spreadsheets.values.get({
    spreadsheetId: SS_ID,
    range,
  }).then(res => {
    return res?.data?.values?.flat()
  })

  const firstUnreadIndex = values?.indexOf('FALSE')
  console.log("🚀 ~ getNextChapter ~ firstUnreadIndex", values, firstUnreadIndex)
  return firstUnreadIndex && firstUnreadIndex !== -1 ? firstUnreadIndex + 1 : 1
}

export async function getUserRowIndex(username: string) {
  const users = await getParticipantNameList(auth)

  const userIndex = users.indexOf(username)
  if (!userIndex) {
    return null
  }

  // +2 because of header and 0-based index
  return userIndex + 2
}

export async function setChapterAsRead (username: string, chapterIndex: number) {
  const sheets = google.sheets({ version: 'v4', auth })
  const userRowIndex = (await getUserRowIndex(username)) + 1
  const chapterAlphabetIndex = String.fromCharCode(chapterIndex + 1 + 64)

  const range = `Board!${chapterAlphabetIndex}${userRowIndex}:AO${userRowIndex}`
  const requestBody = { values: [[true]] }
  // console.log("🚀 ~ setChapterAsRead ~ range", range)

  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SS_ID,
      requestBody,
      valueInputOption: 'USER_ENTERED',
      range,
    })
    // console.log("🚀 ~ setChapterAsRead ~ response", response)

    return response
  } catch (err) {
    console.error(err) 
  }
}

export async function addParticipantToSheet(username: string) {
  const sheets = google.sheets({ version: 'v4', auth })
  const userRowNumber = (await getUserRowIndex(username)) + 1
  const range = `Board!A${userRowNumber}`

  const userRow = [getUserHyperlinkFormulaText(username)]
  // TODO: rework to adding new row
  const requestBody = { values: [userRow] }

  try {
    const response = await sheets.spreadsheets.values.append({
      valueInputOption: 'USER_ENTERED',
      spreadsheetId: SS_ID,
      range,
      requestBody,
    })

    return response
  } catch (err) {
    console.error(err) 
  }
}

const getUserHyperlinkFormulaText = (username: string) => {
  return `=hyperlink("https://t.me/${username}"; "@${username}")`
}