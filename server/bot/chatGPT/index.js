const fs = require('fs');
const path = require('path');
const languageResponse = require("../middelware/middelware");
const {Markup} = require("telegraf");
const OpenAI = require("openai");
const ChatModel = require("../../Models/chatgpt.model");

const {GPT_API,GPT_ASSISSTAN} = process.env

const openai = new OpenAI({
    apiKey: GPT_API,
});
module.exports = async (ctx,id,message,language) => {
    try {
        const directoryPath = './gpt';
        const fileName = `${id}.json`;
        const filePath = path.join(directoryPath, fileName);

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

                    console.log(runStatus.completed_at);

                    if (runStatus.completed_at === null) {
                        await waitForCompletion(threadId, runId);
                    }
                }

                await waitForCompletion(thread.id, run.id);

                const messages = await openai.beta.threads.messages.list(
                    thread.id,
                )

                const chatGptReply = messages.data[0].content[0].text.value;
                chatHistory.push({role:messages.data[0].role, content: messages.data[0].content[0].text.value});

                const jsonData = JSON.stringify(chatHistory, null, 2);

                await ChatModel.updateOne({_id:id, open: true},{thread_id:thread.id})

                fs.writeFile(filePath, jsonData, 'utf8', async (writeErr) => {
                    if (writeErr) {
                        console.error('Помилка при створенні файлу:', writeErr);
                    } else {
                        await ctx.replyWithHTML(chatGptReply,Markup.keyboard([
                            [
                                await languageResponse.checkResponse(language, `stop_gpt_button`),
                            ]
                            ]
                        ).resize())
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

                            console.log(runStatus.completed_at);

                            if (runStatus.completed_at === null) {
                                await waitForCompletion(threadId, runId);
                            }
                        }

                        await waitForCompletion(user?.thread_id, run.id);

                        const messages = await openai.beta.threads.messages.list(
                            user?.thread_id,
                        )

                        const chatGptReply = messages.data[0].content[0].text.value;
                        chatHistory.push({role:messages.data[0].role, content: messages.data[0].content[0].text.value});

                        const jsonData = JSON.stringify(chatHistory, null, 2);

                        fs.writeFile(filePath, jsonData, 'utf8', async (writeErr) => {
                            if (writeErr) {
                                console.error('Помилка при створенні файлу:', writeErr);
                            } else {
                                await ctx.replyWithHTML(chatGptReply,Markup.keyboard([
                                        [
                                            await languageResponse.checkResponse(language, `stop_gpt_button`),
                                        ]
                                    ]
                                ).resize())
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

