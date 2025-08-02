"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_middleware_1 = require("../middleware/verifyToken.middleware");
const message_controller_1 = require("../controllers/message.controller");
const messageRouter = (0, express_1.Router)();
messageRouter.post("/messages/conversations", verifyToken_middleware_1.verifyToken, message_controller_1.getUserConversations);
messageRouter.post("/messages/user-messages", verifyToken_middleware_1.verifyToken, message_controller_1.getMessagesWithUser);
exports.default = messageRouter;
