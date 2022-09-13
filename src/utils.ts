export function getChapterLetter(chapterNumber: number) {
  if (chapterNumber < 26) {
    // NOTE::+1 because of the 0-based index, +64 because of the A in A1
    return String.fromCharCode(chapterNumber + 1 + 64)
  } else if (chapterNumber < 37) {
    // NOTE: -26 because of removing the first 26 codes of the column
    return `A${String.fromCharCode(chapterNumber - 26 + 1 + 64)}`
  }

  throw new Error(`Chapter number ${chapterNumber} is not supported`)
}

export const getUserHyperlinkFormulaText = (username: string) => {
  return `=hyperlink("https://t.me/${username}"; "${username}")`
}
