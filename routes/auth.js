var express = require("express");
var router = express.Router();
const { signup, signin, signout } = require("../controllers/auth");
const { check } = require("express-validator");

router.post(
    "/signup",
    [
        check("name")
            .isLength({ min: 3 })
            .withMessage("must be at least 3 chars long"),
        check("email").isEmail().withMessage("Provide a valid email format"),
        check("password")
            .isLength({
                min: 3,
            })
            .withMessage("must be at least 3 chars long"),
    ],
    signup
);

router.post(
    "/signin",
    [
        check("email").isEmail().withMessage("Provide a valid email format"),
        check("password")
            .isLength({
                min: 3,
            })
            .withMessage("must be at least 3 chars long"),
    ],
    signin
);

router.get("/signout", signout)

module.exports = router;
