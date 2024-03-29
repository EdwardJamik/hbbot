const fs = require('fs');
const path = require('path');
const languageResponse = require("../middelware/middelware");
const {Markup} = require("telegraf");
const OpenAI = require("openai");
const ChatModel = require("../../Models/chatgpt.model");
const User = require("../../Models/user.model");
const {bot} = require("../bot");

const {GPT_API,GPT_ASSISSTAN} = process.env

const openai = new OpenAI({
    apiKey: GPT_API,
});
module.exports = async (bot,ctx,id,message,language) => {
    try {
        const directoryPath = './gpt';
        const fileName = `${id}.json`;
        const filePath = path.join(directoryPath, fileName);
        const chat_id = ctx?.chat?.id;
        let chatHistory = []

        fs.access(filePath, fs.constants.F_OK, async (err) => {
            if (err) {

                chatHistory.push({role: 'user', content: message});


                const thread = await openai.beta.threads.create()

                const response = await openai.beta.threads.messages.create(
                    thread.id,
                    {content:message,role:'user'}
                )

                const run = await openai.beta.threads.runs.create(
                    thread.id,
                    {assistant_id:GPT_ASSISSTAN}
                )

                async function waitForCompletion(threadId, runId) {
                    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

                    if (runStatus.completed_at === null) {
                        await waitForCompletion(threadId, runId);
                    }
                }

                await waitForCompletion(thread.id, run.id);

                const messages = await openai.beta.threads.messages.list(
                    thread.id,
                )

                const chatGptReply = messages.data[0].content[0].text.value;

                const regex = /\[.*?\]|\{.*?\}/g;
                const found = chatGptReply.match(regex);

                const question = JSON.parse(found)

                if(found && question) {
                    await bot.telegram.sendMessage('-4186044691', `Вопрос: "${question.question}" требует больше информации в базе знаний. Пожалуйста, дайте ответ как можно скорее в развернутом виде.\n\nchat_id:${chat_id}`).catch((e)=>{
                        console.log(e)})
                }

                const resultString = chatGptReply.replace(regex, '');
                chatHistory.push({role:messages.data[0].role, content: resultString});

                const jsonData = JSON.stringify(chatHistory, null, 2);

                await ChatModel.updateOne({_id:id, open: true},{thread_id:thread.id})

                fs.writeFile(filePath, jsonData, 'utf8', async (writeErr) => {
                    if (writeErr) {
                        console.error('Помилка при створенні файлу:', writeErr);
                    } else {
                            const user = await User.findOne({chat_id})
                            ctx.deleteMessage(user?.last_message_id).catch((e)=>{})

                        const {message_id} = await ctx.replyWithHTML(resultString,Markup.inlineKeyboard([
                                [
                                    {
                                        text: await languageResponse.checkResponse(language, `back_main_answer_menu`),
                                        callback_data: 'stop_gpt'
                                    }
                                ]
                            ]
                        ).resize()).catch((e)=>{})
                        await User.updateOne({chat_id},{message_id})
                    }
                });
            }
            else {
                fs.readFile(filePath, 'utf8', async (readErr, data) => {
                    if (readErr) {
                        console.error(`Помилка при читанні файлу ${fileName}:`, readErr);
                    } else {
                        chatHistory = JSON.parse(data)
                        chatHistory.push({role: 'user', content: message});

                        const user = await ChatModel.findOne({_id:id, open: true},{thread_id:1,_id:0})
                        const response = await openai.beta.threads.messages.create(
                            user?.thread_id,
                            {content:message,role:'user'}
                        )

                        const run = await openai.beta.threads.runs.create(
                            user?.thread_id,
                            {assistant_id:GPT_ASSISSTAN}
                        )

                        async function waitForCompletion(threadId, runId) {
                            const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

                            if (runStatus.completed_at === null) {
                                await waitForCompletion(threadId, runId);
                            }
                        }

                        await waitForCompletion(user?.thread_id, run.id);

                        const messages = await openai.beta.threads.messages.list(
                            user?.thread_id,
                        )

                        const chatGptReply = messages.data[0].content[0].text.value;

                        const regex = /\[.*?\]|\{.*?\}/g;
                        const found = chatGptReply.match(regex);

                        const question = JSON.parse(found)

                        if(found && question) {
                            await bot.telegram.sendMessage('-4186044691', `Вопрос: "${question.question}" требует больше информации в базе знаний. Пожалуйста, дайте ответ как можно скорее в развернутом виде.\n\nchat_id:${chat_id}`).catch((e)=>{
                                console.log(e)})
                        }
                        const resultString = chatGptReply.replace(regex, '');
                        chatHistory.push({role:messages.data[0].role, content: resultString});

                        const jsonData = JSON.stringify(chatHistory, null, 2);

                        fs.writeFile(filePath, jsonData, 'utf8', async (writeErr) => {
                            try {
                                if (writeErr) {
                                    console.error('Помилка при створенні файлу:', writeErr);
                                } else {
                                    const user = await User.findOne({chat_id})
                                    const {message_id} = await ctx.replyWithHTML(resultString, Markup.inlineKeyboard([
                                            [
                                                {
                                                    text: await languageResponse.checkResponse(language, `back_main_answer_menu`),
                                                    callback_data: 'stop_gpt'
                                                }
                                            ]
                                        ]
                                    ).resize()).catch((e) => {
                                        console.log(e)
                                    })

                                    await ctx.telegram.editMessageReplyMarkup(chat_id, user?.message_id, null, { reply_markup: {remove_keyboard: true} }).catch((error) => {
                                        console.error('Error:', error);
                                    });
                                    await User.updateOne({chat_id},{message_id})
                                }
                            } catch (e){
                                console.log(e)
                            }

                        });
                    }
                });
            }
        });

    } catch (error) {
        console.error('Error sending message to ChatGPT:', error);
        throw error;
    }
}

