import express from "express";
import chatRoutes from "./routes/chat.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import searchRoutes from "./routes/search.routes.js";


const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("AI Search Assistant Backend is running!");
});

app.use("/chats", chatRoutes);
app.use(errorMiddleware);
app.use("/search", searchRoutes);

export default app;