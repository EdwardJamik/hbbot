const { Telegraf, Scenes } = require('telegraf')
require('dotenv').config()

const { BOT_TOKEN,DOMAIN } = process.env
const response = require('./responses/responses')
const Sending = require("../Models/sending.model");

const bot = new Telegraf(`${BOT_TOKEN}`)
try{
    response(bot)
} catch (e){
    console.error(e)
}

async function sendUserMessages (text,users,photo,video,id){
    let counter = 0
    let countTelegram = users?.length ? users?.length : 0

    await Sending.updateOne({_id:id}, {
        sending_start: true,
        sending_telegram: counter,
        un_sending_telegram: countTelegram
    })

    if (photo === null && video === null && users) {
        for (const user of users) {
            const {chat_id,language} = user;
            try {
                if(text.en && language === 'en') {
                    const sending = await bot.telegram.sendMessage(chat_id, text.en, {
                        parse_mode: 'HTML'
                    });

                    if (sending?.chat?.id) {
                        counter++
                    }
                } else if(text.ru && language === 'ru'){
                    const sending = await bot.telegram.sendMessage(chat_id, text.ru, {
                        parse_mode: 'HTML'
                    });

                    if (sending?.chat?.id) {
                        counter++
                    }
                } else if(text.uk && language === 'uk'){
                    const sending = await bot.telegram.sendMessage(chat_id, text.uk, {
                        parse_mode: 'HTML'
                    });

                    if (sending?.chat?.id) {
                        counter++
                    }
                }
                else if(text.es && language === 'es'){
                    const sending = await bot.telegram.sendMessage(chat_id, text.es, {
                        parse_mode: 'HTML'
                    });

                    if (sending?.chat?.id) {
                        counter++
                    }
                }
            } catch (e) {
                console.error(e)
            }
        }
    } else if (photo !== null && video === null && users) {
        for (const user of users) {
            const {chat_id,language} = user;

            if (text !== '' && text !== null) {
                try {
                    if (text.en && language === 'en') {
                        const sending = await bot.telegram.sendPhoto(chat_id, `${DOMAIN}/sending/${photo}`, {
                            caption: text.en,
                            parse_mode: 'HTML'
                        });

                        if (sending?.chat?.id) {
                            counter++
                        }
                    } else if (text.ru && language === 'ru') {
                        const sending = await bot.telegram.sendPhoto(chat_id, `${DOMAIN}/sending/${photo}`, {
                            caption: text.ru,
                            parse_mode: 'HTML'
                        });

                        if (sending?.chat?.id) {
                            counter++
                        }
                    } else if (text.uk && language === 'uk') {
                        const sending = await bot.telegram.sendPhoto(chat_id, `${DOMAIN}/sending/${photo}`, {
                            caption: text.uk,
                            parse_mode: 'HTML'
                        });

                        if (sending?.chat?.id) {
                            counter++
                        }
                    } else if (text.es && language === 'es') {
                        const sending = await bot.telegram.sendPhoto(chat_id, `${DOMAIN}/sending/${photo}`, {
                            caption: text.es,
                            parse_mode: 'HTML'
                        });

                        if (sending?.chat?.id) {
                            counter++
                        }
                    }
                } catch (e) {
                    console.error(e)
                }
            } else {
                try {
                    const sending = await bot.telegram.sendPhoto(chat_id, `${DOMAIN}/sending/${photo}`, {
                        parse_mode: 'HTML'
                    });
                    if (sending?.chat?.id) {
                        counter++
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        }
    } else if (photo === null && video !== null && users) {
        for (const user of users) {
            const {chat_id, language} = user;

            if (text !== '' && text !== null) {
                try {
                    if (text.en && language === 'en') {
                        const sending = await bot.telegram.sendVideo(chat_id, `${DOMAIN}/sending/${video}`, {
                            caption: text.en,
                            parse_mode: 'HTML'
                        });
                        if (sending?.chat?.id) {
                            counter++
                        }
                    } else if (text.ru && language === 'ru') {
                        const sending = await bot.telegram.sendVideo(chat_id, `${DOMAIN}/sending/${video}`, {
                            caption: text.ru,
                            parse_mode: 'HTML'
                        });
                        if (sending?.chat?.id) {
                            counter++
                        }
                    } else if (text.uk && language === 'uk') {
                        const sending = await bot.telegram.sendVideo(chat_id, `${DOMAIN}/sending/${video}`, {
                            caption: text.uk,
                            parse_mode: 'HTML'
                        });
                        if (sending?.chat?.id) {
                            counter++
                        }
                    } else if (text.es && language === 'es') {
                        const sending = await bot.telegram.sendVideo(chat_id, `${DOMAIN}/sending/${video}`, {
                            caption: text.es,
                            parse_mode: 'HTML'
                        });
                        if (sending?.chat?.id) {
                            counter++
                        }
                    }

                } catch (e) {
                    console.error(e)
                }
            } else {
                try {
                    const sending = await bot.telegram.sendVideo(chat_id, `${DOMAIN}/sending/${video}`, {
                        parse_mode: 'HTML'
                    });
                    if (sending?.chat?.id) {
                        counter++
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        }
    }
    await Sending.updateOne({_id:id
    },{
        sending_end: true,
        sending_telegram: counter,
        un_sending_telegram: countTelegram
    })
}

module.exports = {bot, sendUserMessages}
