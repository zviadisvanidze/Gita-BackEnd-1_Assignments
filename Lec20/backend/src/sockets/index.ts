import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { verifyToken, JwtPayload } from "../utils/jwt";
import User from "../modules/user/user.model";
import Quiz from "../modules/quiz/quiz.model";
import { getLeaderboard } from "../modules/leaderboard/leaderboard.service";

interface AuthenticatedSocket extends Socket {
  data: {
    user: JwtPayload;
  };
}

const onlineUsers = new Map<string, JwtPayload>();

function broadcastOnlineUsers(io: Server) {
  const users = Array.from(onlineUsers.values()).map((u) => ({ id: u.id, username: u.username }));
  io.emit("online-users:update", { count: users.length, users });
}

async function broadcastLeaderboard(io: Server) {
  const leaderboard = await getLeaderboard(10);
  io.emit("leaderboard:update", { leaderboard });
}

function initSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;

    if (!token) {
      return next(new Error("ავტორიზაცია სავალდებულოა"));
    }

    try {
      const payload = verifyToken(token);
      (socket as AuthenticatedSocket).data.user = payload;
      next();
    } catch (error) {
      next(new Error("ტოკენი არასწორია ან ვადაგასულია"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const authedSocket = socket as AuthenticatedSocket;
    const user = authedSocket.data.user;

    onlineUsers.set(socket.id, user);
    broadcastOnlineUsers(io);

    socket.on(
      "answer:submit",
      async (payload: { quizId: string; selectedOptionIndex: number }) => {
        try {
          const quiz = await Quiz.findById(payload.quizId);

          if (!quiz) {
            return socket.emit("answer:result", {
              quizId: payload.quizId,
              correct: false,
              correctOptionIndex: -1,
              pointsAwarded: 0,
              error: "ქუიზი ვერ მოიძებნა",
            });
          }

          const correct = quiz.correctOptionIndex === payload.selectedOptionIndex;
          const pointsAwarded = correct ? quiz.points : 0;

          if (correct) {
            await User.findByIdAndUpdate(user.id, { $inc: { score: quiz.points } });
          }

          socket.emit("answer:result", {
            quizId: payload.quizId,
            correct,
            correctOptionIndex: quiz.correctOptionIndex,
            pointsAwarded,
          });

          await broadcastLeaderboard(io);
        } catch (error) {
          console.error("შეცდომა პასუხის დამუშავებისას:", error);
          socket.emit("answer:result", {
            quizId: payload.quizId,
            correct: false,
            correctOptionIndex: -1,
            pointsAwarded: 0,
            error: "სერვერზე მოხდა შეცდომა",
          });
        }
      }
    );

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      broadcastOnlineUsers(io);
    });
  });

  return io;
}

export default initSocket;
