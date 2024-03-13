const mongoose = require("mongoose");

const botChanelsScheme = new mongoose.Schema({
    chat_id: {
        type: String,
        unique: true,
        required: true,
    },
    groupType: {
        type: String,
    },
    title: {
        type: String,
    },
    language: {
        type: String,
        default: 'en',
    },
    access: {
        type: Boolean,
        default: false
    }
},{ timestamps: false })

module.exports = mongoose.model('bot_chanels', botChanelsScheme)