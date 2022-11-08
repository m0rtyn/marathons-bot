import { Markup, Telegraf } from "telegraf"
import { Answers, BOT_TOKEN, MESSAGES, WEBHOOK_URL } from "./constants/index.js"
import {
  askNextChapter,
  logUserIn,
  onChapterRead,
  onOtherChapterRead,
  onStart,
  selectOtherChapter,
  test,
} from "./bot.js"

if (!BOT_TOKEN || !WEBHOOK_URL) throw new Error("No token or webhook url")

const bot = new Telegraf(BOT_TOKEN)

export const dialogState: {
  [key: number]: { isOtherChapterSelectionActive: boolean }
} = {}

try {
  bot.use(Telegraf.log())
  bot.telegram.setWebhook(WEBHOOK_URL)
} catch (error) {
  console.error(error)
  bot.stop()
}

bot.catch((err, ctx) => {
  // TODO: add logging to m0rtyn
  // const m0rtynChatId = ???
  // ctx.forwardMessage(ctx, m0rtynChartId, err)

  ctx.reply(MESSAGES.ERROR)
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})

bot.start(onStart)
bot.help((ctx) => ctx.reply(MESSAGES.HELP))

bot.hears(Answers.ADD_CHAPTER, askNextChapter)
bot.hears(Answers.HANDBOOK, ctx => ctx.reply(
  "Link to the handbook",
  Markup.inlineKeyboard([
    [
      Markup.button.url(
        "📖",
        "https://www.rationality.org/files/CFAR_Handbook_2021-01.pdf"
      ),
    ],
  ])
))
bot.hears(Answers.TABLE, ctx => ctx.reply(
  "Link to the table",
  Markup.inlineKeyboard([
    [
      Markup.button.url(
        "📊",
        "bit.ly/HoT-board"
      ),
    ],
  ])
))


bot.hears(Answers.LOG_ME_IN, logUserIn)
bot.hears(Answers.NEVERMORE, test)

bot.on("callback_query", (ctx) => {
  switch (ctx.callbackQuery?.data) {
    case Answers.YES:
      return onChapterRead(ctx)
    case Answers.OTHER:
      return selectOtherChapter(ctx)
    case Answers.NO:
      return ctx.reply("👌")
    default:
      return
  }
})

bot.hears(/^[0-9]{1,2}$/, onOtherChapterRead)

bot.hears(/.*/, (ctx) => ctx.reply(MESSAGES.UNKNOWN_TEXT))

bot.launch()

process.once("SIGINT", () => bot.stop())
process.once("SIGTERM", () => bot.stop())
