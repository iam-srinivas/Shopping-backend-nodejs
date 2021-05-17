const express = require('express')
const router = express.Router()

const { getUserById, getUser, getAllUsers, updateuser, userPurchaseList } = require("../controllers/user")
const { isSignedIn, isAuthenticated } = require("../controllers/auth")



router.param("userId", getUserById)


router.get("/user/:userId", isSignedIn, isAuthenticated, getUser)
router.put("/user/:userId", isSignedIn, isAuthenticated, updateuser)
router.get("orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList)

router.get("/users", getAllUsers)











module.exports = router
