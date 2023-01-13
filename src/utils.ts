import { CHAPTER_COLUMNS_OFFSET, MAX_CHAPTER_NUMBER } from "./constants/index.js";

const ALPHABET_SIZE = 26;
const CHAR_CODE_OFFSET = 64; // A is 65 in ASCII
const COMPLIMENTS = [
  "cute 😊",
  "smart 🤓",
  "beautiful 😉",
  "amazing 🤩",
  "awesome 👍",
  "wonderful 😻",
  "great 😃",
  "cool 😎",
  "nice 🙂",
  "funny 😁",
  "interesting 🤔",
  "amusing 😂",
  "charming 😘",
  "delightful 😌",
  "enchanting 🧙",
  "entertaining 😜",
  "fascinating 🤩",
  "glamorous 😘",
  "good\\-looking 😉",
  "handsome ☺️",
  "lovely 🥰",
  "magnificent 😳",
  "marvelous 🙃",
  "nice\\-looking 😊",
  "pleasant 😇",
  "pretty 🥺",
  "sexy 😘",
]

export function getChapterLetter(chapterNumber: number) {
  if (chapterNumber > MAX_CHAPTER_NUMBER) {
    throw new Error(`Chapter number ${chapterNumber} is not supported`);
  }

  const chapterCharCode = chapterNumber + CHAR_CODE_OFFSET + CHAPTER_COLUMNS_OFFSET

  if (chapterNumber > ALPHABET_SIZE - CHAPTER_COLUMNS_OFFSET) {
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

export const getCompliment = () => {
  const randomIndex = Math.round(Math.random() * COMPLIMENTS.length)

  return COMPLIMENTS[randomIndex] || "the best"
}
