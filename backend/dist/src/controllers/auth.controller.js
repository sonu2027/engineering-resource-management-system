"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCookie = exports.logoutUser = exports.updatePassword = exports.verifyEmail = exports.changePassword = exports.loginUser = exports.sendEmailVerificationOTP = exports.signupUser = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_2 = __importDefault(require("../models/user.model"));
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, employmentType, seniority, skills, name, email, department, password, maxCapacity } = req.body;
    console.log("req.body: ", req.body);
    try {
        const existedUser = yield user_model_1.default.findOne({ email });
        if (existedUser) {
            res.status(409).json({
                userExist: true,
                message: "User already exists",
            });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        console.log("hashedPassword: ", hashedPassword);
        let user;
        if (role === 'manager') {
            user = yield user_model_1.default.create({
                name,
                email,
                password: hashedPassword,
                role
            });
        }
        else {
            const defaultCapacity = employmentType === "part-time" ? 50 : 100;
            user = yield user_model_1.default.create({
                name,
                email,
                password: hashedPassword,
                role,
                employmentType,
                seniority,
                skills,
                department,
                maxCapacity: defaultCapacity,
                availableCapacity: defaultCapacity
            });
        }
        if (!user) {
            res.status(500).json({ message: "User creation failed" });
            return;
        }
        const _a = user.toObject(), { password: _ } = _a, userData = __rest(_a, ["password"]);
        res.status(201).json({
            userExist: false,
            data: user,
            message: "User registered successfully",
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.signupUser = signupUser;
const sendEmailVerificationOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { OTP, email } = req.body;
    console.log("req.body: ", req.body);
    let transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        auth: {
            user: "sonu.mondal.2027@gmail.com",
            pass: "ghfs wdlk pkwd pjmg",
        },
    });
    let mailOptions = {
        from: "sonu.mondal.2027@gmail.com",
        to: email,
        subject: "Verify your email",
        text: `Welcome to the engineering resource management system. Please, verify your email by entering the OTP. Your OTP is: ${OTP}`,
    };
    console.log("mailOptions: ", mailOptions);
    try {
        yield transporter.sendMail(mailOptions);
        res.send("Email sent successfully");
    }
    catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
    }
});
exports.sendEmailVerificationOTP = sendEmailVerificationOTP;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body in login: ", req.body);
    const { email, password } = req.body;
    try {
        const foundUser = yield user_model_1.default.findOne({ email });
        if (!foundUser) {
            res.status(401).json({ message: "Email not found" });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, foundUser.password);
        if (!isMatch) {
            res.status(401).json({ message: "Incorrect password" });
            return;
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret)
            throw new Error("JWT_SECRET not defined in environment variables");
        const _a = foundUser.toObject(), { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
        const token = jsonwebtoken_1.default.sign(userWithoutPassword, jwtSecret, { expiresIn: "1h" });
        console.log("token: ", token);
        res
            .cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000,
        })
            .status(200)
            .json({ message: "Login successful", user: userWithoutPassword });
    }
    catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.loginUser = loginUser;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword, userId } = req.body;
    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const user = yield user_model_2.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Incorrect current password" });
            return;
        }
        user.password = yield bcryptjs_1.default.hash(newPassword, 10);
        yield user.save();
        res.status(200).json({ message: "Password updated" });
    }
    catch (err) {
        console.error("Error updating password:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.changePassword = changePassword;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ success: false, message: "Email is required." });
        return;
    }
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: "Email not found." });
            return;
        }
        res.status(200).json({ success: true, message: "Email exists." });
    }
    catch (error) {
        console.error("verifyEmail error:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});
exports.verifyEmail = verifyEmail;
// import { Request, Response } from "express";
// import User from "../models/user.model";
// import bcrypt from "bcryptjs";
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ success: false, message: "Email and password are required." });
        return;
    }
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        user.password = hashedPassword;
        yield user.save();
        res.status(200).json({ success: true, message: "Password changed successfully." });
    }
    catch (error) {
        console.error("changePassword error:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});
exports.updatePassword = updatePassword;
const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({ success: true, message: "Logged out successfully." });
};
exports.logoutUser = logoutUser;
const checkCookie = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ success: false, message: "No token found" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ success: true, user: decoded });
    }
    catch (error) {
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
exports.checkCookie = checkCookie;
