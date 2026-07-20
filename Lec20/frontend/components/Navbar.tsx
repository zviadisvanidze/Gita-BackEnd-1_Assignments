"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import OnlineUsers from "./OnlineUsers";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href="/">🧠 ქუიზი</Link>
      </div>

      <div className="navbar-links">
        {user && (
          <>
            <Link href="/quizzes">ქუიზები</Link>
            <Link href="/leaderboard">ლიდერბორდი</Link>
            <Link href="/users">იუზერები</Link>
          </>
        )}
      </div>

      <div className="navbar-actions">
        <OnlineUsers />
        {user ? (
          <>
            <span className="muted">{user.username}</span>
            <button onClick={handleLogout}>გასვლა</button>
          </>
        ) : (
          <>
            <Link href="/login">შესვლა</Link>
            <Link href="/register">რეგისტრაცია</Link>
          </>
        )}
      </div>
    </nav>
  );
}
