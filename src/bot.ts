import axios from "axios"
import { Context, Markup } from "telegraf"
import {
  Answers,
  MESSAGES,
  WEBHOOK_URL,
} from "./constants/index.js"
import { BotState, botState, DialogState } from "./index.js"
import {
  addParticipantToSheet,
  checkUser,
  getChapterPage,
  getChapterName,
  getNextChapterNumber,
  setChapterAsRead,
  getProgress,
  getBetterThanPercent,
} from "./spreadsheet.js"
import { getCompliment } from "./utils.js"

const CHAPTERS_PIC_URL =
  "https://i.ibb.co/DKY6FVW/cfar-handbook-chapters.png"

export async function onStart(ctx: Context) {
  const username = ctx.message?.from.username
  if (!username || !ctx?.chat?.id) throw new Error("No username or chat found")

  const dialogState: DialogState = botState?.[ctx.chat.id] || {
    isOtherChapterSelectionActive: false,
    currentVersion: process.env.npm_package_version || "unknown" ,
  }
  Object.assign<BotState, BotState>(
    botState, 
    { [ctx.chat.id]: dialogState }
  )

  const isLoggedIn = await checkUser(username)
  if (isLoggedIn) {
    const keyboard = Markup.keyboard([
      // Markup.button.callback(Answers.TABLE, 'table'),
      // Markup.button.text("Команда"), // TODO: add team command
      Markup.button.callback(Answers.ADD_CHAPTER, "add_chapter"),
      Markup.button.callback(Answers.STATS, "statistics"),
      Markup.button.callback(Answers.HANDBOOK, 'handbook'),
      Markup.button.callback(Answers.FEEDBACK, 'feedback'),
      Markup.button.callback(Answers.UPDATE, 'update'),
    ], { wrap: (_, index) => index === 1 || index % 2 !== 0 }).resize()
    
    await ctx.reply(MESSAGES.ALREADY_LOGGED_IN)
    return await ctx.reply(
      `${MESSAGES.HELLO}, @${username}`,
      keyboard
    )
  } else {
    return await askToJoin(ctx)
  }
}

async function askToJoin(ctx: Context) {
  const buttons = [
    [
      Markup.button.callback(Answers.LOG_ME_IN, Answers.LOG_ME_IN),
      Markup.button.callback(Answers.NEVERMORE, Answers.NEVERMORE),
    ],
  ]
  return await ctx.reply(MESSAGES.JOIN_MARATHON, Markup.inlineKeyboard(buttons))
}

export async function logUserIn(ctx: Context) {
  const username = ctx.callbackQuery?.from?.username || ctx.from?.username
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

  const replyText = `${MESSAGES.CHAPTER_QUESTION} «${nextChapterName}»?\n(страница: ${nextChapterPage})`
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
  await ctx.reply(MESSAGES.OTHER_CHAPTER_HINT)

  const chatId = ctx.chat?.id
  if (chatId) {
    botState[chatId] = { ...botState[chatId], isOtherChapterSelectionActive: true }
  }

  return
}

// TODO: specify input type
export async function onOtherChapterRead(ctx: any) {
  const messageText = ctx?.message?.text
  const username = ctx.callbackQuery?.from?.username || ctx.from?.username

  if (!username || !messageText || !ctx.chat?.id) {
    throw new Error("No username or chapter number or chat id found")
  }

  if (!botState[ctx.chat.id]?.isOtherChapterSelectionActive) {
    return ctx.reply(MESSAGES.OTHER_CHAPTER_NOT_SELECTED)
  }

  const chapterNumber = Number(messageText)
  botState[ctx.chat.id].isOtherChapterSelectionActive = false

  await setChapterAsRead(username, chapterNumber)
  await ctx.reply(MESSAGES.NEXT_CHAPTER)

  return await askNextChapter(ctx)
}

export const showUserStats = async (ctx: Context) => {
  const username = ctx.callbackQuery?.from?.username || ctx.from?.username
  if (!username) throw new Error("No username found")

  const progress = await getProgress(username)
  const betterThanPercent = await getBetterThanPercent(progress)
  const compliment = getCompliment()

  // TODO: implement team progress and forecast
  // const teamProgress = await getTeamProgress(username)
  // const teamPlace = await getTeamPlace(username)
  // const teamName = await getTeamName(username)
  // const daysLeft = await getDaysLeft(username)
  
  const replyText = 
`— Вы прочитали *${progress}%* методички
— Вы лучше *${betterThanPercent}%* участников
— А ещё вы ||${compliment}||`
// `— You have read *${progress}%* of the Handbook
// — You better than *${betterThanPercent}%* of participants
// — And you are so ||${compliment}||\\!`
  // — Your team progress is **${teamProgress}** / ${teamPlace} place (${teamName})
  // — You can finish marathon in ${daysLeft} days


  return await ctx.replyWithMarkdownV2(replyText)
}