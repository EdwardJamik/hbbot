const mongoose = require("mongoose");

const chatgptScheme = new mongoose.Schema({
    chat_id:{
        type: Object,
        ref: 'Users',
        required: true,
    },
    open:{
        type: Boolean,
        required: true,
        default:false
    }
},{ timestamps: true })

module.exports = mongoose.model('ChatGpt', chatgptScheme)