const Response = require('../../Models/response.model')
class middelware {

    async checkResponse(language, id_response) {
        try{
            const { response } = await Response.findOne({ id_response }, { response: 1, _id: 0 });
            return response[language] ? response[language] : false;
        } catch (e){
            console.error(e)
        }
    }

    async checkIdResponse(language, text) {
        try{
            const response = await Response.findOne({ [`response.${language}`]: text }, { id_response: 1, _id: 0 });
            return response?.id_response ? response?.id_response : false;
        } catch (e){
            console.error(e)
        }
    }
}

module.exports = new middelware;
