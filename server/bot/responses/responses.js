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
module.exports = bot => {

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

				await User.updateOne({action: '',updatedAt:new Date()})

				if (user?.first_name !== first_name || user?.username !== username)
					await User.updateOne({chat_id}, {username, first_name})

				if (!user) {
					ctx.replyWithChatAction('typing')
					await User.create({chat_id, username, first_name})
					const message = await languageResponse.checkResponse('en', 'language_message')
					const keyboards = await keyboard.language_button()
					return setTimeout(async () => {
						const {message_id} = await ctx.replyWithHTML(message, keyboards)
						await User.updateOne({chat_id}, {action: ''})
					}, 500)
				} else if(user && !user?.language){
					ctx.replyWithChatAction('typing')
					const message = await languageResponse.checkResponse('en', 'language_message')
					const keyboards = await keyboard.language_button()
					return setTimeout(async () => {
						const {message_id} = await ctx.replyWithHTML(message, keyboards)
						await User.updateOne({chat_id}, {action: ''})
					}, 500)
				} else if(user && user?.language){
					ctx.replyWithChatAction('typing')
					const animationBuffer = fs.readFileSync('./bot/loader/loader.mp4');
					const main_keyboard = await keyboard.main_menu(language)
					await ctx.replyWithAnimation({ source: animationBuffer }).then((message) => {
						return setTimeout(async () => {
							ctx.deleteMessage(message?.message_id)
							const {message_id} = await ctx.replyWithHTML(await languageResponse.checkResponse(language, 'select_menu_message'), main_keyboard)
							await User.updateOne({chat_id}, {action: ''})
						}, 3000);
					});
				}

				const main_button = await Response.findOne({id_response: 'menu_button'})
				await ctx.setChatMenuButton({
					chatId: chat_id,
					type: "web_app",
					text: `${main_button?.response[language]}`,
					web_app: {
						url: WEB_APP,
					},
				});


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
			const user = await User.findOne({ chat_id }, { _id: 0, action: 1, ban: 1, language: 1 });

			if (!user?.ban) {
				const first_name = ctx?.chat?.first_name
				const username = ctx?.chat?.username
				const message = ctx?.message?.text;

				const callback = ctx?.update?.callback_query?.data
				const callback_splits = callback?.split('-')
				const callback_action = callback_splits ? callback_splits[0] : false
				const callback_id =  callback_splits ? callback_splits[1] : false

				if(message && !callback){

					const reponse = await languageResponse.checkIdResponse(user?.language, message)

					if(user?.action && !reponse)
						await User.updateOne({updatedAt:new Date()})
					else if(user?.action && reponse)
						await User.updateOne({action:'',updatedAt:new Date()})

					if(reponse && reponse === 'help_button'){
						const main_keyboard = await keyboard.main_menu(user?.language)

						await ctx.replyWithHTML(await languageResponse.checkResponse(user?.language, 'ask_message'),main_keyboard)

						const findChat = await ChatModel.findOne({chat_id, open:true})
						if(!findChat){
							await ChatModel.create({chat_id, open:true})
						}

						await User.updateOne({chat_id}, {action:'ask'})
					} else if(reponse && reponse === 'stop_gpt_button'){
						const main_keyboard = await keyboard.main_menu(user?.language)
						const findChat = await ChatModel.findOne({chat_id, open:true})
						if(findChat){
							await ChatModel.updateOne({_id:findChat?._id},{open:false})
							await User.updateOne({chat_id}, {action: ''})
							await ctx.replyWithHTML(await languageResponse.checkResponse(user?.language, 'select_menu_message'), main_keyboard)
						}
					} else if(!reponse && user?.action === 'ask'){

						const findChat = await ChatModel.findOne({chat_id, open:true})
						if(findChat){
							await ChatGpt(ctx,findChat?._id,message,user?.language)
						}

					} else if(reponse && reponse === 'menu_button'){
							ctx.deleteMessage()
						const main_keyboard = await keyboard.main_menu(user?.language)
						await ctx.replyWithHTML(await languageResponse.checkResponse(user?.language, 'menu_message'),main_keyboard)

					} else if(reponse && reponse === 'book_a_table_button'){

						ctx.deleteMessage()
						await ctx.replyWithHTML(await languageResponse.checkResponse(user?.language, 'book_message'),Markup.inlineKeyboard([
							[
								Markup.button.webApp(await languageResponse.checkResponse(user?.language, 'book_button'), `${WEB_APP_RESERVED}`),
							]]
						))
					} else if(reponse && reponse === 'review_button'){

						ctx.deleteMessage()
						await ctx.replyWithHTML(await languageResponse.checkResponse(user?.language, 'review_message'),Markup.inlineKeyboard([
							[
								Markup.button.webApp(await languageResponse.checkResponse(user?.language, 'review_button'), `${WEB_APP_REVIEW}`),
							]]
						))
					} else if(reponse && reponse === 'stickers_button'){
						ctx.replyWithHTML(await languageResponse.checkResponse(user?.language, 'sticker_message'))
					}
				}


				if(callback || callback_action || callback_id){
					if(callback === 'en' || callback === 'ru' || callback === 'uk' || callback === 'es'){
						await User.updateOne({chat_id},{language: callback})

						ctx.deleteMessage()

						ctx.replyWithChatAction('typing')

						const animationBuffer = fs.readFileSync('./bot/loader/loader.mp4');

						const main_keyboard = await keyboard.main_menu(callback)
						await ctx.replyWithAnimation({ source: animationBuffer }).then((message) => {
							return setTimeout(async () => {
								ctx.deleteMessage(message?.message_id)
								const {message_id} = await ctx.replyWithHTML(await languageResponse.checkResponse(callback, 'select_menu_message'), main_keyboard)
								await User.updateOne({chat_id}, {action: 'ask'})
							}, 3000);
						});
					} else if(callback_action === 'declineBook' && callback_id){
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