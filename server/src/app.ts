import express from "express";
import chatRoutes from "./routes/chat.route.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("AI Search Assistant Backend is running!");
});

app.use("/chat", chatRoutes);

export default app;