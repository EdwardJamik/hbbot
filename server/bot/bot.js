const { Telegraf, Scenes } = require('telegraf')
require('dotenv').config()

const { BOT_TOKEN } = process.env
const response = require('./responses/responses')

const bot = new Telegraf(`${BOT_TOKEN}`)

response(bot)

module.exports = bot
