export function getChapterLetter(chapterNumber: number) {
  // NOTE::+1 because of the 0-based index, +64 because of the A in A1
  return String.fromCharCode(chapterNumber + 1 + 64)
}

export const getUserHyperlinkFormulaText = (username: string) => {
  return `=hyperlink("https://t.me/${username}"; "${username}")`
}
