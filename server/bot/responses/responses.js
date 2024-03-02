const { message } = require('telegraf/filters');
const Response = require('../../Models/response.model');
const User = require('../../Models/user.model');
const ChatModel = require('../../Models/chatgpt.model');
const { Markup } = require('telegraf');
const { WEB_APP } = process.env;
const languageResponse = require('../middelware/middelware')
const keyboard = require('../keyboards')
const fs = require("fs");
const Reserved = require("../../Models/reserved.model");

const ChatGpt = require('../chatGPT')
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
			ctx.deleteMessage()
			ctx.replyWithChatAction('typing')
			const message = await languageResponse.checkResponse('en', 'language_message')
			const keyboards = await keyboard.language_button_not_reg()
			const {message_id} = await ctx.replyWithHTML(message, keyboards)
			await User.create({chat_id, username, first_name, action: '', last_message_id: message_id})
		} else if (user && !user?.language) {
			ctx.deleteMessage()
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
				ctx.deleteMessage()
				ctx.replyWithChatAction('typing')
				const animationBuffer = fs.readFileSync('./bot/loader/loader.mp4');
				const main_keyboard = await keyboard.main_menu(language)
				await ctx.replyWithAnimation({source: animationBuffer}).then((message) => {
					return setTimeout(async () => {
						try {
							ctx.deleteMessage(message?.message_id)
							if (user?.last_message_id) {
								ctx.deleteMessage(user?.last_message_id)
							}
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

			const chat_id = ctx?.chat?.id;
			const user = await User.findOne({chat_id}, {_id: 0, action: 1, ban: 1, language: 1, last_message_id: 1});

			if (!user?.ban) {
				const message = ctx?.message?.text;

				const callback = ctx?.update?.callback_query?.data
				const callback_splits = callback?.split('-')
				const callback_action = callback_splits ? callback_splits[0] : false
				const callback_id = callback_splits ? callback_splits[1] : false

				if (message) {

					const reponse = await languageResponse.checkIdResponse(user?.language, message)

					if (user?.action !== 'ask' && user?.action !== 'start_ask') {
						ctx.deleteMessage();
					} else if (reponse === 'stop_gpt_button' && user?.action === 'start_ask') {
						try {
							ctx.replyWithChatAction('typing')
							ctx.deleteMessage()

							if (user?.last_message_id)
								ctx.deleteMessage(user?.last_message_id)

							const main_keyboard = await keyboard.main_menu(user?.language)
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
								await ChatGpt(ctx, findChat?._id, message, user?.language)
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
				} else if (callback === 'change_language_button') {
					try {
						const message = await languageResponse.checkResponse('en', 'language_message')
						const keyboards = await keyboard.language_button(user?.language)
						ctx.editMessageText(message, {...keyboards, parse_mode: 'HTML'})
						await User.updateOne({chat_id}, {action: ''})
					} catch (e) {
						console.log(e)
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
				} else if (callback === 'back_main_menu') {
					const keyboards = await keyboard.main_menu(user?.language)
					ctx.editMessageText(await languageResponse.checkResponse(user?.language, 'select_menu_message'), {
						...keyboards,
						parse_mode: 'HTML'
					})
				}

				if (callback || callback_action || callback_id) {
					if (callback === 'en' || callback === 'ru' || callback === 'uk' || callback === 'es') {
						try {
							await User.updateOne({chat_id}, {language: callback})

							ctx.deleteMessage()

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

							const main_keyboard = await keyboard.main_menu(callback)
							await ctx.replyWithAnimation({source: animationBuffer}).then((message) => {
								return setTimeout(async () => {
									ctx.deleteMessage(message.message_id)

									const {message_id} = await ctx.replyWithHTML(await languageResponse.checkResponse(callback, 'select_menu_message'), main_keyboard)
									await User.updateOne({chat_id}, {action: '', last_message_id: message_id})

								}, 3000);
							});
						} catch (e) {
							console.log(e)
						}
					} else if (callback_action === 'declineBook' && callback_id) {
						try {
							await Reserved.deleteOne({_id: callback_id})
							ctx.deleteMessage()
						} catch (e) {
							console.log(e)
						}
					}
				}
			}
		} catch (e) {
			console.log(e)
		}
	});
};