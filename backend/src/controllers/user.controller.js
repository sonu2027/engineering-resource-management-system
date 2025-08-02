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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEngineerProfile = exports.getEngineerById = exports.getAlluser = exports.getAllEngineers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const getAllEngineers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const engineers = yield user_model_1.default.find({ role: "engineer" }).select("name email skills department seniority maxCapacity employmentType availableCapacity");
        res.status(200).json({ engineers });
    }
    catch (err) {
        console.error("Failed to fetch engineers:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getAllEngineers = getAllEngineers;
const getAlluser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find().select("_id name email");
        res.status(200).json({ users });
    }
    catch (err) {
        console.error("Failed to fetch users:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getAlluser = getAlluser;
const getEngineerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hello");
    const { userId } = req.params;
    console.log("id: ", userId);
    try {
        const user = yield user_model_1.default.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        console.error("Error fetching engineer:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getEngineerById = getEngineerById;
const updateEngineerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ message: "User ID missing in route" });
            return;
        }
        const { name, department, skills } = req.body;
        let updatedUser;
        if (department) {
            updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, { name, department, skills }, { new: true, runValidators: true }).select("-password");
        }
        else {
            updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, { name }, { new: true, runValidators: true }).select("-password");
        }
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(updatedUser);
    }
    catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateEngineerProfile = updateEngineerProfile;
