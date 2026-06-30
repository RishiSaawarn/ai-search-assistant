import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import searchRoutes from "./routes/search.routes.js";
import crawlerRoutes from "./routes/crawler.routes.js"


const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("AI Search Assistant Backend is running!");
});

app.use("/chats", chatRoutes);
app.use("/search", searchRoutes);
app.use("/crawl", crawlerRoutes);

// Error middleware must come last — after all routes
app.use(errorMiddleware);

export default app;