const express = require("express");
const { sendOTP, verifyOTP, resetPassword, loginUser } = require("../controllers/authController");

const router = express.Router();

// Send OTP Route
router.post("/forgot-password", sendOTP);

// Verify OTP Route
router.post("/verify-otp", verifyOTP);

// Reset Password Route
router.post("/reset-password", resetPassword);

// Login Route
router.post("/login", loginUser);

module.exports = router;