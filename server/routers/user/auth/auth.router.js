const router = require("express").Router();
const controller = require("../../../controllers/user/auth/auth.controller.js");



router.post("/signup", controller.userSignup)

module.exports = router