import { Telegraf } from "telegraf"
import { Answers, BOT_TOKEN, MESSAGES, WEBHOOK_URL } from "./constants.js"
import {
  askNextChapter,
  logUserIn,
  onChapterYes,
  onStart,
  selectOtherChapter,
  test,
} from "./bot.js"

if (!BOT_TOKEN || !WEBHOOK_URL) throw new Error("No token or webhook url")

const bot = new Telegraf(BOT_TOKEN)

try {
  // bot.use(Telegraf.log())
  bot.telegram.setWebhook(WEBHOOK_URL)
} catch (error) {
  console.error(error)
  bot.stop()
}

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})

bot.start(onStart)
bot.help((ctx) => ctx.reply(MESSAGES.HELP))

bot.hears(Answers.LOG_ME_IN, logUserIn)
bot.hears(Answers.NEVERMORE, test)

bot.hears(Answers.YES, onChapterYes)
bot.hears(Answers.NO, askNextChapter)
bot.hears(Answers.OTHER, selectOtherChapter)

bot.hears(/.*/, (ctx) => ctx.reply(MESSAGES.UNKNOWN_TEXT))

bot.launch()

process.once("SIGINT", () => bot.stop())
process.once("SIGTERM", () => bot.stop())
