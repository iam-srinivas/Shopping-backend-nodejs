const Category = require("../models/category")

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec(
        (error, category) => {
            if (error) {
                return res.status(400).json({
                    error: "Category noy found in DB",
                })
            }
            if (!category) {
                return res.status(400).json({
                    error: "categor doesn't exist"
                })
            }
            req.category = category

            next()

        }
    )

}

exports.createCategory = (req, res) => {
    const category = new Category(req.body)
    category.save((error, category) => {
        if (error) {
            return res.status(400).json({
                error: error.toString()
            })
        }
        res.json(category)
    })
}


exports.getCategory = (req, res) => {
    res.json(req.category)
}

exports.getAllCategories = (req, res) => {
    Category.find().exec((error, categories) => {
        if (error) {
            return res.status(400).json({
                error: error.toString()
            })
        }


        res.json(categories)
    })
}


exports.updateCategory = (req, res) => {
    const category = req.category
    category.name = req.body.name
    // Second method 1st is in user
    category.save((error, updatedCategory) => {
        if (error) {
            return res.status(400).json({
                error: error.toString()
            })
        }

        res.json(updatedCategory)
    })
}


exports.removeCategory = (req, res) => {
    const category = req.category
    category.remove((error, category) => {
        if (error) {
            return res.status(400).json({
                error: error.toString()
            })
        }

        res.json(category)
    })
}