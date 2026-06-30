import { Router } from "express";
import { crawl } from "../controllers/crawler.controller.js";

const router = Router();

router.post("/", crawl);

export default router;