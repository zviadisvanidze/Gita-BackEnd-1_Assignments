"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import LeaderboardWidget from "@/components/LeaderboardWidget";

export default function LeaderboardPage() {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [loading, token, router]);

  if (!token) return null;

  return (
    <div className="page">
      <h1>ლიდერბორდი</h1>
      <p className="muted">ცოცხლდება რეალურ დროში Socket.IO-ს მეშვეობით.</p>
      <LeaderboardWidget limit={20} title="ტოპ 20" />
    </div>
  );
}
