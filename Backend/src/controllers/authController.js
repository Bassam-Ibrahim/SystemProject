
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
const register = async (req, res) => {
    try {
        const {
            fullName,
            accountType,
            email,
            password,
            confirmPassword
        } = req.body;

        // Validate input types
        if (
            typeof fullName !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            typeof confirmPassword !== "string" ||
            typeof accountType !== "string"
        ) {
            return res.status(400).json({
                message: "Invalid input data"
            });
        }

        // Check required fields
        if (
            !fullName.trim() ||
            !accountType ||
            !email.trim() ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Validate account type
        if (!["professor", "student"].includes(accountType)) {
            return res.status(400).json({
                message: "Invalid account type"
            });
        }

        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // Validate professor email
        if (
            accountType === "professor" &&
            !normalizedEmail.endsWith("@sci.cu.edu.eg")
        ) {
            return res.status(400).json({
                message: "Professor email must end with @sci.cu.edu.eg"
            });
        }

        // Validate student email
        if (
            accountType === "student" &&
            !normalizedEmail.endsWith("@std.sci.cu.edu.eg")
        ) {
            return res.status(400).json({
                message: "Student email must end with @std.sci.cu.edu.eg"
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        // Check duplicate email
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            fullName: fullName.trim(),
            email: normalizedEmail,
            passwordHash,
            accountType
        });

        await newUser.save();

        return res.status(201).json({
            message: "Account created successfully",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                accountType: newUser.accountType
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// LOGIN
const login = async (req, res) => {
    try {
        const { email, password, accountType } = req.body;

        // Validate input types
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            typeof accountType !== "string"
        ) {
            return res.status(400).json({
                message: "Invalid input data"
            });
        }

        // Check required fields
        if (!email.trim() || !password || !accountType) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Validate account type
        if (!["professor", "student"].includes(accountType)) {
            return res.status(400).json({
                message: "Invalid account type"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // Validate email domain
        if (
            accountType === "professor" &&
            !normalizedEmail.endsWith("@sci.cu.edu.eg")
        ) {
            return res.status(400).json({
                message: "Professor email must end with @sci.cu.edu.eg"
            });
        }

        if (
            accountType === "student" &&
            !normalizedEmail.endsWith("@std.sci.cu.edu.eg")
        ) {
            return res.status(400).json({
                message: "Student email must end with @std.sci.cu.edu.eg"
            });
        }

        // Find user
        const user = await User.findOne({
            email: normalizedEmail,
            accountType
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Check JWT secret
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                accountType: user.accountType
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// EXPORT
module.exports = {
    register,
    login
};
