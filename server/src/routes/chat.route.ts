import { Router } from "express";

import {
    createChat,
    getChat,
    deleteChat,
    addMessage
} from "../controllers/chat.controller.js";

const router = Router();

router.post("/", createChat);

router.get("/:chatId", getChat);

router.delete("/:chatId", deleteChat);

router.post("/:chatId/messages", addMessage);

export default router;