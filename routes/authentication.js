const express = require("express");

const { register } = require("../controllers/AuthController");

const router = express.Router();

// registration route
router.post("/register", register);

// login route
router.post("/login", () => {
    console.log("login route");
});

// refresh token route
router.post("/refresh-token", () => {
    console.log("refresh token route");
});

// logout route
router.post("/login", () => {
    console.log("logout route");
});

module.exports = router;