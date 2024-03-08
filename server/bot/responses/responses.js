const { message } = require('telegraf/filters');
const Response = require('../../Models/response.model');
const User = require('../../Models/user.model');
const ChatModel = require('../../Models/chatgpt.model');
const { Markup } = require('telegraf');
const { WEB_APP,GPT_ASSISSTAN,GPT_API } = process.env;
const languageResponse = require('../middelware/middelware')
const keyboard = require('../keyboards')
const fs = require("fs");
const Reserved = require("../../Models/reserved.model");

const ChatGpt = require('../chatGPT')
const TelegramUsers = require("../../Models/user.model");
const OpenAI = require("openai");
const dayjs = require("dayjs");
const {bot} = require("../bot");
module.exports = async bot => {

	bot.command('start', async (ctx) => {
		const chat_id = ctx?.chat?.id
		const username = ctx?.chat?.username ? ctx.chat.username : 'Not specified'
		const first_name = ctx?.chat?.first_name ? ctx.chat.first_name : 'Not specified'
		const user = await User.findOne({chat_id})
		const language = user?.language

		if (user?.ban)
			return false

		await User.updateOne({action: '', updatedAt: new Date()})

		if (user?.first_name !== first_name || user?.username !== username)
			await User.updateOne({chat_id}, {username, first_name})

		if (!user) {
			ctx.deleteMessage().catch((e)=> console.log(e));
			ctx.replyWithChatAction('typing')
			const message = await languageResponse.checkResponse('en', 'language_message')
			const keyboards = await keyboard.language_button_not_reg()
			const {message_id} = await ctx.replyWithHTML(message, keyboards)
			await User.create({chat_id, username, first_name, action: '', last_message_id: message_id})
		} else if (user && !user?.language) {
			ctx.deleteMessage().catch((e)=> console.log(e));
			const message = await languageResponse.checkResponse('en', 'language_message')
			const keyboards = await keyboard.language_button_not_reg()
			if (user?.last_message_id) {
				try {
					ctx.editMessageText(message, {
						chat_id: chat_id,
						message_id: user?.last_message_id,
						parse_mode: 'HTML',
						...keyboards,
					});
				} catch (e) {
					const {message_id} = await ctx.replyWithHTML(message, keyboards)
					await User.updateOne({chat_id}, {action: '', last_message_id: message_id})
				}

			} else {
				const {message_id} = await ctx.replyWithHTML(message, keyboards)
				await User.updateOne({chat_id}, {action: '', last_message_id: message_id})
			}

		} else if (user && user?.language) {
			try {
				ctx.deleteMessage().catch((e)=> console.log(e));
				ctx.replyWithChatAction('typing')
				if (user?.last_message_id) {
					ctx.deleteMessage(user?.last_message_id).catch((e)=> console.log(e));
				}
				const animationBuffer = fs.readFileSync('./bot/loader/loader.mp4');
				const main_keyboard = await keyboard.main_menu(chat_id,language)
				await ctx.replyWithAnimation({source: animationBuffer}).then((message) => {
					return setTimeout(async () => {
						try {
							ctx.deleteMessage(message?.message_id).catch((e)=> console.log(e));
							const {message_id} = await ctx.replyWithHTML(await languageResponse.checkResponse(language, 'select_menu_message'), main_keyboard)
							await User.updateOne({chat_id}, {action: '', last_message_id: message_id})
						} catch (e) {
							console.log(e)
						}
					}, 3150);
				});
			} catch (e) {
				console.log(e)
			}
		}
	});

	bot.on('my_chat_member', async (ctx) => {
		try {
			const status = ctx?.update?.my_chat_member?.new_chat_member?.status
			const groupType = ctx?.update?.my_chat_member?.chat?.type
			const chat_id = ctx?.update?.my_chat_member?.chat?.id

			if (groupType === 'private' && status === 'kicked' && chat_id) {
				await User.updateOne({chat_id}, {user_bot_ban: true})
			} else if (groupType === 'private' && status === 'member' && chat_id) {
				await User.updateOne({chat_id}, {user_bot_ban: false})
			}
		} catch (e) {
			console.log(e)
		}
	});

	bot.on(message, async ctx => {
		try {

			const type = ctx?.message?.chat?.type

			if(type !== 'group') {
				const chat_id = ctx?.chat?.id;
				const user = await User.findOne({chat_id}, {
					_id: 0,
					action: 1,
					ban: 1,
					language: 1,
					last_message_id: 1
				});

				if (!user?.ban) {
					const message = ctx?.message?.text;

					const callback = ctx?.update?.callback_query?.data
					const callback_splits = callback?.split('-')
					const callback_action = callback_splits ? callback_splits[0] : false
					const callback_id = callback_splits ? callback_splits[1] : false

					if (message) {

						const reponse = await languageResponse.checkIdResponse(user?.language, message)

						if (user?.action !== 'ask' && user?.action !== 'start_ask') {
							ctx.deleteMessage().catch((e) => console.log(e));
						} else if (reponse === 'stop_gpt_button' && user?.action === 'start_ask') {
							try {
								ctx.replyWithChatAction('typing')
								ctx.deleteMessage().catch((e) => console.log(e));

								if (user?.last_message_id)
									ctx.deleteMessage(user?.last_message_id).catch((e) => console.log(e));

								const main_keyboard = await keyboard.main_menu(chat_id,user?.language)
								const findChat = await ChatModel.findOne({chat_id, open: true})
								if (findChat) {
									await ChatModel.updateOne({_id: findChat?._id}, {open: false})
								}
								const {message_id} = await ctx.replyWithHTML(await languageResponse.checkResponse(user?.language, 'select_menu_message'), main_keyboard)
								await User.updateOne({chat_id}, {action: '', last_message_id: message_id})
							} catch (e) {
								console.log(e)
							}
						} else if (!callback && user?.action === 'ask' || !callback && user?.action === 'start_ask') {
							try {
								ctx.replyWithChatAction('typing')
								await User.updateOne({chat_id}, {action: 'start_ask'})
								const findChat = await ChatModel.findOne({chat_id, open: true})
								if (findChat) {
									await ChatGpt(bot, ctx, findChat?._id, message, user?.language)
								}
							} catch (e) {
								console.log(e)
							}
						}
					}

					await User.updateOne({updatedAt: new Date()})

					if (callback === 'help_button') {
						try {
							const keyboards = await keyboard.back_button(user?.language)
							ctx.editMessageText(await languageResponse.checkResponse(user?.language, 'ask_message'), {
								...keyboards,
								parse_mode: 'HTML'
							})

							const findChat = await ChatModel.findOne({chat_id, open: true})
							if (!findChat) {
								await ChatModel.create({chat_id, open: true})
							}

							await User.updateOne({chat_id}, {action: 'ask'})
						} catch (e) {
							console.log(e)
						}
					} else if (callback === 'stop_gpt' && user?.action === 'start_ask') {
						try {
							ctx.replyWithChatAction('typing')
							// ctx.deleteMessage().catch((e) => console.log(e));

							ctx.editMessageReplyMarkup({})
							if (user?.last_message_id)
								ctx.deleteMessage(user?.last_message_id).catch((e) => console.log(e));

							const main_keyboard = await keyboard.main_menu(chat_id,user?.language)
							const findChat = await ChatModel.findOne({chat_id, open: true})
							if (findChat) {
								await ChatModel.updateOne({_id: findChat?._id}, {open: false})
							}
							const {message_id} = await ctx.replyWithHTML(await languageResponse.checkResponse(user?.language, 'select_menu_message'), main_keyboard)
							await User.updateOne({chat_id}, {action: '', last_message_id: message_id})
						} catch (e) {
							console.log(e)
						}
					} else if (callback === 'change_language_button') {
						try {
							const message = await languageResponse.checkResponse('en', 'language_message')
							const keyboards = await keyboard.language_button(user?.language)
							ctx.editMessageText(message, {...keyboards, parse_mode: 'HTML'})
							await User.updateOne({chat_id}, {action: ''})
						} catch (e) {
							console.log(e)
						}
					} else if (callback === 'reserves_info') {
						const message = await languageResponse.checkResponse(user?.language, 'reserves_info_text')
						const keyboards = await keyboard.reserved_menu(chat_id,user?.language)
						ctx.editMessageText(message, {...keyboards, parse_mode: 'HTML'})
						await User.updateOne({chat_id}, {action: ''})
					} else if (callback_action === 'reserves_info' && callback_id){

						const reserved = await Reserved.findOne({_id:callback_id});

						if(reserved?.accepted){
							const {response} = await Response.findOne({id_response: 'confirm_reserved'}, {
								response: 1,
								_id: 0
							});

							let message = response[user?.language]
							message = message?.replace('{{date}}', dayjs(reserved.date).format('DD.MM.YYYY'));
							message = message?.replace('{{time}}', reserved.time);
							message = message?.replace('{{count_people}}', reserved.count_people);

							const keyboards = await keyboard.back_button_to_reserved(user?.language,callback_id)

							ctx.editMessageText(message, {
								...keyboards,
								parse_mode: 'HTML'
							})
						} else if(reserved?.declined){
							const {response} = await Response.findOne({id_response: 'declined_reserved'}, {
								response: 1,
								_id: 0
							});

							let message = response[user?.language]
							message = message?.replace('{{date}}', dayjs(reserved.date).format('DD.MM.YYYY'));
							message = message?.replace('{{time}}', reserved.time);
							message = message?.replace('{{count_people}}', reserved.count_people);

							const keyboards = await keyboard.back_button_to_reserved(user?.language,callback_id)

							ctx.editMessageText(message, {
								...keyboards,
								parse_mode: 'HTML'
							})
						} else {
							const {response} = await Response.findOne({id_response: 'reserved_waited_text'}, {
								response: 1,
								_id: 0
							});

							let message = response[user?.language]
							message = message?.replace('{{date}}', dayjs(reserved.date).format('DD.MM.YYYY'));
							message = message?.replace('{{time}}', reserved.time);
							message = message?.replace('{{count_people}}', reserved.count_people);

							const keyboards = await keyboard.back_button_to_reserved(user?.language,callback_id)

							ctx.editMessageText(message, {
								...keyboards,
								parse_mode: 'HTML'
							})
						}




					} else if (callback === 'stickers_button') {
						try {
							const keyboards = await keyboard.back_button(user?.language)
							ctx.editMessageText(await languageResponse.checkResponse(user?.language, 'sticker_message'), {
								...keyboards,
								parse_mode: 'HTML'
							})
						} catch (e) {
							console.log(e)
						}
					} else if (callback === 'back_main_menu' || callback === 'back_main_answer_menu') {
						const keyboards = await keyboard.main_menu(chat_id,user?.language)
						ctx.editMessageText(await languageResponse.checkResponse(user?.language, 'select_menu_message'), {
							...keyboards,
							parse_mode: 'HTML'
						})
					}

					if (callback || callback_action || callback_id) {
						if (callback === 'en' || callback === 'ru' || callback === 'uk' || callback === 'es') {
							try {
								await User.updateOne({chat_id}, {language: callback})

								ctx.deleteMessage().catch((e) => console.log(e));

								const main_button = await Response.findOne({id_response: 'menu_button'})
								await ctx.setChatMenuButton({
									chatId: chat_id,
									type: "web_app",
									text: `${main_button?.response[callback]}`,
									web_app: {
										url: WEB_APP,
									},
								});

								ctx.replyWithChatAction('typing')

								const animationBuffer = fs.readFileSync('./bot/loader/loader.mp4');

								const main_keyboard = await keyboard.main_menu(chat_id,callback)
								await ctx.replyWithAnimation({source: animationBuffer}).then((message) => {
									return setTimeout(async () => {
										ctx.deleteMessage(message.message_id).catch((e) => console.log(e));

										const {message_id} = await ctx.replyWithHTML(await languageResponse.checkResponse(callback, 'select_menu_message'), main_keyboard)
										await User.updateOne({chat_id}, {action: '', last_message_id: message_id})

									}, 3000);
								});
							} catch (e) {
								console.log(e)
							}
						} else if (callback_action === 'declineBook' && callback_id) {
							try {
								await Reserved.updateOne({_id: callback_id},{declined:true})
								const reserved_info = await Reserved.findOne({_id: callback_id})
								const {response} = await Response.findOne({id_response: 'declined_reserved'}, {
									response: 1,
									_id: 0
								});

								let message = response[user?.language]
								message = message?.replace('{{date}}', dayjs(reserved_info.date).format('DD.MM.YYYY'));
								message = message?.replace('{{time}}', reserved_info.time);
								message = message?.replace('{{count_people}}', reserved_info.count_people);

								const keyboards = await keyboard.back_main_button(user?.language)

								ctx.editMessageText(message, {
									...keyboards,
									parse_mode: 'HTML'
								})
								await bot.telegram.sendMessage('-1002109041322', `Отмена брони \nДата: ${reserved_info?.date}\nВремя: ${reserved_info?.time}\nКоличество: ${reserved_info?.count_people}\nНомер телефона: ${reserved_info?.phone}`)

							} catch (e) {
								console.log(e)
							}
						} else if(callback_action === 'declineBook_info' && callback_id){
							await Reserved.updateOne({_id: callback_id},{declined: true, accepted:false})
							const reserved_info = await Reserved.findOne({_id: callback_id})
							const {response} = await Response.findOne({id_response: 'declined_reserved'}, {
								response: 1,
								_id: 0
							});

							let message = response[user?.language]
							message = message?.replace('{{date}}', dayjs(reserved_info.date).format('DD.MM.YYYY'));
							message = message?.replace('{{time}}', reserved_info.time);
							message = message?.replace('{{count_people}}', reserved_info.count_people);

							const keyboards = await keyboard.back_button_to_reserved(user?.language,callback_id)

							ctx.editMessageText(message, {
								...keyboards,
								parse_mode: 'HTML'
							})

							await bot.telegram.sendMessage('-1002109041322', `Отмена брони \nДата: ${reserved_info?.date}\nВремя: ${reserved_info?.time}\nКоличество: ${reserved_info?.count_people}\nНомер телефона: ${reserved_info?.phone}`)

						}
					}
				}
			} else {
				const reply_to = ctx?.message?.reply_to_message;
				const reply_to_text = reply_to.text
				const message = ctx?.message?.text;

				// chat_id
				const chatIdRegex = /chat_id:(\d+)/;
				const match = chatIdRegex.exec(reply_to_text);

				//questions
				const questionRegex = /Вопрос: "(.*?)"/;
				const matchQuestions = questionRegex.exec(reply_to_text);

				if(match[1] && matchQuestions[1]){

					const user = await TelegramUsers.findOne({chat_id:match[1]}, { language: 1})

					const {response} = await Response.findOne({id_response: 'answer_question_message_text'}, {response: 1, _id: 0});

					let message_answer = response[user.language]

					message_answer = message_answer.replace(/{question}/g,matchQuestions[1])
					message_answer = message_answer.replace(/{answer}/g,message)

					ctx.replyWithHTML({chat_id:match[1],text:message_answer})
					const data = fs.readFileSync('./input.txt', 'utf8');

					const instructionsIndex = data.indexOf('Instructions:') + 'Instructions:'.length;

					const modifiedString = data.slice(0, instructionsIndex) + `\n${matchQuestions[1]}:\n${message}.` + data.slice(instructionsIndex);

					fs.writeFileSync('./input.txt', modifiedString, 'utf8');

					const openai = new OpenAI({
						apiKey: GPT_API,
					});

					const newResponse = await openai.beta.assistants.update(`${GPT_ASSISSTAN}`,{instructions:modifiedString ? modifiedString : 'false'})

				}

			}
		} catch (e) {

			console.log(e)
		}
	});
};