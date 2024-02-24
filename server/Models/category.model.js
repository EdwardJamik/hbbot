const mongoose = require("mongoose");

const categoryScheme = new mongoose.Schema({
    title:{
        type: Object,
        required: true,
    },
    img:{
        type: String
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

module.exports = mongoose.model('Category', categoryScheme)