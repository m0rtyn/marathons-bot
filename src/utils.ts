const MAX_CHAPTER_NUMBER = 37;
const ALPHABET_SIZE = 26;
const CHAR_CODE_OFFSET = 64; // A is 65 in ASCII
const CHAPTER_COLUMNS_OFFSET = 3

export function getChapterLetter(chapterNumber: number) {
  if (chapterNumber > MAX_CHAPTER_NUMBER) {
    throw new Error(`Chapter number ${chapterNumber} is not supported`);
  }

  const chapterCharCode = chapterNumber + CHAR_CODE_OFFSET + CHAPTER_COLUMNS_OFFSET

  if (chapterNumber > ALPHABET_SIZE) {
    // NOTE: for repeated letters in sheet's columns. E.g. AA, AB, AC, etc.
    const cellColumnLetter = String.fromCharCode(chapterCharCode - ALPHABET_SIZE);
    return `A${cellColumnLetter}`;
  } else {
    return String.fromCharCode(chapterCharCode);
  }
}

export const getUserHyperlinkFormulaText = (username: string) => {
  return `=hyperlink("https://t.me/${username}"; "${username}")`
}
