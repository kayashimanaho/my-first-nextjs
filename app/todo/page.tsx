"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
  user_id: string;
};

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // ★ ユーザー認証状態をチェック
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // ログインしていなければログインページへ
        router.push("/login");
        return;
      }
      
      setUser(user);
      fetchTodos(user.id);
    };

    checkUser();
  }, [router]);

  // ★ 自分のToDoだけ取得
  const fetchTodos = async (userId: string) => {
    const { data } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)  // 自分のToDoだけ！
      .order("created_at", { ascending: false });

    if (data) {
      setTodos(data);
    }
    setLoading(false);
  };

  // ★ ToDoを追加（user_id付き）
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !user) return;

    await supabase.from("todos").insert({
      text: newTodo,
      completed: false,
      user_id: user.id,  // 自分のIDを保存！
    });

    setNewTodo("");
    fetchTodos(user.id);
  };

  // 完了状態を切り替え
  const toggleTodo = async (id: number, completed: boolean) => {
    await supabase
      .from("todos")
      .update({ completed: !completed })
      .eq("id", id);

    if (user) fetchTodos(user.id);
  };

  // ToDoを削除
  const deleteTodo = async (id: number) => {
    await supabase.from("todos").delete().eq("id", id);
    if (user) fetchTodos(user.id);
  };

  // ★ ログアウト
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // ログインチェック中
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 underline transition"
          >
            ← ホーム
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 text-sm underline"
            >
              ログアウト
            </button>
          </div>
        </div>

        {/* タイトル */}
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-white">📝 ToDoリスト</CardTitle>
            </CardHeader>
            <CardContent>
                {/* 入力フォーム */}
                <form onSubmit={addTodo} className="mb-6">
                <div className="flex gap-2">
                    <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="新しいタスクを入力..."
                    className="
                        flex-1 bg-zinc-800 text-white
                        px-4 py-3 rounded-xl
                        border border-zinc-700
                        focus:border-blue-500 focus:outline-none
                        transition
                    "
                    />
                    <Button type="submit">
                    追加
                    </Button>
                </div>
                </form>

                {/* ここにToDoリストを表示 */}
            </CardContent>
            </Card>

        {/* ToDoリスト */}
        {loading ? (
          <p className="text-gray-500 text-center">読み込み中...</p>
        ) : todos.length === 0 ? (
          <p className="text-gray-500 text-center">
            タスクがありません。追加してみましょう！
          </p>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="bg-zinc-900 rounded-xl p-4 flex items-center gap-3 group"
              >
                <button
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                    ${todo.completed ? "bg-green-500 border-green-500" : "border-zinc-600 hover:border-green-500"}
                  `}
                >
                  {todo.completed && <span className="text-white text-sm">✓</span>}
                </button>

                <span className={`flex-1 ${todo.completed ? "text-gray-500 line-through" : "text-white"}`}>
                  {todo.text}
                </span>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}

        {todos.length > 0 && (
          <div className="mt-6 text-center text-gray-500 text-sm">
            {todos.filter((t) => t.completed).length} / {todos.length} 完了
          </div>
        )}
      </div>
    </div>
  );
}