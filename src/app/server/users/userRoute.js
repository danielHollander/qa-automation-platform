const express = require("express");
const router = express.Router();
const userController = require("./userContoller");


router.post("/register", userController.registerNewUser);
router.post("/login", userController.loginUser);
router.get("/", userController.defineDummyData)

module.exports = router;