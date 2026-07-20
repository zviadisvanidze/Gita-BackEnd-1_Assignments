"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { api, ApiError } from "@/lib/api";

interface UserRow {
  _id: string;
  username: string;
  email: string;
  score: number;
}

export default function UsersPage() {
  const { token, loading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ username: string; email: string; score: number }>({
    username: "",
    email: "",
    score: 0,
  });

  const [newUser, setNewUser] = useState({ username: "", email: "", password: "" });

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [loading, token, router]);

  function loadUsers() {
    if (!token) return;
    api
      .get<UserRow[]>("/api/users", token)
      .then(setUsers)
      .catch((err) => setError(err.message));
  }

  useEffect(loadUsers, [token]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError(null);

    try {
      await api.post("/api/users", newUser, token);
      setNewUser({ username: "", email: "", password: "" });
      loadUsers();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "დამატება ვერ მოხერხდა");
    }
  }

  function startEdit(user: UserRow) {
    setEditingId(user._id);
    setEditDraft({ username: user.username, email: user.email, score: user.score });
  }

  async function saveEdit(id: string) {
    if (!token) return;
    setError(null);

    try {
      await api.put(`/api/users/${id}`, editDraft, token);
      setEditingId(null);
      loadUsers();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "განახლება ვერ მოხერხდა");
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;
    setError(null);

    try {
      await api.delete(`/api/users/${id}`, token);
      loadUsers();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "წაშლა ვერ მოხერხდა");
    }
  }

  if (!token) return null;

  return (
    <div className="page">
      <h1>იუზერები</h1>
      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3>ახალი იუზერის დამატება</h3>
        <form onSubmit={handleCreate}>
          <input
            placeholder="სახელი"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="ელფოსტა"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="პაროლი"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
          <button type="submit">დამატება</button>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>სახელი</th>
            <th>ელფოსტა</th>
            <th>ქულა</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              {editingId === user._id ? (
                <>
                  <td>
                    <input
                      value={editDraft.username}
                      onChange={(e) => setEditDraft({ ...editDraft, username: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      value={editDraft.email}
                      onChange={(e) => setEditDraft({ ...editDraft, email: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editDraft.score}
                      onChange={(e) => setEditDraft({ ...editDraft, score: Number(e.target.value) })}
                    />
                  </td>
                  <td className="table-actions">
                    <button onClick={() => saveEdit(user._id)}>შენახვა</button>
                    <button onClick={() => setEditingId(null)}>გაუქმება</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.score}</td>
                  <td className="table-actions">
                    <button onClick={() => startEdit(user)}>რედაქტირება</button>
                    <button onClick={() => handleDelete(user._id)}>წაშლა</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
