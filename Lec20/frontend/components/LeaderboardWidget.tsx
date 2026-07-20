"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";

interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
}

export default function LeaderboardWidget({ limit = 10, title = "ლიდერბორდი" }: { limit?: number; title?: string }) {
  const { token } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (!token) return;

    api
      .get<{ leaderboard: LeaderboardEntry[] }>(`/api/leaderboard?limit=${limit}`, token)
      .then((res) => setLeaderboard(res.leaderboard))
      .catch(() => {});

    const socket = getSocket(token);

    function handleUpdate(payload: { leaderboard: LeaderboardEntry[] }) {
      setLeaderboard(payload.leaderboard.slice(0, limit));
    }

    socket.on("leaderboard:update", handleUpdate);

    return () => {
      socket.off("leaderboard:update", handleUpdate);
    };
  }, [token, limit]);

  if (!token) return null;

  return (
    <div className="leaderboard-widget">
      <h3>{title}</h3>
      {leaderboard.length === 0 ? (
        <p className="muted">ლიდერბორდი ჯერ ცარიელია</p>
      ) : (
        <ol>
          {leaderboard.map((entry) => (
            <li key={entry.userId}>
              <span>{entry.username}</span>
              <span className="score">{entry.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
