const fs = require('fs');
const OpenAI = require('openai')
const  { toFile }= require('openai');

const {GPT_API} = process.env

const openai = new OpenAI({
    apiKey: GPT_API,
});

async function main() {
    try {
        const data = fs.readFileSync('./input.txt', 'utf8');
        console.log(data);
        const response = await openai.beta.assistants.update('asst_cPeejNw6siuDk07fcuVDW4F3',{instructions:data})
            console.log(response)
    } catch (err) {
        console.error(err);
    }
}

main();

