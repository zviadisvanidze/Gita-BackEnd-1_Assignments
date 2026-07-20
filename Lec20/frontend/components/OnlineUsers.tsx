"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { getSocket } from "@/lib/socket";

interface OnlineUser {
  id: string;
  username: string;
}

export default function OnlineUsers() {
  const { token } = useAuth();
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!token) return;

    const socket = getSocket(token);

    function handleUpdate(payload: { count: number; users: OnlineUser[] }) {
      setCount(payload.count);
      setUsers(payload.users);
    }

    socket.on("online-users:update", handleUpdate);

    return () => {
      socket.off("online-users:update", handleUpdate);
    };
  }, [token]);

  if (!token) return null;

  return (
    <div className="online-users" title={users.map((u) => u.username).join(", ")}>
      <span className="dot" />
      ონლაინ: {count}
    </div>
  );
}
