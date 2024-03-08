const { Markup } = require('telegraf');
const languageResponse = require("../middelware/middelware");
const Response = require("../../Models/response.model");
const Reserved = require("../../Models/reserved.model");
const dayjs = require("dayjs");
const { WEB_APP, WEB_APP_RESERVED, WEB_APP_REVIEW } = process.env;
class keyboard {

    async main_menu(chat_id,language) {

        const currentDateTime = new Date();
        const year = currentDateTime.getFullYear();
        const month = String(currentDateTime.getMonth() + 1).padStart(2, '0'); // Місяць починається з 0
        const day = String(currentDateTime.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        const reserved = await Reserved.find({chat_id,$or:[{accepted:true,declined:false},{accepted:false,declined:true},{accepted: false, declined: false}], date: { $gte: formattedDate } });

        const keyboard =  Markup.inlineKeyboard(
            [
                [
                    Markup.button.webApp(`${await languageResponse.checkResponse(language,'book_a_table_button')}`, `${WEB_APP_RESERVED}`),
                    Markup.button.callback(`${await languageResponse.checkResponse(language,'stickers_button')}`, 'stickers_button'),
                ],
                [
                    Markup.button.webApp(`${await languageResponse.checkResponse(language,'review_button')}`, `${WEB_APP_REVIEW}`),
                    Markup.button.callback(`${await languageResponse.checkResponse(language,'help_button')}`, 'help_button'),
                ],
                [ ...(reserved?.length
                    ? [Markup.button.callback(`${await languageResponse.checkResponse(language,'reserves_info_button')}`, 'reserves_info')]
                    : [])
                ],
                [
                    Markup.button.callback(`${await languageResponse.checkResponse(language,'change_language_button')}`, 'change_language_button'),
                ]
            ]
        ).resize()

        return keyboard
    }

    async reserved_menu(chat_id,language) {
        // ${await languageResponse.checkResponse(language, 'reserves_info_button')}
        const currentDateTime = new Date();
        const year = currentDateTime.getFullYear();
        const month = String(currentDateTime.getMonth() + 1).padStart(2, '0'); // Місяць починається з 0
        const day = String(currentDateTime.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        const reserved = await Reserved.find({chat_id,$or:[{accepted:true,declined:false},{accepted:false,declined:true},{accepted: false, declined: false}], date: { $gte: formattedDate } }).sort({accepted:-1,declined:1,date:-1});

        const keyboard = Markup.inlineKeyboard(
            [
                ...(await Promise.all(reserved.map(async (item) => {
                    return [Markup.button.callback(
                        `${item.accepted ? '✅ ' : item.declined ? '❌ ' : '⏳ '}${dayjs(`${item.date} ${item.time}`).format('HH:mm DD.MM.YYYY')}`,
                        `reserves_info-${item._id}`
                    )]
                }))),
                [
                    Markup.button.callback(await languageResponse.checkResponse(language, 'back_main_menu'), 'back_main_menu')
                ]
            ]
        ).resize();


        return keyboard
    }

    async language_button(language) {

        const { response } = await Response.findOne({ id_response:'language_button' }, { response: 1, _id: 0 });

        const keyboard =  Markup.inlineKeyboard(
            [
                [
                    Markup.button.callback(`${response['en']}`, 'en'),
                    Markup.button.callback(`${response['uk']}`, 'uk'),
                    Markup.button.callback(`${response['ru']}`, 'ru'),
                    Markup.button.callback(`${response['es']}`, 'es')
                ],
                [
                    Markup.button.callback(await languageResponse.checkResponse(language, 'back_main_menu'), 'back_main_menu')
                ]
            ]
        )

        return keyboard
    }

    async language_button_not_reg() {

        const { response } = await Response.findOne({ id_response:'language_button' }, { response: 1, _id: 0 });

        const keyboard =  Markup.inlineKeyboard(
            [
                [
                    Markup.button.callback(`${response['en']}`, 'en'),
                    Markup.button.callback(`${response['uk']}`, 'uk'),
                    Markup.button.callback(`${response['ru']}`, 'ru'),
                    Markup.button.callback(`${response['es']}`, 'es')
                ]
            ]
        )

        return keyboard
    }

    async back_button(language){
        const { response } = await Response.findOne({ id_response:'back_main_menu' }, { response: 1, _id: 0 });
        const keyboard =  Markup.inlineKeyboard(
            [
                [
                    Markup.button.callback(`${response[language]}`, 'back_main_menu')
                ]
            ]
        )
        return keyboard
    }

    async back_button_to_reserved(language, id){
        const { response } = await Response.findOne({ id_response:'back_main_menu' }, { response: 1, _id: 0 });

        const reserved = await Reserved.findOne({_id:id});


        const decline = await Response.findOne({id_response: 'delcineBook_button'}, {response: 1, _id: 0});

        const keyboard =  Markup.inlineKeyboard(
            [
                [
                    Markup.button.webApp(await languageResponse.checkResponse(language, 'changeBook_button'),`${WEB_APP_RESERVED}/${id}`)
                ],
                [ ...(!reserved.declined && reserved.accepted || !reserved.declined && !reserved.accepted
                    ? [Markup.button.callback(`${decline?.response[language]}`, `declineBook_info-${id}`)]
                    : [])
                ],
                [
                    Markup.button.callback(`${response[language]}`, 'reserves_info')
                ]
            ]
        )
        return keyboard
    }

    async back_main_button(language){
        const { response } = await Response.findOne({ id_response:'back_main_answer_menu' }, { response: 1, _id: 0 });
        const keyboard =  Markup.inlineKeyboard(
            [
                [
                    Markup.button.callback(`${response[language]}`, 'back_main_answer_menu')
                ]
            ]
        )
        return keyboard
    }

}

module.exports = new keyboard;
