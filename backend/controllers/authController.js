const User = require("../models/User");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Add this for token generation

// Temporary storage for OTPs (will be replaced with DB storage in a real system)
const otpStore = {};

// Generate OTP & Send Email
const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    // Save OTP in memory (temporary)
    otpStore[email] = otp;

    // IN case if the nodemailer did not work try this----
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. This OTP will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if OTP matches
    if (otpStore[email] !== otp) {
      return res.status(400).json({ message: "Invalid OTP or expired OTP!" });
    }

    // If OTP is valid, send success response
    res.json({ message: "OTP verified successfully!" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Hash new password
    user.password = newPassword; // Assign plain password
    await user.save(); // The pre("save") hook will hash it

    // Remove OTP from memory
    delete otpStore[email];

    res.json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expiration time
    });

    res.json({ token, message: "Login successful!" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

module.exports = { sendOTP, verifyOTP, resetPassword, loginUser };