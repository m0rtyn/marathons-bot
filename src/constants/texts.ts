import { SS_URL } from "./spreadsheet.js"

export enum Answers {
  YES = "✅ Да", // "✅ Yes",
  NO = "❌ Нет", // "❌ No",
  OTHER = "🟡 Другая глава", // "🟡 Other chapter",
  LOG_ME_IN = "📝 Впиши меня", // "📝 Log me in",
  NEVERMORE = "🙅 Низашто", // "🙅 Nevermore",
  ADD_CHAPTER = "☝ Добавь главу", // "☝ Add chapter",
  HANDBOOK = "📓 Дай методичку", // "📓 Get handbook",
  STATS = "📈 Статистика", // "📈 Statistics",
  FEEDBACK = "📩 Фидбэк", // "📩 Feedback",
  TABLE = "📊 Дай таблицу", // "📊 To the table",
  UPDATE = "🔄 Обновление", // "🔄 Update",
}

export const MESSAGES = {
  HELLO: "Привет", // "Hello, @"
  JOIN_MARATHON: "Вы хотите присоединиться к марафону?", //"Would you like to join a marathon?",
  LOGGED_IN_MESSAGE: `Вы вступили в марафон.`, // `Now, you are logged in the marathon. \nYou can check it at ${SS_URL}`,
  ALREADY_LOGGED_IN: `Вы уже вступили в марафон.`, // `You are already logged in the marathon. \nYou can check it at ${SS_URL}`,
  NEXT_CHAPTER: "Хорошо, следующая глава...", // "Ok, next chapter",
  OTHER_CHAPTER_NOT_SELECTED: "Сначала следует нажать на кнопку ответа «Другая глава»", // "You should select adding of the new read chapter first"
  CHAPTER_QUESTION: "Вы уже прочитали главу", // "Did you read chapter", // Full: Did you read chapter 3 (page: 5)?
  NO_CHAPTER_FOUND: `Кажется, больше не осталось глав. Это можно проверить в таблице:\n${SS_URL}`, // `There are no any chapters left. \nYou can check it at ${SS_URL}`,
  MARATHON_FINISHED: "🏁 Вы завершили марафон!", // "You have finished the marathon!",
  SELECT_OTHER_CHAPTER: "Пожалуйста, отправьте мне номер главы, которую хотите отметить прочитанной.", // "Please, send me the number of the chapter you want to read",
  HELP: "Ох, лучше попросить помощи у @m0rtyn.", // "Chill, you can ask @m0rtyn about problems with me.",
  UNKNOWN_TEXT: "Извините, я не понимаю вас 😰 Попробуйте использовать кнопки ответа вместо текста.\nА ещё вы можете спросить о помощи у @m0rtyn.", // "Sorry, I don't understand you. Try to use answer buttons instead of typing text. Also you can ask @m0rtyn for help about me.",
  ERROR: "Извините, случилась неизвестная мне ошибка. Попробуйте команду /start для моего перезапуска или спросите о помощи у @m0rtyn", // "Sorry, something went wrong. Try to reboot with /start command or ask @m0rtyn for help.",
  OTHER_CHAPTER_SELECTION: "Пожалуйста, отправьте мне номер прочитанной главы из таблицы глав...", // "Please, send me the number of the chapter you read from picture below",
  OTHER_CHAPTER_HINT: "Номер главы это просто число от 1 до 37.", // "Your answer should be just number. E.g.: "3", "13" or "37"
  FEEDBACK: "Пожалуйста, поделитесь вашим анонимным отзывом о марафоне. Там только один обязательный вопрос. Это поможет мне развиваться.", // "Please, share your anonymous feedback about the marathon. It will help us to improve it.",
  SHEETS_QUOTA_EXCEEDED: "Ого, вы достигли ограничения по запросам к таблице марафона. Повторите действие через пару минут.", // "Sorry, we have reached the limit of requests to Google Sheets. Please, try again later.",
  TABLE: "Ссылка на таблицу", // "Link to the table"
  HANDBOOK: "Ссылка на методичку", // "Link to the handbook"
  BOT_VERSION: "Версия бота:\n", // "Bot version is"
  UPDATE_AVAILABLE: "Нажмите на 👉 /start", // "Please, press 👉 /start"
  OKAY: "👌"
}
