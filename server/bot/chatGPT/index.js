const fs = require('fs');
const path = require('path');
const axios = require('axios');
const languageResponse = require("../middelware/middelware");
const {Markup} = require("telegraf");

const apiKey = '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'; // Замініть це своїм ключем API
const apiUrl = 'https://api.openai.com/v1/chat/completions'; // URL API ChatGPT
const chatHistoryFilePath = path.join(__dirname, 'chatHistory.json'); // Шлях до файлу історії чату

module.exports = async (ctx,id,message,language) => {
    try {
        const directoryPath = './gpt';
        const fileName = `${id}.json`;
        const filePath = path.join(directoryPath, fileName);

        let chatHistory = []

        fs.access(filePath, fs.constants.F_OK, async (err) => {
            if (err) {

                chatHistory.push({role: 'user', content: message});

                const response = await axios.post(apiUrl, {
                    model: 'gpt-3.5-turbo',
                    messages: chatHistory,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                });

                const chatGptReply = response.data.choices[0].message.content;

                chatHistory.push({role: 'assistant', content: chatGptReply});

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


            } else {
                fs.readFile(filePath, 'utf8', async (readErr, data) => {
                    if (readErr) {
                        console.error(`Помилка при читанні файлу ${fileName}:`, readErr);
                    } else {
                        chatHistory = JSON.parse(data)
                        chatHistory.push({role: 'user', content: message});

                        const response = await axios.post(apiUrl, {
                            model: 'gpt-3.5-turbo',
                            messages: chatHistory,
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${apiKey}`,
                            },
                        });

                        const chatGptReply = response.data.choices[0].message.content;

                        chatHistory.push({role: 'assistant', content: chatGptReply});

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

