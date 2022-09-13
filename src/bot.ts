import { Context, Markup } from "telegraf"
import axios from "axios"
import { Answers, SS_URL, TELEGRAM_BOT_URL, WEB_APP_URL } from "./constants.js"
import {
  addParticipantToSheet,
  checkUser,
  getNextChapterNumber,
  setChapterAsRead,
} from "./spreadsheet.js"
import { getChapterLetter } from "./utils.js"

export async function onStart(ctx: Context) {
  const username = ctx.message?.from.username
  if (!username) throw new Error("No username found")

  const isLoggedIn = await checkUser(username)
  if (isLoggedIn) {
    await ctx.reply("You are logged in")
    return await askNextChapter(ctx)
  }
  
  return await loggingInUser(ctx)
}

async function loggingInUser(ctx: Context) {
  const buttons = [
    Markup.button.text(Answers.LOG_ME_IN),
    Markup.button.text(Answers.NEVERMORE),
  ]
  return await ctx.reply(
    "Would you like to join a marathon?",
    Markup.keyboard(buttons).oneTime().resize()
  )
}

export async function logUserIn(ctx: Context) {
  const username = ctx.message?.from.username
  if (!username) throw new Error("No username found")

  await addParticipantToSheet(username)
  await ctx.reply(
    `Now, you are logged in the marathon. \nYou can check it at ${SS_URL}`
  )

  return await askNextChapter(ctx)
}

export async function onChapterYes(ctx: Context) {
  const username = ctx.from?.username

  if (!username) throw new Error("Username is not defined")

  const nextChapterNumber = await getNextChapterNumber(username)

  if (!nextChapterNumber) {
    return await finishMarathon(ctx)
  }

  await setChapterAsRead(username, nextChapterNumber)
  await ctx.reply("Ok, next chapter")
  return await askNextChapter(ctx)
}

export async function askNextChapter(ctx: Context) {
  const username = ctx.message?.from.username
  if (!username) throw new Error("No username found")

  const nextChapterNumber = await getNextChapterNumber(username)
  if (!nextChapterNumber) {
    throw new Error(`There are no any chapters left. \nYou can check it at ${SS_URL} \nDebug: ${nextChapterNumber}`)
  }

  const chapterLetter = getChapterLetter(nextChapterNumber)
  if (chapterLetter === null) {
    return await finishMarathon(ctx)
  }

  const replyText = `Do you read chapter ${nextChapterNumber} (column: ${chapterLetter.toUpperCase()})?`
  const buttons = [
    Markup.button.text(Answers.YES),
    Markup.button.text(Answers.NO),
    Markup.button.text(Answers.OTHER),
  ]

  return await ctx.reply(replyText, Markup.keyboard(buttons).oneTime().resize())
}

export async function setWebhook() {
  const url = TELEGRAM_BOT_URL + "/setWebhook?url=" + WEB_APP_URL
  await axios(url)
}

export async function finishMarathon(ctx: Context) {
  return ctx.reply("You have finished the marathon!")
}

export async function test(ctx: Context) {
  // console.log(ctx.message)
  console.log("🚀 ~ test ~ TEST", ctx)
  // ctx.callbackQuery.data = 'chapter_yes'
}

export async function selectOtherChapter(ctx: Context) {
  await ctx.reply("Selecting other chapters yet in progress. So, I ask you again.")
  return await askNextChapter(ctx)
}
