"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { ApiError } from "@/lib/api";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await register(username, email, password);
      router.push("/quizzes");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "რეგისტრაცია ვერ მოხერხდა");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>რეგისტრაცია</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="სახელი"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="ელფოსტა"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="პაროლი"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? "იტვირთება..." : "რეგისტრაცია"}
          </button>
        </form>
        <p className="muted">
          უკვე გაქვს ანგარიში? <Link href="/login">შესვლა</Link>
        </p>
      </div>
    </div>
  );
}
