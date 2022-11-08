import axios from "axios"
import { Context, Markup } from "telegraf"
import {
  Answers,
  MESSAGES,
  WEBHOOK_URL,
} from "./constants/index.js"
import { dialogState } from "./index.js"
import {
  addParticipantToSheet,
  checkUser,
  getChapterPage,
  getChapterName as getChapterName,
  getNextChapterNumber,
  setChapterAsRead,
} from "./spreadsheet.js"

const CHAPTERS_PIC_URL =
  "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ba021b21-4b3e-41b1-b982-234fac16de34/CleanShot_2022-11-07_at_16.40.172x.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221108%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221108T135140Z&X-Amz-Expires=86400&X-Amz-Signature=ad45c9f635a33d2510a2675763f10c3e74ae93ff98eec9592397b2bd48717dd1&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22CleanShot%25202022-11-07%2520at%252016.40.17%25402x.png%22&x-id=GetObject"

export async function onStart(ctx: Context) {
  const username = ctx.message?.from.username
  if (!username) throw new Error("No username found")

  const isLoggedIn = await checkUser(username)
  if (isLoggedIn) {
    const keyboard = Markup.keyboard([
      // Markup.button.text("Команда"), // TODO: add team command
      // Markup.button.text("Статистика"), // TODO: add stats command
      Markup.button.callback(Answers.ADD_CHAPTER, "add_chapter"),
      Markup.button.callback(Answers.HANDBOOK, 'handbook'),
      Markup.button.callback(Answers.TABLE, 'table'),
    ])
    
    await ctx.reply("You are logged in")
    return await ctx.reply(
      `Hello, ${username}`,
      keyboard
    )
  } else {
    return await loggingInUser(ctx)
  }
}

async function loggingInUser(ctx: Context) {
  const buttons = [
    [
      Markup.button.callback(Answers.LOG_ME_IN, Answers.LOG_ME_IN),
      Markup.button.callback(Answers.NEVERMORE, Answers.NEVERMORE),
    ],
  ]
  return await ctx.reply(MESSAGES.JOIN_MARATHON, Markup.inlineKeyboard(buttons))
}

export async function logUserIn(ctx: Context) {
  const username = ctx.message?.from.username
  if (!username) throw new Error("No username found")

  await addParticipantToSheet(username)
  await ctx.reply(MESSAGES.LOGGED_IN_MESSAGE)

  return await askNextChapter(ctx)
}

export async function onChapterRead(ctx: Context) {
  const username = ctx.callbackQuery?.from?.username || ctx.from?.username

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
  const username = ctx.callbackQuery?.from.username || ctx.from?.username
  if (!username) throw new Error("No username found")

  const nextChapterNumber = await getNextChapterNumber(username)
  if (nextChapterNumber === null) return await finishMarathon(ctx)

  if (!nextChapterNumber) throw new Error(MESSAGES.NO_CHAPTER_FOUND)

  const nextChapterPage = await getChapterPage(nextChapterNumber)
  const nextChapterName = await getChapterName(nextChapterPage)

  const replyText = `${MESSAGES.CHAPTER_QUESTION} «${nextChapterName}» (page: ${nextChapterPage})?`
  const buttons = [
    [
      Markup.button.callback(Answers.YES, Answers.YES),
      Markup.button.callback(Answers.OTHER, Answers.OTHER),
      Markup.button.callback(Answers.NO, Answers.NO),
    ],
  ]

  return await ctx.reply(replyText, Markup.inlineKeyboard(buttons))
}

export async function setWebhook() {
  await axios(WEBHOOK_URL)
}

export async function finishMarathon(ctx: Context) {
  return ctx.reply(MESSAGES.MARATHON_FINISHED)
}

export async function test(ctx: Context) {
  // console.log(ctx.message)
  console.log("🚀 ~ test ~ TEST", ctx)
}

export async function selectOtherChapter(ctx: Context) {
  const username = ctx.callbackQuery?.from.username || ctx.from?.username
  if (!username) throw new Error("No username found")

  await ctx.reply(MESSAGES.OTHER_CHAPTER_SELECTION)
  await ctx.sendPhoto({ url: CHAPTERS_PIC_URL })
  await ctx.reply('Your answer should be just number. E.g.: "3", "13" or "37"')

  if (ctx.chat?.id) {
    dialogState[ctx.chat.id] = { isOtherChapterSelectionActive: true }
  }

  return
}

// TODO: specify input type
export async function onOtherChapterRead(ctx: any) {
  const messageText = ctx?.message?.text

  if (!ctx.from?.username || !messageText || !ctx.chat?.id) {
    throw new Error("No username or chapter number or chat id found")
  }

  if (!dialogState[ctx.chat.id]?.isOtherChapterSelectionActive) {
    return ctx.reply("You should select adding of the new read chapter first")
  }

  const chapterNumber = Number(messageText)
  dialogState[ctx.chat.id].isOtherChapterSelectionActive = false

  await setChapterAsRead(ctx.from?.username, chapterNumber)
  await ctx.reply(MESSAGES.NEXT_CHAPTER)

  return await askNextChapter(ctx)
}
