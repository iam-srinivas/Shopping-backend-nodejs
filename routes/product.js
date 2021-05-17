var express = require("express");
var router = express.Router();
const { getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProducts } = require("../controllers/product")
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth")
const { getUserById } = require("../controllers/user")


// params
router.param("userId", getUserById)
router.param("productId", getProductById)

// routes
// read routes
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)
router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId", photo)
// delete routes
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct)

// update routes
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)

// listing routes
router.get("/products", getAllProducts)

module.exports = router;
