"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { api } from "@/lib/api";
import LeaderboardWidget from "@/components/LeaderboardWidget";

interface QuizSummary {
  _id: string;
  question: string;
  category: string;
  points: number;
}

export default function QuizzesPage() {
  const { token, loading } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [loading, token, router]);

  useEffect(() => {
    if (!token) return;

    api
      .get<QuizSummary[]>("/api/quizzes", token)
      .then(setQuizzes)
      .catch((err) => setError(err.message));
  }, [token]);

  if (!token) return null;

  return (
    <div className="layout">
      <div>
        <h1>ქუიზები</h1>
        {error && <p className="error">{error}</p>}
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <div className="card" key={quiz._id}>
              <span className="muted">{quiz.category}</span>
              <h3>{quiz.question}</h3>
              <p className="muted">{quiz.points} ქულა</p>
              <Link href={`/quizzes/${quiz._id}`}>
                <button>ვცადოთ →</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <aside>
        <LeaderboardWidget />
      </aside>
    </div>
  );
}
