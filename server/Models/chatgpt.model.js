const mongoose = require("mongoose");

const chatgptScheme = new mongoose.Schema({
    chat_id:{
        type: String,
        ref: 'Users',
        required: true,
    },
    thread_id:{
        type: String,
    },
    open:{
        type: Boolean,
        required: true,
        default:false
    }
},{ timestamps: true })

module.exports = mongoose.model('ChatGpt', chatgptScheme)