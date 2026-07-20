"use client";

import Link from "next/link";
import { useAuth } from "@/lib/authContext";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="page">
      <div className="card">
        <h1>რეალურ დროში ქუიზი</h1>
        <p className="muted">
          უპასუხე ქუიზებს, დააგროვე ქულები და ნახე ლიდერბორდი, რომელიც Socket.IO-ს მეშვეობით
          ცოცხალ რეჟიმში განახლდება ყველა შესულ მომხმარებელთან ერთად.
        </p>

        {user ? (
          <p>
            გამარჯობა, <strong>{user.username}</strong>! <Link href="/quizzes">დაიწყე ქუიზი →</Link>
          </p>
        ) : (
          <p>
            <Link href="/login">შესვლა</Link> ან <Link href="/register">რეგისტრაცია</Link>, რომ დაიწყო თამაში.
          </p>
        )}
      </div>
    </div>
  );
}
