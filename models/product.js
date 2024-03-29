const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema

var productSchema = Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 32,
    },
    description: {
        type: String,
        trim: true,
        required: true,
        maxLength: 2000
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    stock: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true })


module.exports = mongoose.model("Product", productSchema)