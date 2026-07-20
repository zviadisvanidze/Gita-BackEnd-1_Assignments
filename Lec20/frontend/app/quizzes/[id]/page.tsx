"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";

interface QuizDetail {
  _id: string;
  question: string;
  options: string[];
  category: string;
  points: number;
}

interface AnswerResult {
  quizId: string;
  correct: boolean;
  correctOptionIndex: number;
  pointsAwarded: number;
  error?: string;
}

export default function QuizPlayPage() {
  const { id } = useParams<{ id: string }>();
  const { token, loading } = useAuth();
  const router = useRouter();

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [loading, token, router]);

  useEffect(() => {
    if (!token || !id) return;

    api
      .get<QuizDetail>(`/api/quizzes/${id}`, token)
      .then(setQuiz)
      .catch((err) => setError(err.message));
  }, [token, id]);

  useEffect(() => {
    if (!token) return;

    const socket = getSocket(token);

    function handleResult(payload: AnswerResult) {
      if (payload.quizId === id) {
        setResult(payload);
      }
    }

    socket.on("answer:result", handleResult);

    return () => {
      socket.off("answer:result", handleResult);
    };
  }, [token, id]);

  function submitAnswer(optionIndex: number) {
    if (!token || !id || result) return;

    setSelected(optionIndex);
    const socket = getSocket(token);
    socket.emit("answer:submit", { quizId: id, selectedOptionIndex: optionIndex });
  }

  if (!token) return null;
  if (error) return <div className="page error">{error}</div>;
  if (!quiz) return <div className="page">იტვირთება...</div>;

  return (
    <div className="page">
      <p className="muted">{quiz.category}</p>
      <h1>{quiz.question}</h1>

      <div className="quiz-options">
        {quiz.options.map((option, index) => {
          let className = "";
          if (result) {
            if (index === result.correctOptionIndex) className = "correct";
            else if (index === selected) className = "incorrect";
          } else if (index === selected) {
            className = "selected";
          }

          return (
            <button key={index} className={className} onClick={() => submitAnswer(index)} disabled={!!result}>
              {option}
            </button>
          );
        })}
      </div>

      {result && (
        <div className="card">
          {result.correct ? (
            <p>✅ სწორია! მიიღე {result.pointsAwarded} ქულა.</p>
          ) : (
            <p>❌ არასწორია.</p>
          )}
          <Link href="/quizzes">
            <button>დანარჩენი ქუიზები →</button>
          </Link>
        </div>
      )}
    </div>
  );
}
