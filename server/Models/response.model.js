const mongoose = require("mongoose");

const responseScheme = new mongoose.Schema({
    response:{
        type: Object,
        required: true,
    },
    id_response:{
        type: String,
        required: true,
    },
    web:{
        type: Boolean,
        default:false
    }
},{ timestamps: true })

module.exports = mongoose.model('Response', responseScheme)