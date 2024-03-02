const { Markup } = require('telegraf');
const languageResponse = require("../middelware/middelware");
const Response = require("../../Models/response.model");
const { WEB_APP, WEB_APP_RESERVED, WEB_APP_REVIEW } = process.env;
class keyboard {

    async main_menu(language) {

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
                [
                    Markup.button.callback(`${await languageResponse.checkResponse(language,'change_language_button')}`, 'change_language_button'),
                ]
            ]
        ).resize()

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

}

module.exports = new keyboard;
