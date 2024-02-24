const { Markup } = require('telegraf');
const languageResponse = require("../middelware/middelware");
const Response = require("../../Models/response.model");

class keyboard {

    async main_menu(language) {

        const keyboard =  Markup.keyboard(
            [
                [await languageResponse.checkResponse(language,'book_a_table_button'), await languageResponse.checkResponse(language,'menu_button'), await languageResponse.checkResponse(language,'stickers_button')],
                [await languageResponse.checkResponse(language,'review_button'),await languageResponse.checkResponse(language,'help_button')]
            ]
        ).resize()

        return keyboard
    }

    async language_button() {

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

}

module.exports = new keyboard;
