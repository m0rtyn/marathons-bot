import "dotenv/config.js"

export const ADMIN_ID = "m0rtyn"
export const HELP_TEXT =
"Hello user! This marathon allows you to track your progress in Martyn's marathons. Please send commands (starting with '/') to navigate the bot. Always wait for a response of the bot before entering another text. Enjoy easy transfer!"

export const BOT_TOKEN = process.env.BOT_TOKEN
export const TELEGRAM_BOT_URL = "https://api.telegram.org/bot" + BOT_TOKEN
