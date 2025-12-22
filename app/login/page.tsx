"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // ログイン or 登録
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isLogin) {
      // ログイン
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage("ログインに失敗しました: " + error.message);
      } else {
        router.push("/todo"); // ToDoページへ
      }
    } else {
      // 新規登録
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage("登録に失敗しました: " + error.message);
      } else {
        setMessage("確認メールを送信しました！メールを確認してください。");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* ホームへ戻るリンク */}
        <nav className="mb-8 text-center">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 underline transition"
          >
            ← ホームに戻る
          </Link>
        </nav>

        {/* カード */}
        <div className="bg-zinc-900 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            {isLogin ? "🔐 ログイン" : "✨ 新規登録"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* メールアドレス */}
            <div>
              <label className="text-gray-400 text-sm block mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  w-full bg-zinc-800 text-white
                  px-4 py-3 rounded-xl
                  border border-zinc-700
                  focus:border-blue-500 focus:outline-none
                  transition
                "
                placeholder="example@email.com"
              />
            </div>

            {/* パスワード */}
            <div>
              <label className="text-gray-400 text-sm block mb-1">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="
                  w-full bg-zinc-800 text-white
                  px-4 py-3 rounded-xl
                  border border-zinc-700
                  focus:border-blue-500 focus:outline-none
                  transition
                "
                placeholder="6文字以上"
              />
            </div>

            {/* メッセージ */}
            {message && (
              <p className={`text-sm ${message.includes("失敗") ? "text-red-400" : "text-green-400"}`}>
                {message}
              </p>
            )}

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-gradient-to-b from-blue-500 to-blue-700
                hover:from-blue-400 hover:to-blue-600
                active:scale-95
                disabled:from-gray-500 disabled:to-gray-700
                text-white font-bold py-3 px-6 rounded-xl
                shadow-lg shadow-blue-500/30
                transition-all duration-200
              "
            >
              {loading ? "処理中..." : isLogin ? "ログイン" : "登録"}
            </button>
          </form>

          {/* 切り替えリンク */}
          <p className="text-gray-500 text-sm text-center mt-6">
            {isLogin ? "アカウントをお持ちでない方は" : "すでにアカウントをお持ちの方は"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 underline ml-1"
            >
              {isLogin ? "新規登録" : "ログイン"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}