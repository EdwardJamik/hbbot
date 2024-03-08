const fs = require('fs');
const OpenAI = require('openai')
const  { toFile }= require('openai');

const {GPT_API} = process.env

const openai = new OpenAI({
    apiKey: GPT_API,
});

async function main() {
    try {

        // const data = fs.createReadStream('./answers.jsonl', 'utf8');
        // console.log(data)
        // const responseDel = await openai.files.del('file-sWJanTi8oTGVRlYLHzhsgj0T')
        // console.log('del',responseDel)
        // const response = await openai.files.create({file:data, purpose:'assistants'},{})
        // console.log(response)


        // const response = await openai.beta.assistants.update('asst_cPeejNw6siuDk07fcuVDW4F3',{file_ids:null})
        // //
        // console.log(response)

        // const data = fs.readFileSync('./input.txt', 'utf8');
        // console.log(data);
        // const response = await openai.beta.assistants.update('asst_cPeejNw6siuDk07fcuVDW4F3',{instructions:data})
        //     console.log(response)
    } catch (err) {
        console.error(err);
    }
}

main();

