const { Telegraf, Scenes } = require('telegraf')
require('dotenv').config()

const { BOT_TOKEN } = process.env
const response = require('./responses/responses')

const bot = new Telegraf(`${BOT_TOKEN}`)
try{
    response(bot)
} catch (e){
    console.error(e)
}

module.exports = bot
