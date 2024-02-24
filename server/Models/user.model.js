const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    chat_id: {
        type: Number,
        unique: true,
    },
    first_name: {
        type: String,
        default:'Not specified'
    },
    username: {
        type: String,
        default:'Not specified'
    },
    language: {
        type: String,
    },
    action: {
        type: String,
    },
    phone: {
        type: String,
        default:'Not specified'
    },
    last_message_id: {
        type: String
    },
    ban: {
        type: Boolean
    },
    user_bot_ban: {
        type: Boolean,
        default:false
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
},{ timestamps: true })

module.exports = mongoose.model('Users', usersSchema)
