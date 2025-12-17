"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// ToDoの型定義
type Todo = {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
};

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);

  // ★ ToDoを取得（Read）
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setTodos(data);
    }
    setLoading(false);
  };

  // ページ読み込み時にToDoを取得
  useEffect(() => {
    fetchTodos();
  }, []);

  // ★ ToDoを追加（Create）
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault(); // ページリロードを防ぐ
    if (!newTodo.trim()) return; // 空文字は無視

    const { error } = await supabase
      .from("todos")
      .insert({ text: newTodo, completed: false });

    if (!error) {
      setNewTodo(""); // 入力欄をクリア
      fetchTodos(); // リストを更新
    }
  };

  // ★ 完了状態を切り替え（Update）
  const toggleTodo = async (id: number, completed: boolean) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !completed })
      .eq("id", id);

    if (!error) {
      fetchTodos(); // リストを更新
    }
  };

  // ★ ToDoを削除（Delete）
  const deleteTodo = async (id: number) => {
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchTodos(); // リストを更新
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* ナビゲーション */}
        <nav className="mb-8 text-center">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 underline transition"
          >
            ← ホームに戻る
          </Link>
        </nav>

        {/* タイトル */}
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          📝 ToDoリスト
        </h1>

        {/* 入力フォーム */}
        <form onSubmit={addTodo} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="新しいタスクを入力..."
              className="
                flex-1 bg-zinc-900 text-white
                px-4 py-3 rounded-xl
                border border-zinc-700
                focus:border-blue-500 focus:outline-none
                transition
              "
            />
            <button
              type="submit"
              className="
                bg-gradient-to-b from-blue-500 to-blue-700
                hover:from-blue-400 hover:to-blue-600
                active:scale-95
                text-white font-bold px-6 py-3 rounded-xl
                shadow-lg shadow-blue-500/30
                transition-all duration-200
              "
            >
              追加
            </button>
          </div>
        </form>

        {/* ローディング表示 */}
        {loading ? (
          <p className="text-gray-500 text-center">読み込み中...</p>
        ) : todos.length === 0 ? (
          <p className="text-gray-500 text-center">
            タスクがありません。追加してみましょう！
          </p>
        ) : (
          /* ToDoリスト */
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="
                  bg-zinc-900 rounded-xl p-4
                  flex items-center gap-3
                  group
                "
              >
                {/* チェックボックス */}
                <button
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  className={`
                    w-6 h-6 rounded-full border-2
                    flex items-center justify-center
                    transition-all duration-200
                    ${
                      todo.completed
                        ? "bg-green-500 border-green-500"
                        : "border-zinc-600 hover:border-green-500"
                    }
                  `}
                >
                  {todo.completed && (
                    <span className="text-white text-sm">✓</span>
                  )}
                </button>

                {/* タスクテキスト */}
                <span
                  className={`
                    flex-1 transition-all duration-200
                    ${
                      todo.completed
                        ? "text-gray-500 line-through"
                        : "text-white"
                    }
                  `}
                >
                  {todo.text}
                </span>

                {/* 削除ボタン */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="
                    text-gray-500 hover:text-red-500
                    opacity-0 group-hover:opacity-100
                    transition-all duration-200
                  "
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* 統計 */}
        {todos.length > 0 && (
          <div className="mt-6 text-center text-gray-500 text-sm">
            {todos.filter((t) => t.completed).length} / {todos.length} 完了
          </div>
        )}
      </div>
    </div>
  );
}