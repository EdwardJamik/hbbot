const mongoose = require("mongoose");

const reservedScheme = new mongoose.Schema({
    chat_id:{
        type: String,
        ref: 'Users',
        required: true,
    },
    count_people:{
        type: String,
        required: true,
    },
    date:{
        type: String,
        required: true,
    },
    time:{
        type: String,
        required: true,
    },
    first_name:{
        type: String,
        required: true,
    },
    message_id:{
        type: String,
    },
    phone:{
        type: String,
        required: true,
    },
    declined:{
        type: Boolean,
        default:false
    },
    accepted:{
        type: Boolean,
        default:false
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
},{ timestamps: true })

module.exports = mongoose.model('Reserve', reservedScheme)