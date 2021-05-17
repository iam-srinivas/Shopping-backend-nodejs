const { Order, ProductCart } = require("../models/order")

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
        .populate("products.product", "name price")
        .exec((error, order) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            }
            if (!order) {
                return res.status(400).json({
                    error: "Order doesn't exist"
                })
            }
            req.order = order

            next()
        })
}

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save((error, order) => {
        if (error) {
            return res.status(400).json({
                error: "unable to create order"
            })
        }
        res.json(order)
    })
}

exports.getAllOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name")
        .exec((error, orders) => {
            if (error) {
                return res.status(400).json({
                    error: error
                })
            }
            res.json(orders)
        })
}

exports.getOrderStatus = (req, res) => {
    res.json(Order.schema.path("status").enumValues)
    // to get all status types
}

exports.updateOrderStatus = (req, res) => {
    Order.updateOne(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        (error, order) => {
            if (error) {
                return res.status(400).json({
                    error: "cannot update order status"
                })
            }
            res.json(orders)
        }
    )
}