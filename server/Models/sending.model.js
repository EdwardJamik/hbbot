const mongoose = require("mongoose");

const SendingList = new mongoose.Schema({
    date: {
        type: Date,
    },
    content:{
        type: Object,
    },
    image:{
        type: String,
        default: null
    },
    watch:{
        type: String,
        default: null
    },
    un_sending_telegram:{
        type: String,
    },
    sending_telegram:{
        type: String,
        default:null,
        require:true,
    },
    sending_end:{
        type: Boolean,
        default: false
    },
    sending_start:{
        type: Boolean,
        default: false
    },
    button:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
},{ timestamps: true })

const Sendings = mongoose.model("sending_list", SendingList);

module.exports = Sendings;