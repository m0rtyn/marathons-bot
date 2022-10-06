## Development

1. > `./ngrok http https://localhost`
2. Copy Forwarding address
3. Paste to env variable NGROK_URL
4. run TS compiler for ts files (via VSCode)
5. run `yarn dev` 

## Tech stack

- Telegram bot API by Telegraf (Node.js);
- Google APIs (Sheets)

## TODOs

- [ ] Стартовое меню с кнопками главных действий
- [ ] Замена прослушивания по тексту, на прослушивание по командам. Сейчас из-за этого брешь в сценариях.
- [x] Указание названия главы вместо номера колонки с главой (WIP @m0rtyn)
- [ ] Отображения статистики участника из таблицы
- [ ] Публикация изображения таблицы в чате марафона
