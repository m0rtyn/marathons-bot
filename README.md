# Marathons bot

## Development

NOTE: !!! scripts in package.json is wrong, you need to remove fucking pm2 and add docker

1. > `./ngrok http https://localhost`
2. Copy Forwarding address
3. Paste to env variable NGROK_URL
4. Check that setted correct bot token
5. run TS compiler for ts files (via VSCode)
6. run `yarn dev`

## Tech stack

- Telegram bot API by Telegraf (Node.js);
- Google APIs (Sheets)

## TODOs

- [ ] Стартовое меню с кнопками главных действий
- [ ] Замена прослушивания по тексту, на прослушивание по командам. Сейчас из-за этого брешь в сценариях.
- [x] Указание названия главы вместо номера колонки с главой
- [ ] Отображения статистики участника из таблицы
- [ ] Публикация изображения таблицы в чате марафона
