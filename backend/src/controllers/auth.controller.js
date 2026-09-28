const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createAccessToken, createRefreshToken } = require("../utils/tokens");

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        return res.status(500).json({
            message: "Server error"
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password +refreshTokenHash");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const accessToken = createAccessToken(user._id.toString());
        const refreshToken = createRefreshToken(user._id.toString());
        const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

        user.refreshTokenHash = refreshTokenHash;
        await user.save();

        res.cookie("refreshToken", refreshToken, cookieOptions);

        return res.status(200).json({
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
}

async function refreshToken(req, res) {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({
                message: "Refresh token required"
            });
        }

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded.userId).select("+refreshTokenHash");

        if (!user || !user.refreshTokenHash) {
            return res.status(401).json({
                message: "Invalid refresh token. Please login again."
            });
        }

        const matches = await bcrypt.compare(token, user.refreshTokenHash);

        if (!matches) {
            res.clearCookie("refreshToken", cookieOptions);

            return res.status(401).json({
                message: "Invalid refresh token. Please login again."
            });
        }

        const accessToken = createAccessToken(user._id.toString());

        return res.status(200).json({
            message: "Access token refreshed",
            accessToken
        });
    } catch (error) {
        res.clearCookie("refreshToken", cookieOptions);

        return res.status(401).json({
            message: "Invalid or expired refresh token. Please login again."
        });
    }
}

async function logout(req, res) {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $set: { refreshTokenHash: null }
        });

        res.clearCookie("refreshToken", cookieOptions);

        return res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
}

async function me(req, res) {
    return res.status(200).json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            createdAt: req.user.createdAt
        }
    });
}

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    me
};
