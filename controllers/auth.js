const User = require("../models/user")
const { validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const router = require("../routes/auth");

exports.signup = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array().map((tmp) => {
                tmp.location = undefined
                tmp.value = undefined
                // to hide location and value
                return tmp
            })
        });
    }
    const user = new User(req.body)
    user.save((error, user) => {
        if (error) {
            return res.status(400).json({
                error: error.toString()
            })
        }
        res.json({ name: user.name, email: user.email, id: user._id })
    })
}

exports.signin = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array().map((tmp) => {
                tmp.location = undefined
                tmp.value = undefined
                // to hide location and value
                return tmp
            })
        });
    }

    const { email, password } = req.body
    User.findOne({ email }, (error, user) => {
        if (error) {
            return res.status(400).json({
                error: error
            })
        }
        if (!user) {
            return res.status(400).json({
                error: "Email doesn't exist"
            })
        }

        if (!user.authenticate(password)) {
            return res.status(422).json({
                error: "Email and Password Doesn't Match"
            })
        }
        // creating token
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
        // put token in cookies
        res.cookie("token", token, { expire: new Date() + 9999 })
        const { _id, name, email, role } = user
        return res.json({
            token,
            user: {
                _id, name, email, role
            }
        })
    })

}

exports.signout = (req, res) => {
    res.clearCookie("token")
    res.json({
        message: "User Signout successfully"
    })
}

// Protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.TOKEN_SECRET,
    userProperty: "auth", //auth name used as object 
    algorithms: ['HS256']
})
// custom middleware
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if (!checker) {
        return res.status(403).json({
            error: "Access Denied"
        })
    }
    next()
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "You Don't have permission to perform this action"
        })
    }
    next();
}