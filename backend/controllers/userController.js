const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route   POST /api/users/register
// @desc    Register a new user
const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ fullName, email, password });
        res.status(201).json({ 
            _id: user._id, 
            fullName: user.fullName, 
            email: user.email, 
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   POST /api/users/login
// @desc    Authenticate user & get token
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        res.status(200).json({ 
            _id: user._id, 
            fullName: user.fullName, 
            email: user.email, 
            token: generateToken(user._id) 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   GET /api/users
// @desc    Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude password
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route   DELETE /api/users/:id
// @desc    Delete user account
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getUsers, deleteUser };
