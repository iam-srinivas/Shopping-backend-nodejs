const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { Schema } = mongoose;


var userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 32,
        trim: true
    },
    lastName: {
        type: String,
        maxLength: 32,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    userInfo: {
        type: String,
        trim: true
    },
    encryPassword: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
}, { timestamps: true })

userSchema.virtual("password")
    .set(function (password) {
        this._password = password
        this.salt = uuidv4()
        this.encryPassword = this.securePassword(password)
    })
    .get(function () {
        return this._password
    })



userSchema.methods = {
    securePassword: function (plainPassword) {
        if (!plainPassword) return ""
        try {
            return crypto.createHmac('sha256', this.salt)
                .update(plainPassword)
                .digest('hex');
        } catch (error) {
            return ""
        }
    },
    authenticate: function (plainPassword) {
        return this.securePassword(plainPassword) === this.encryPassword
    }
}
// Both are same
// userSchema.method({
//     securePassword: function (plainPassword) {
//         if (!plainPassword) return ""
//         try {
//             return crypto.createHmac('sha256', this.salt)
//                 .update(plainPassword)
//                 .digest('hex');
//         } catch (error) {
//             return ""
//         }
//     },
//     authenticate: function (plainPassword) {
//         return this.securePassword(plainPassword) === this.encryPassword
//     }
// })

module.exports = mongoose.model("User", userSchema)