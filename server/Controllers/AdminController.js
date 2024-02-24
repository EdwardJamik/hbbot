
const bot = require('../bot/bot')
const jwt = require("jsonwebtoken");
const {Markup} = require("telegraf");
const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const cron = require("node-cron");
const fs = require("fs");

require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const auth = require("../Service/Middlewares/auth");
const TelegramUsers = require("../Models/user.model");
const Category = require("../Models/category.model");
const Reserved = require("../Models/reserved.model");
const Manager = require("../Models/user.model");
const Response = require("../Models/response.model");
const Reviews = require("../Models/reviews.model");

dayjs.extend(utc);
dayjs.extend(timezone);


module.exports.rootMenu = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) return res.json(false);

        jwt.verify(token, process.env.JWT_SECRET);
        const adminlog = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await Manager.findOne({_id: adminlog?.id}, {entree: 1, _id: 0, root: 1});

        res.send({admin})
    } catch (err) {
        res.json(false);
    }
};

module.exports.banTgUser = async (req, res, next) => {
    try {
        const {id,ban} = req.body

        const banTgUser = await TelegramUsers.updateOne({_id:id},{ban});

        if(ban){
            return res.json({ success: true, message: `Пользователь заблокирован` });
        } else{
            return res.json({ success: true, message: `Пользователь разблокирован` });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

module.exports.telegramUserData = async (req, res, next) => {
    try {
        const users = await TelegramUsers.find({}).sort({createdAt:-1});

        res.json(users);
    } catch (error) {
        console.error(error);
    }
};

module.exports.fillingData = async (req, res, next) => {
    try {
        const changeBanUser = await Response.find({web:false});

        res.json(changeBanUser);
    } catch (error) {
        console.error(error);
    }
};

module.exports.updatedFilling = async (req, res, next) => {
    try {

        const array = req.body;
        for (let i = 0; i < array.length; i++) {
            await Response.updateOne({_id: array[i]._id,web:false}, {response: array[i].response});
        }
        res.json(true);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports.getStats = async (req, res, next) => {
    try {
        const twentyFourHoursAgo = dayjs().subtract(24, 'hours').toDate();

        const action = await TelegramUsers.countDocuments({ updatedAt: { $gte: twentyFourHoursAgo } })
        const newUsers = await TelegramUsers.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } })

        res.json({action, newUsers});
    } catch (error) {
        console.error(error);
    }
};

module.exports.getCategory = async (req, res, next) => {
    try {
        const productCategory = await Category.find({})

        res.json(productCategory);
    } catch (error) {
        console.error(error);
    }
};

module.exports.getCatName = async (req, res, next) => {
    try {
        const {id} = req.body

        const getName = await Category.findOne({_id:id})

        res.json(getName);
    } catch (error) {
        console.error(error);
    }
};


module.exports.getUserLanguage = async (req, res, next) => {
    try {
        const {chat_id} = req.body;
        const {language} = await TelegramUsers.findOne({chat_id},{_id:0, language:1})

        res.json(language);
    } catch (error) {
        console.error(error);
    }
};

module.exports.sendReviewUser = async (req, res, next) => {
    try {
        const {review_text, chat_id, review_star} = req.body;

        const user = await TelegramUsers.findOne({chat_id}, {first_name:1,username: 1,phone:1, language:1})

        const { response } = await Response.findOne({ id_response:'review_notification_message' }, { response: 1, _id: 0 });


        if(review_star < 4){
            const sendReview = await Reviews.create({review_text, chat_id, review_star})
            await bot.telegram.sendMessage( '-4000583493', `<b>Отзыв</b>\n ${user?.first_name !== 'Not specified' && user?.first_name ? `\nFisrt name: ${user?.first_name}` : ''}${user?.username !== 'Not specified' && user?.username ? `\nUsername: @${user?.username}` : ''}${user?.phone !== 'Not specified' && user?.phone ? `\nPhone: ${user?.phone}` : ''}\n\n${review_star >= 1 ? '⭐ ' : ''}${review_star >= 2 ? '⭐ ' : ''}${review_star >= 3 ? '⭐ ' : ''}${review_star >= 4 ? '⭐ ' : ''}${review_star >= 5 ? '⭐ ' : ''}\n${review_text}`, {parse_mode:"HTML"})
        }
        await bot.telegram.sendMessage( chat_id, response[user?.language], {parse_mode:"HTML"})


        res.json(true);
    } catch (error) {
        console.error(error);
    }
};

module.exports.sendBookTable = async (req, res, next) => {
    try {
        const {count_people, chat_id, language, date, time, first_name, phone, id} = req.body;

        const {WEB_APP_RESERVED} = process.env;

        const findReserved = await Reserved.findOne({chat_id, declined: false, accepted: false});

        if (!findReserved) {
            if (!count_people || count_people === '') {
                const {response} = await Response.findOne({id_response: 'book_people_error_text'}, {
                    response: 1,
                    _id: 0
                });
                const translate = response[language] ? response[language] : false;
                return res.json({access: false, eMessage: translate});
            }

            if (!date || date === '') {
                const {response} = await Response.findOne({id_response: 'book_date_error_text'}, {response: 1, _id: 0});
                const translate = response[language] ? response[language] : false;
                return res.json({access: false, eMessage: translate});
            }

            if (!time || time === '') {
                const {response} = await Response.findOne({id_response: 'book_time_error_text'}, {response: 1, _id: 0});
                const translate = response[language] ? response[language] : false;
                return res.json({access: false, eMessage: translate});
            }

            if (!first_name || first_name === '') {
                const {response} = await Response.findOne({id_response: 'book_name_error_text'}, {response: 1, _id: 0});
                const translate = response[language] ? response[language] : false;
                return res.json({access: false, eMessage: translate});
            }

            if (!phone || phone === '') {
                const {response} = await Response.findOne({id_response: 'book_phone_error_text'}, {
                    response: 1,
                    _id: 0
                });
                const translate = response[language] ? response[language] : false;
                return res.json({access: false, eMessage: translate});
            }

            if (!id) {
                const createdReserver = await Reserved.create({count_people, chat_id, date, time, first_name, phone})

                const {response} = await Response.findOne({id_response: 'book_notification_message'}, {
                    response: 1,
                    _id: 0
                });

                const decline = await Response.findOne({id_response: 'delcineBook_button'}, {response: 1, _id: 0});
                const updated = await Response.findOne({id_response: 'changeBook_button'}, {response: 1, _id: 0});

                const inlineKeyboard = {
                    inline_keyboard: [
                        [
                            {
                                text: updated?.response[language],
                                web_app: {url: `${WEB_APP_RESERVED}/${createdReserver?._id}`}
                            },
                        ],
                        [
                            {text: decline?.response[language], callback_data: `declineBook-${createdReserver?._id}`},
                        ],
                    ]
                };

                const {message_id} = await bot.telegram.sendMessage(chat_id, response[language], {
                    reply_markup: inlineKeyboard,
                    parse_mode: "HTML"
                })

                await bot.telegram.sendMessage('-1002109041322', "Поступил запрос на резервирование столика.\nОжидает подтверждения в админ панели")
                await Reserved.updateOne({_id: createdReserver?._id}, {message_id})

                res.json({access: true});
            }
        } else{
            if (id) {
                await Reserved.updateOne({_id: id}, {count_people, chat_id, date, time, first_name, phone})
                res.json({access: true});
            } else{
                const {response} = await Response.findOne({id_response: 'book_error_reserved_text'}, {
                    response: 1,
                    _id: 0
                });
                const translate = response[language] ? response[language] : false;
                return res.json({access: false, eMessage: translate});
            }
        }



    } catch (error) {
        console.error(error);
    }
};

module.exports.getBookTable = async (req, res, next) => {
    try {
        const {id} = req.body;

        const reserved = await Reserved.findOne({_id:id})

        res.json(reserved);
    } catch (error) {
        console.error(error);
    }
};

module.exports.webAppTranslate = async (req, res, next) => {
    try {
        const {language,id_response} = req.body;

        const { response } = await Response.findOne({ id_response }, { response: 1, _id: 0 });
        const translate = response[language] ? response[language] : false;

        res.json(translate);
    } catch (error) {
        console.error(error);
    }
};

module.exports.getProductCategory = async (req, res, next) => {
    try {
        const productCategory = await Category.find({});

        res.json(productCategory);
    } catch (error) {
        console.error(error);
    }
};

module.exports.createCatName = async (req, res, next) => {
    try {
        const {id,isData} = req.body

        if (!isData.title.ru || !isData.title.en || !isData.title.es || !isData.title.uk)
            return res.json({access: false, access_message: `Заполните все поля`});

        if(id){
            const getName = await Category.updateOne({_id:id},isData)
            res.json({access: true, access_message: `Изменения сохранены `});
        } else{
            const getName = await Category.insertMany(isData)
            res.json({access: true, access_message: `Создана новая категория`});
        }


    } catch (error) {
        console.error(error);
    }
};