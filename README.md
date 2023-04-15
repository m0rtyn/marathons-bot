# Marathons bot

## Development

!!! NOTE: scripts in package.json is wrong, you need to remove fucking `pm2` and add ~~fucking~~ `Docker`

1. > `./ngrok http https://localhost`
2. Copy Forwarding address
   - ![](2023-04-15-15-31-19.png)
3. Paste to env variable NGROK_URL
4. Check that setted correct bot token (development, not production)
5. ! Run TS compiler for `.ts` files in Watch Mode (via VSCode)
6. Run `yarn start`

## Tech stack

- Telegram bot API by Telegraf (Node.js);
- Google APIs (Sheets)

## TODOs

- [x] Стартовое меню с кнопками главных действий
- [x] Замена прослушивания по тексту, на прослушивание по командам. Сейчас из-за этого брешь в сценариях.
- [x] Указание названия главы вместо номера колонки с главой
- [x] Отображения статистики участника из таблицы
- [ ] Публикация изображения таблицы в чате марафона
