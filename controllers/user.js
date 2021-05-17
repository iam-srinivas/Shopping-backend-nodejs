const User = require('../models/user')
const Order = require('../models/order')

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((error, user) => {
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
        req.profile = user

        next()
    })
}


exports.getUser = (req, res) => {
    console.log(req.profile.name)
    req.profile.salt = undefined;
    req.profile.encryPassword = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    req.profile.role = undefined;
    req.profile.__v = undefined;
    return res.json(req.profile)
}


exports.getAllUsers = (req, res) => {
    User.find().exec((error, users) => {
        if (error) {
            return res.status(400).json({
                error: error
            })
        }
        if (!users) {
            return res.status(400).json({
                error: "No Users found"
            })
        }
        return res.json(users)


    })
}


exports.updateuser = (req, res) => {
    User.findByIdAndUpdate({ _id: req.profile._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        // new true sends the object from DB
        (error, user) => {

            if (error) {
                return res.status(400).json({
                    error: "Unable to Update",
                    msg: error
                })
            }

            res.json({ name: user.name, email: user.email, id: user._id })

        })
}

exports.userPurchaseList = (req, res) => {
    Order.find({ user: req.profile._id })
        .populate("user", "_id name")
        .exec((error, order) => {
            if (error) {
                return res.status(400).json({
                    error: "No Order in this account"
                })
            }
            return res.json(order)
        })
}


exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchases = []
    // order coming from frontend for now
    req.body.order.products.forEach((product) => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transactionId: req.body.order.transactionId
        })
    })
    // Store this in DB
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { purchases: purchases } },
        { new: true },

        (error, purchases) => {
            if (error) {
                return res.status(400).json({
                    error: "Unable to save Purchase List"
                })
            }
        })
    next()
}