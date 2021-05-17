const mongoose = require('mongoose');
const { Schema } = mongoose;


var categorySchema = Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 32,
        unique: true,
    }
}, { timestamps: true })


module.exports = mongoose.model("Category", categorySchema)