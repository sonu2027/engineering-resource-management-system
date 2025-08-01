import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.middleware";
import { getMessagesWithUser, getUserConversations } from "../controllers/message.controller";

const messageRouter = Router();

messageRouter.post("/messages/conversations",verifyToken, getUserConversations);
messageRouter.post("/messages/user-messages",verifyToken, getMessagesWithUser);

export default messageRouter;