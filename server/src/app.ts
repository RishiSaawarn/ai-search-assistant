import express from "express";
import chatRoutes from "./routes/chat.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("AI Search Assistant Backend is running!");
});

app.use("/chats", chatRoutes);
app.use(errorMiddleware);

export default app;