import { Context, Markup } from "telegraf"
import axios from "axios"
import { Answers, SS_URL, TELEGRAM_BOT_URL, WEB_APP_URL } from "./constants.js"
import {
  addParticipantToSheet,
  checkUser,
  getNextChapter,
  setChapterAsRead,
} from "./spreadsheet.js"

export async function onStart(ctx: Context) {
  const username = ctx.message.from.username
  const isLoggedIn = await checkUser(username)

  if (isLoggedIn) {
    ctx.reply("You are logged in")

    askChapter(ctx)
  } else {
    ctx.reply(
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
  const username = ctx.message.from.username
  const isLoggedIn = await checkUser(username)

  if (isLoggedIn) {
    ctx.reply("You are already logged in")
  } else {
    await addParticipantToSheet(username)
    ctx.reply(
      `Now, you are logged in the marathon. \nYou can check it at ${SS_URL}`
    )
  }
}

export async function onChapterYes(ctx: Context) {
  console.log("onChapterYes")
  const username = ctx.from.username
  const nextChapter = await getNextChapter(username)

  await setChapterAsRead(username, nextChapter)
  ctx.reply("Ok, next chapter")
  askChapter(ctx)
}

export async function askChapter(ctx: Context) {
  const username = ctx.message.from.username
  const nextChapter = await getNextChapter(username)

  ctx.reply(
    `Do you read chapter ${nextChapter}?`,
    Markup.keyboard([
      Markup.button.text(Answers.YES),
      Markup.button.text(Answers.NO),
      Markup.button.text(Answers.OTHER),
    ])
      .oneTime()
      .resize()
  )
}

export async function setWebhook() {
  const url = TELEGRAM_BOT_URL + "/setWebhook?url=" + WEB_APP_URL
  await axios(url)
}

export async function test(ctx: Context) {
  // console.log(ctx.message)
  console.log("🚀 ~ test ~ TEST")
  // ctx.callbackQuery.data = 'chapter_yes'
}

export async function selectOtherChapter(ctx: Context) {
  console.log("selectOtherChapter WIP")
}
