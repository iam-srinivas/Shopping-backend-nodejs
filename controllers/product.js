const Product = require("../models/product")
const formidable = require('formidable');
const _ = require('lodash');
const fs = require("fs")

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category") //generates whole category data instead of just object id
        .exec((error, product) => {
            if (error) {
                return res.status(400).json({
                    error: "Product noy found in DB",
                })
            }
            if (!product) {
                return res.status(400).json({
                    error: "product doesn't exist"
                })
            }
            req.product = product
            next()

        })
}


exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (error, fields, file) => {
        if (error) {
            return res.status(400).json({
                error: "Problem with image",
            })
        }
        // destructuring fields
        const { name, description, price, category, stock } = fields
        // restrictions
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: "Please include all fields"
            })
        }

        let product = new Product(fields)

        // handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size too big",
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        // Save to DB
        product.save((error, product) => {
            if (error) {
                return res.status(400).json({
                    error: "Unable to save Product",
                })
            }
            product.photo = undefined
            res.json(product)
        })
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}


exports.photo = (req, res, next) => {
    // NEED to handle later middleware not required
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()

}


exports.deleteProduct = (req, res) => {
    const product = req.product
    product.remove((error, product) => {
        if (error) {
            return res.status(400).json({
                error: error.toString()
            })
        }
        product.photo = undefined
        res.json({
            message: "delete was successful",
            product
        })
    })
}
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (error, fields, file) => {
        if (error) {
            return res.status(400).json({
                error: "Problem with image",
            })
        }
        // UPDATING THE OBJECT
        let product = req.product
        product = _.extend(product, fields)

        // handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size too big",
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        // Save to DB
        product.save((error, product) => {
            if (error) {
                return res.status(400).json({
                    error: "Unable to update Product",
                })
            }
            product.photo = undefined
            res.json(product)
        })
    })
}


exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    Product.find()
        .select("-photo")//to deselect photo - is used
        .sort([[sortBy, "asc"]])
        .limit(limit)
        .populate("category") //by adding this category details are also generated or populated
        .exec((error, products) => {
            if (error) {
                return res.status(400).json({
                    error: "No Products found",
                })
            }
            if (!products) {
                return res.status(400).json({
                    error: "No Products found"
                })
            }
            res.json(products)
        })
}


exports.getAppUniqueCategory = (req, res) => {
    // field,option,callback
    Product.distinct("category", {}, (error, categories) => {
        if (error) {
            return res.status(400).json({
                error: "did't find distinct category",
            })
        }
        if (!categories) {
            return res.status(400).json({
                error: "did't find distinct category",
            })
        }
        res.json(categories)
    })
}

exports.updateStock = (req, res, next) => {
    let myOpetrations = req.body.order.products.map(product => {
        return {
            updateOne: {
                filter: { _id: product._id },
                update: { $inc: { stock: -product.count, sold: +product.count } }
            }
        }
    })
    // operation,option,callback
    Product.bulkWrite(myOpetrations, {}, (error, products) => {
        if (error) {
            return res.status(400).json({
                error: "Bulk opetration failed",
            })
        }
        next()
    })
}

