import { Context, Markup } from "telegraf"
import axios from "axios"
import { Answers, MESSAGES, TELEGRAM_BOT_URL, WEB_APP_URL } from "./constants.js"
import {
  addParticipantToSheet,
  checkUser,
  getChapterPage,
  getNextChapterName as getChapterName,
  getNextChapterNumber,
  setChapterAsRead,
} from "./spreadsheet.js"

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
    MESSAGES.JOIN_MARATHON,
    Markup.keyboard(buttons).oneTime().resize()
  )
}

export async function logUserIn(ctx: Context) {
  const username = ctx.message?.from.username
  if (!username) throw new Error("No username found")

  await addParticipantToSheet(username)
  await ctx.reply(
    MESSAGES.LOGGED_IN_MESSAGE,
  )

  return await askNextChapter(ctx)
}

export async function onChapterRead(ctx: Context) {
  const username = ctx.from?.username

  if (!username) throw new Error("Username is not defined")

  const nextChapterNumber = await getNextChapterNumber(username)

  if (!nextChapterNumber) {
    return await finishMarathon(ctx)
  }

  await setChapterAsRead(username, nextChapterNumber)
  await ctx.reply(MESSAGES.NEXT_CHAPTER)
  return await askNextChapter(ctx)
}

export async function askNextChapter(ctx: Context) {
  const username = ctx.message?.from.username
  if (!username) throw new Error("No username found")

  const nextChapterNumber = await getNextChapterNumber(username)
  if (nextChapterNumber === null) return await finishMarathon(ctx)

  if (!nextChapterNumber) throw new Error(MESSAGES.NO_CHAPTER_FOUND)
  
  const nextChapterPage =  await getChapterPage(nextChapterNumber)
  const nextChapterName = await getChapterName(nextChapterPage)

  const replyText = `${MESSAGES.CHAPTER_QUESTION} «${nextChapterName}» (page: ${nextChapterPage})?`
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
  return ctx.reply(MESSAGES.MARATHON_FINISHED)
}

export async function test(ctx: Context) {
  // console.log(ctx.message)
  console.log("🚀 ~ test ~ TEST", ctx)
  // ctx.callbackQuery.data = 'chapter_yes'
}

export async function selectOtherChapter(ctx: Context) {
  await ctx.reply(MESSAGES.SELECT_OTHER_CHAPTER)
  return await askNextChapter(ctx)
}
