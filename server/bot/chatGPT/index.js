const fs = require('fs');
const path = require('path');
const languageResponse = require("../middelware/middelware");
const {Markup} = require("telegraf");
const OpenAI = require("openai");

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

                while (true){
                    const run_status = await openai.beta.threads.runs.retrieve(
                        thread.id,
                        run.id
                    )

                    console.log(run_status.completed_at )

                    if(run_status.completed_at !== null)
                        break
                }

                const messages = await openai.beta.threads.messages.list(
                    thread.id,
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
            else {
                fs.readFile(filePath, 'utf8', async (readErr, data) => {
                    if (readErr) {
                        console.error(`Помилка при читанні файлу ${fileName}:`, readErr);
                    } else {
                        chatHistory = JSON.parse(data)
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

                        while (true){
                            const run_status = await openai.beta.threads.runs.retrieve(
                                thread.id,
                                run.id
                            )

                            console.log(run_status.completed_at )

                            if(run_status.completed_at !== null)
                                break
                        }

                        const messages = await openai.beta.threads.messages.list(
                            thread.id,
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

