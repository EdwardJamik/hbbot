
const {bot} = require('../bot/bot')
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
const ChatGPT = require("../Models/chatgpt.model");
const Sending = require("../Models/sending.model");
const Product = require("../Models/product.model");
const axios = require("axios");
const languageResponse = require("../bot/middelware/middelware");
const path = require("path");
const OpenAI = require("openai");
const {sendUserMessages} = require("../bot/bot");

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

module.exports.getReviews = async (req, res, next) => {
    try {
        const result = await Reviews.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'chat_id',
                    foreignField: 'chat_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 1,
                    review_text: 1,
                    review_star:1,
                    updatedAt:1,
                    createdAt:1,
                    'user.username': 1,
                    'user.first_name': 1,
                    'user.chat_id': 1
                }
            }
        ])


        res.json(result);
    } catch (error) {
        console.error(error);
    }
};

module.exports.getChats = async (req, res, next) => {
    try {
        const result = await ChatGPT.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'chat_id',
                    foreignField: 'chat_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 1,
                    'user.username': 1,
                    'user.first_name': 1,
                    'user.chat_id': 1,
                    open:1,
                    updatedAt:1,
                    createdAt:1
                }
            },
            {
                $match: {
                    open: false
                }
            }
        ]).sort({updatedAt:-1})


        res.json(result);
    } catch (error) {
        console.error(error);
    }
};

module.exports.getUserChat = async (req, res, next) => {
    try {

        const {id} = req.body

        if(id){
            const findChat = await ChatGPT.findOne({_id:id})
            if(findChat){
                const directoryPath = './gpt';
                const fileName = `${id}.json`;
                const filePath = path.join(directoryPath, fileName);

                fs.readFile(filePath, 'utf8', async (readErr, data) => {
                    if (readErr) {
                        res.json({eMessage:'Ошибка при чтение файла или файла не существует.'});
                    } else {
                        const chat = JSON.parse(data)
                        res.json({chat});
                    }
                });
            }
        }


    } catch (error) {
        console.error(error);
    }
}

module.exports.getReserves = async (req, res, next) => {
    try {
        const result = await Reserved.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'chat_id',
                    foreignField: 'chat_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    _id: 1,
                    count_people: 1,
                    date:1,
                    time:1,
                    first_name:1,
                    phone:1,
                    declined:1,
                    accepted:1,
                    'user.username': 1,
                    'user.first_name': 1,
                    'user.chat_id': 1,
                    updatedAt:1,
                    createdAt:1
                }
            }
        ]).sort({accepted:1, decline:1, updatedAt:1})


        res.json(result);
    } catch (error) {
        console.error(error);
    }
};

module.exports.fillingData = async (req, res, next) => {
    try {
        const {value} = req.body

        const changeBanUser = await Response.find({web:value});

        res.json(changeBanUser);
    } catch (error) {
        console.error(error);
    }
};

module.exports.getInstruction = async (req, res, next) => {
    try {

        const data = fs.readFileSync('./input.txt', 'utf8');

        res.json(data);
    } catch (error) {
        console.error(error);
    }
};

module.exports.savedInstruction = async (req, res, next) => {
    try {
        const {data} = req.body;

        const {GPT_API,GPT_ASSISSTAN} = process.env

        fs.writeFileSync('./input.txt', data, 'utf8');

        const openai = new OpenAI({
            apiKey: GPT_API,
        });

        const response = await openai.beta.assistants.update(`${GPT_ASSISSTAN}`,{instructions:data ? data : 'false'})

        res.json({success:true,eMessage:'Инструкцию ассистента сохранено'});
    } catch (error) {
        console.error(error);
    }
};

module.exports.updatedFilling = async (req, res, next) => {
    try {
        const {data,value} = req.body;

        for (let i = 0; i < data.length; i++) {
            await Response.updateOne({_id: data[i]._id,web:value}, {response: data[i].response});
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

        if(review_star > 0){
            const user = await TelegramUsers.findOne({chat_id}, {first_name: 1, username: 1, phone: 1, language: 1})

            const {response} = await Response.findOne({id_response: 'review_notification_message'}, {response: 1, _id: 0});


            const sendReview = await Reviews.create({review_text, chat_id, review_star})
            await bot.telegram.sendMessage('-4000583493', `<b>Отзыв</b>\n ${user?.first_name !== 'Not specified' && user?.first_name ? `\nFisrt name: ${user?.first_name}` : ''}${user?.username !== 'Not specified' && user?.username ? `\nUsername: @${user?.username}` : ''}${user?.phone !== 'Not specified' && user?.phone ? `\nPhone: ${user?.phone}` : ''}\n\n${review_star >= 1 ? '⭐ ' : ''}${review_star >= 2 ? '⭐ ' : ''}${review_star >= 3 ? '⭐ ' : ''}${review_star >= 4 ? '⭐ ' : ''}${review_star >= 5 ? '⭐ ' : ''}\n${review_text}`, {parse_mode: "HTML"})

            await bot.telegram.sendMessage(chat_id, response[user?.language], {parse_mode: "HTML"})

            res.json({access:true});
        } else{
            const user = await TelegramUsers.findOne({chat_id}, {first_name: 1, username: 1, phone: 1, language: 1})
            const {response} = await Response.findOne({id_response: 'reviews_error_text'}, {response: 1, _id: 0});

            res.json({access:false, eMessage:response[user?.language]});
        }

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

module.exports.getReservInfo = async (req, res, next) => {
    try {
        const {id} = req.body
        const reservInfo = await Reserved.findOne({_id: id},{createdAt:0, updatedAt:0, _id:0})

        res.json(reservInfo);
    } catch (error) {
        console.error(error);
    }
};

module.exports.acceptedReserved = async (req, res, next) => {
    try {
        const {id, isData, accepted} = req.body

        if (id) {
            if (accepted) {
                const getName = await Reserved.updateOne({_id: id}, isData)
                const getUser = await TelegramUsers.findOne({chat_id: isData?.chat_id})
                const {response} = await Response.findOne({id_response: 'confirm_reserved'}, {
                    response: 1,
                    _id: 0
                });
                let message = response[getUser?.language]
                message = message?.replace('{{date}}', isData.date);
                message = message?.replace('{{time}}', isData.time);
                message = message?.replace('{{count_people}}', isData.count_people);
                bot.telegram.sendMessage(isData?.chat_id, message, {parse_mode: "HTML"})
                res.json({access: true, access_message: `Бронирование подтверждено`});
            } else {
                const getName = await Reserved.updateOne({_id: id}, isData)
                const getUser = await TelegramUsers.findOne({chat_id: isData?.chat_id})
                const {response} = await Response.findOne({id_response: 'declined_reserved'}, {
                    response: 1,
                    _id: 0
                });

                let message = response[getUser?.language]
                message = message?.replace('{{date}}', isData.date);
                message = message?.replace('{{time}}', isData.time);
                message = message?.replace('{{count_people}}', isData.count_people);

                bot.telegram.sendMessage(isData?.chat_id, message, {parse_mode: "HTML"})
                res.json({access: true, access_message: `Бронирование отменено`});
            }
        }

    } catch (error) {
        console.error(error);
    }
};

module.exports.createCatName = async (req, res, next) => {
    try {
        const {id,isData} = req.body

        if (!isData.title.ru || !isData.title.en || !isData.title.es || !isData.title.uk)
            return res.json({access: false, access_message: `Заполните все поля`});

        if(!isData.photo)
            return res.json({access: false, access_message: `Загрузите фото категории`});

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

module.exports.sendingList = async (req, res, next) => {
    try {
        try {
            const sending= await Sending.find({sending_end:true}).sort({createdAt:-1});

            const localizedSeminar = sending.map((user) => {
                const localizedDateCreatedAt = dayjs(user.createdAt).tz('Europe/Kiev').format('DD.MM.YYYY HH:mm');
                const localizedDateUpdateAt = dayjs(user.updatedAt).tz('Europe/Kiev').format('DD.MM.YYYY HH:mm');
                const localizedDate = dayjs(user.date).tz('Europe/Kiev').format('DD.MM.YYYY HH:mm');
                return {
                    ...user._doc,
                    createdAt: localizedDateCreatedAt,
                    updatedAt: localizedDateUpdateAt,
                    date: localizedDate,
                };
            });

            res.json(localizedSeminar);
        } catch (err) {
            console.error(err);
            res.status(500).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports.sendingsListLoad = async (req, res, next) => {
    try {
        const sending = await Sending.find({
            sending_end: false
        });

        const localizedSeminar = sending.map((user) => {
            const localizedDateCreatedAt = dayjs(user.createdAt).tz('Europe/Kiev').format('DD.MM.YYYY HH:mm');
            const localizedDateUpdateAt = dayjs(user.updatedAt).tz('Europe/Kiev').format('DD.MM.YYYY HH:mm');
            const localizedDate = dayjs(user.date).tz('Europe/Kiev').format('DD.MM.YYYY HH:mm');
            return {
                ...user._doc,
                createdAt: localizedDateCreatedAt,
                updatedAt: localizedDateUpdateAt,
                date: localizedDate,
            };
        });

        res.json(localizedSeminar);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports.createSending = async (req, res, next) => {
    try {
        const {text, type, date, video, photo, button} = req.body
        const {DOMAIN} = process.env;
        let countTelegram

        countTelegram = await TelegramUsers.countDocuments({});

        if (date !== 'Invalid Date' && date !== null && date !== undefined && date !== '') {
            const insertedData = await Sending.insertMany({
                date: date,
                content: text,
                type: type,
                button: button,
                image: photo,
                watch: video,
                un_sending_telegram: countTelegram
            })
        } else {
            const insertedData = await Sending.create({
                content: text,
                type: type,
                button: button,
                image: photo,
                watch: video,
                un_sending_telegram: countTelegram
            })
            const users = await TelegramUsers.find({ban:false,user_bot_ban:false});
            sendUserMessages(text,users,photo,video,(insertedData?._id).toString())
        }
        res.json(true);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

module.exports.sendingsDelete = async (req, res, next) => {
    try {
        const {id} = req.body
        const sending_file = await Sending.findOne({_id: id});

        if (sending_file?.watch) {
            fs.unlink(`./uploads/video/${sending_file.watch}`, (err) => {
                if (err) {
                    console.error('Ошибка при удаление фото:', err);
                }
            });
        }

        if (sending_file?.image) {
            fs.unlink(`./uploads/image/${sending_file.image}`, (err) => {
                if (err) {
                    console.error('Ошибка при удаление фото:', err);
                }
            });
        }
        const sending = await Sending.deleteOne({_id: id});
        res.json(true);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports.createProduct = async (req, res, next) => {
    try {
        const {id, isData} = req.body

        if(isData.title.en  === '' || isData.title.ru  === '' || isData.title.es  === '' || isData.title.uk  === '' || isData.description.en  === '' || isData.description.ru === '' || isData.description.uk  === '' || isData.description.es  === '' || isData.photo  === '')
            return res.json({access: false, access_message: `Заполните все поля`});

        if(id === 0 || id){
            await Product.updateOne({_id:id},isData)
            return res.json({access: true, access_message: `Успешно обновлено`});
        } else{
            await Product.insertMany(isData)
            return res.json({access: true, access_message: `Успешно обновлено`});
        }

    } catch (error) {
        console.error(error);
    }
};

module.exports.getProductField = async (req, res, next) => {
    try {
        const {id} = req.body

        const getProduct = await Product.findOne({_id:id})

        res.json(getProduct);
    } catch (error) {
        console.error(error);
    }
};

module.exports.deletedProduct = async (req, res, next) => {
    try {
        const {id} = req.body

        await Product.deleteOne({_id:id})

        res.json({access: true, access_message: `Успешно удално`});
    } catch (error) {
        console.error(error);
    }
};

module.exports.deletedCategory = async (req, res, next) => {
    try {
        const {id} = req.body

        await Category.deleteOne({_id:id})

        res.json({access: true, access_message: `Успешно удално`});
    } catch (error) {
        console.error(error);
    }
};

module.exports.getProduct = async (req, res, next) => {
    try {
        const {id} = req.body

        const getProduct = await Product.find({category:id})

        res.json(getProduct);
    } catch (error) {
        console.error(error);
    }
};

cron.schedule('* * * * *', async () => {
    try {
        const currentDate = new Date();

        const twoMinutesAgo = new Date(currentDate);
        twoMinutesAgo.setMinutes(currentDate.getMinutes() - 2);

        let insertedData = await Sending.findOne({
            date: {
                $gte: twoMinutesAgo,
                $lte: currentDate,
            },
            sending_start: false,
            sending_end: false
        })

        const users = await TelegramUsers.find({});

        sendUserMessages(insertedData?.content,users,insertedData?.image,insertedData?.watch,insertedData?._id)

    } catch (e) {
        console.error(e)
    }
})