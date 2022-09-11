import { Telegraf } from "telegraf"
import { Answers, BOT_TOKEN, WEBHOOK_URL } from "./constants.js"
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

bot.start(onStart)

bot.hears(Answers.LOG_ME_IN, logUserIn)
bot.hears(Answers.NEVERMORE, test)

bot.hears(Answers.YES, onChapterYes)
bot.hears(Answers.NO, askNextChapter)
bot.hears(Answers.OTHER, selectOtherChapter)

bot.help((ctx) => ctx.reply("I can't help you"))
bot.launch()

process.once("SIGINT", () => bot.stop())
process.once("SIGTERM", () => bot.stop())
