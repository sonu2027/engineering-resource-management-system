"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    var _a;
    const token = ((_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || req.cookies.token;
    console.log("Token: ", token);
    if (!token) {
        res.status(403).json({ message: "Access Denied" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error("JWT Error:", err.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.verifyToken = verifyToken;
