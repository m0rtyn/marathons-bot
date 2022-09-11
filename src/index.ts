import { Telegraf } from "telegraf"
import { BOT_TOKEN, WEBHOOK_URL } from "./constants.js"
import {
  askChapter,
  logUserIn,
  onChapterYes,
  onStart,
  selectOtherChapter,
  test,
} from "./bot.js"

const bot = new Telegraf(BOT_TOKEN)

try {
  bot.use(Telegraf.log())
  bot.telegram.setWebhook(WEBHOOK_URL)
} catch (error) {
  console.log(error)
  bot.stop()
}


bot.start(onStart)
// bot.action('chapter_yes', onChapterYes); // TODO: figure out how to use actions
// bot.action('chapter_no', askChapter);
bot.hears("Yes", onChapterYes)
bot.hears("No", askChapter)
bot.hears("Other", selectOtherChapter)
bot.hears("Log me in", logUserIn)
bot.hears("Nevermore", test)

bot.help((ctx) => ctx.reply("I can't help you"))
bot.launch()

process.once("SIGINT", () => bot.stop())
process.once("SIGTERM", () => bot.stop())
