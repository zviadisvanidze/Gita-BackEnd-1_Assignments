import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import connectDB from "./config/db";
import initSocket from "./sockets";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import quizRoutes from "./modules/quiz/quiz.routes";
import leaderboardRoutes from "./modules/leaderboard/leaderboard.routes";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

initSocket(httpServer);

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`სერვერი ჩაირთო პორტზე: http://localhost:${PORT}`);
  });
});
