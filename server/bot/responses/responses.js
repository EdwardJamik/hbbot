const { message } = require('telegraf/filters');
const Response = require('../../Models/response.model');
const User = require('../../Models/user.model');
const ChatModel = require('../../Models/chatgpt.model');
const { Markup } = require('telegraf');
const { WEB_APP, WEB_APP_RESERVED, WEB_APP_REVIEW } = process.env;
const languageResponse = require('../middelware/middelware')
const keyboard = require('../keyboards')
const fs = require("fs");
const Reserved = require("../../Models/reserved.model");

const ChatGpt = require('../chatGPT')
module.exports = async bot => {

	const deleteLastMessage = async (ctx) => {
		try {
			const chat_id = ctx?.chat?.id
			const last_message_id = await User.distinct('last_message_id',{chat_id})

			ctx.deleteMessage()
			if (Number(last_message_id[0]) !== (ctx.message.message_id - 1) && ctx.message)
				ctx.deleteMessage(ctx.message.message_id - 1)

			return true
		} catch (e) {
			console.error(e)
			return false
		}
	}

	bot.command('start', async (ctx) => {
		try {
			const chat_id = ctx?.chat?.id
			const username = ctx?.chat?.username ? ctx.chat.username : 'Not specified'
			const first_name = ctx?.chat?.first_name ? ctx.chat.first_name : 'Not specified'
			const user = await User.findOne({chat_id})
			const language = user?.language

			if (user?.ban)
				return false

			ctx.deleteMessage()

			await User.updateOne({action: '', updatedAt: new Date()})

			if (user?.first_name !== first_name || user?.username !== username)
				await User.updateOne({chat_id}, {username, first_name})

			if (!user) {
				ctx.replyWithChatAction('typing')

				await User.create({chat_id, username, first_name})
				const message = await languageResponse.checkResponse('en', 'language_message')
				const keyboards = await keyboard.language_button()
				await ctx.replyWithHTML(message, keyboards)
				await User.updateOne({chat_id}, {action: ''})
			} else if (user && !user?.language) {
				ctx.replyWithChatAction('typing')
				const message = await languageResponse.checkResponse('en', 'language_message')
				const keyboards = await keyboard.language_button()
				await ctx.replyWithHTML(message, keyboards)
				await User.updateOne({chat_id}, {action: ''})
			} else if (user && user?.language) {
				try{
					ctx.replyWithChatAction('typing')
					const animationBuffer = fs.readFileSync('./bot/loader/loader.mp4');
					const main_keyboard = await keyboard.main_menu(language)
					await ctx.replyWithAnimation({source: animationBuffer}).then((message) => {
						return setTimeout(async () => {
							ctx.deleteMessage(message?.message_id)
							if(user?.last_message_id)
								ctx.deleteMessage(user?.last_message_id)
							const {message_id} = await ctx.replyWithHTML(await languageResponse.checkResponse(language, 'select_menu_message'), main_keyboard)
							await User.updateOne({chat_id}, {action: '', last_message_id:message_id})
						}, 3150);
					});
				}catch (e){
					console.error(e)
				}

			}
		} catch (e) {
			console.error(e)
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
			console.error(e)
		}
	});

	bot.on(message, async ctx => {
		try {
			const chat_id = ctx?.chat?.id;
			const user = await User.findOne({chat_id}, {_id: 0, action: 1, ban: 1, language: 1, last_message_id:1});

			if (!user?.ban) {
				const message = ctx?.message?.text;

				const callback = ctx?.update?.callback_query?.data
				const callback_splits = callback?.split('-')
				const callback_action = callback_splits ? callback_splits[0] : false
				const callback_id = callback_splits ? callback_splits[1] : false

				if (message && !callback) {

					const reponse = await languageResponse.checkIdResponse(user?.language, message)

					if(user?.action !== 'start_ask' && reponse)
						await deleteLastMessage(ctx)

					if (user?.action && !reponse)
						await User.updateOne({updatedAt: new Date()})
					else if (user?.action && reponse)
						await User.updateOne({action: '', updatedAt: new Date()})

					if (reponse && reponse === 'help_button') {
						ctx.replyWithChatAction('typing')

						await ctx.replyWithHTML(await languageResponse.checkResponse(user?.language, 'ask_message'))

						const findChat = await ChatModel.findOne({chat_id, open: true})
						if (!findChat) {
							await ChatModel.create({chat_id, open: true})
						}

						await User.updateOne({chat_id}, {action: 'ask'})
					} else if (reponse && reponse === 'stop_gpt_button') {
						ctx.replyWithChatAction('typing')
						ctx.deleteMessage()

						if(user?.last_message_id)
							ctx.deleteMessage(user?.last_message_id)

						const main_keyboard = await keyboard.main_menu(user?.language)
						const findChat = await ChatModel.findOne({chat_id, open: true})
						if (findChat) {
							await ChatModel.updateOne({_id: findChat?._id}, {open: false})
						}
						const {message_id} = await ctx.replyWithHTML(await languageResponse.checkResponse(user?.language, 'select_menu_message'), main_keyboard)
						await User.updateOne({chat_id}, {action: '', last_message_id:message_id})

					} else if (!reponse && user?.action === 'ask' || !reponse && user?.action === 'start_ask') {
						ctx.replyWithChatAction('typing')
						await User.updateOne({chat_id}, {action: 'start_ask'})
						const findChat = await ChatModel.findOne({chat_id, open: true})
						if (findChat) {
							await ChatGpt(ctx, findChat?._id, message, user?.language)
						}

					} else if (reponse && reponse === 'change_language_button') {
						ctx.replyWithChatAction('typing')
						const message = await languageResponse.checkResponse('en', 'language_message')
						const keyboards = await keyboard.language_button()
						return setTimeout(async () => {
							await ctx.replyWithHTML(message, keyboards)
							await User.updateOne({chat_id}, {action: ''})
						}, 500)
					} else if (reponse && reponse === 'book_a_table_button') {
						ctx.replyWithChatAction('typing')
						await ctx.replyWithHTML(await languageResponse.checkResponse(user?.language, 'book_message'), Markup.inlineKeyboard([
							[
								Markup.button.webApp(await languageResponse.checkResponse(user?.language, 'book_button'), `${WEB_APP_RESERVED}`),
							]]
						))
					} else if (reponse && reponse === 'review_button') {
						ctx.replyWithChatAction('typing')
						await ctx.replyWithHTML(await languageResponse.checkResponse(user?.language, 'review_message'), Markup.inlineKeyboard([
							[
								Markup.button.webApp(await languageResponse.checkResponse(user?.language, 'review_button'), `${WEB_APP_REVIEW}`),
							]]
						))
					} else if (reponse && reponse === 'stickers_button') {
						ctx.replyWithChatAction('typing')
						ctx.replyWithHTML(await languageResponse.checkResponse(user?.language, 'sticker_message'))
					}
				}


				if (callback || callback_action || callback_id) {
					if (callback === 'en' || callback === 'ru' || callback === 'uk' || callback === 'es') {
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

						if(user?.last_message_id)
							ctx.deleteMessage(user?.last_message_id)

						const main_keyboard = await keyboard.main_menu(callback)
						await ctx.replyWithAnimation({source: animationBuffer}).then((message) => {
							return setTimeout(async () => {
								ctx.deleteMessage(message.message_id)


								const {message_id} = await ctx.replyWithHTML(await languageResponse.checkResponse(callback, 'select_menu_message'), main_keyboard)
								await User.updateOne({chat_id}, {action: '',last_message_id:message_id})
							}, 3000);
						});
					} else if (callback_action === 'declineBook' && callback_id) {
						await Reserved.deleteOne({_id: callback_id})
						await ctx.deleteMessage()
					}

				}

			}
		} catch (e) {
			console.error(e)
		}
	});


};