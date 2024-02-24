const mongoose = require("mongoose");

const reviewScheme = new mongoose.Schema({
    chat_id:{
        type: String,
        ref: 'Users',
        required: true,
    },
    review_text:{
        type: String,
    },
    review_star:{
        type: Number,
        required: true,
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

module.exports = mongoose.model('Review', reviewScheme)