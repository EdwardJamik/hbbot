const mongoose = require("mongoose");

const productScheme = new mongoose.Schema({
    title:{
        type: Object,
        required: true,
    },
    description:{
        type: Object,
        required: true,
    },
    price:{
        type: String,
        required: true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    photo:{
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

module.exports = mongoose.model('Product', productScheme)