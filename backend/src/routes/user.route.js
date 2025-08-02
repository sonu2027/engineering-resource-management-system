"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const verifyToken_middleware_1 = require("../middleware/verifyToken.middleware");
const userRouter = express_1.default.Router();
userRouter.get("/engineers", verifyToken_middleware_1.verifyToken, user_controller_1.getAllEngineers);
userRouter.get("/engineer/profile/:userId", verifyToken_middleware_1.verifyToken, user_controller_1.getEngineerById);
userRouter.put("/engineer/updateprofile/:userId", verifyToken_middleware_1.verifyToken, user_controller_1.updateEngineerProfile);
userRouter.get("/users", verifyToken_middleware_1.verifyToken, user_controller_1.getAlluser);
exports.default = userRouter;
