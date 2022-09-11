import { Context, Markup } from "telegraf"
import axios from "axios"
import { Answers, SS_URL, TELEGRAM_BOT_URL, WEB_APP_URL } from "./constants.js"
import {
  addParticipantToSheet,
  checkUser,
  getNextChapterNumber,
  setChapterAsRead,
} from "./spreadsheet.js"

export async function onStart(ctx: Context) {
  const username = ctx.message?.from.username

  if (!username) throw new Error("No username found")

  const isLoggedIn = await checkUser(username)

  if (isLoggedIn) {
    await ctx.reply("You are logged in")

    return await askChapter(ctx)
  } else {
    return await ctx.reply(
      "Would you like to join a marathon? (WIP)",
      Markup.keyboard([
        Markup.button.text(Answers.LOG_ME_IN),
        Markup.button.text(Answers.NEVERMORE),
      ])
        .oneTime()
        .resize()
    )
  }
}

export async function logUserIn(ctx: Context) {
  const username = ctx.message?.from.username
  if (!username) throw new Error("No username found")

  const isLoggedIn = await checkUser(username)

  if (isLoggedIn) {
    return await ctx.reply("You are already logged in")
  } else {
    await addParticipantToSheet(username)
    await ctx.reply(
      `Now, you are logged in the marathon. \nYou can check it at ${SS_URL}`
    )

    return await askChapter(ctx)
  }
}

export async function onChapterYes(ctx: Context) {
  const username = ctx.from?.username

  if (!username) throw new Error("Username is not defined")

  const nextChapterNumber = await getNextChapterNumber(username)
  console.log("🚀 ~ onChapterYes ~ nextChapterAlpha", nextChapterNumber)

  if (!nextChapterNumber) {
    return await ctx.reply("You have finished the marathon!")
  }
  
  await setChapterAsRead(username, nextChapterNumber)
  await ctx.reply("Ok, next chapter")
  return await askChapter(ctx)
}

export async function askChapter(ctx: Context) {
  const username = ctx.message?.from.username
  if (!username) throw new Error("No username found")

  const nextChapter = await getNextChapterNumber(username)

  if (!nextChapter) {
    return await ctx.reply(`There are no any chapters left.
    You can check it at ${SS_URL}
    debug: ${nextChapter}`)
  }
  const buttons = [
    Markup.button.text(Answers.YES),
    Markup.button.text(Answers.NO),
    Markup.button.text(Answers.OTHER),
  ]

  return await ctx.reply(
    `Do you read chapter ${nextChapter}?`,
    Markup.keyboard(buttons).oneTime().resize()
  )
}

export async function setWebhook() {
  const url = TELEGRAM_BOT_URL + "/setWebhook?url=" + WEB_APP_URL
  await axios(url)
}

export async function test(ctx: Context) {
  // console.log(ctx.message)
  console.log("🚀 ~ test ~ TEST", ctx)
  // ctx.callbackQuery.data = 'chapter_yes'
}

export async function selectOtherChapter(ctx: Context) {
  console.log("selectOtherChapter WIP", ctx)
}
