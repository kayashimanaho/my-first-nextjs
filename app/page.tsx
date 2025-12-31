"use client"; // ← クライアントコンポーネントにする宣言

import { useState, useEffect } from "react"; // ← useEffectを追加！
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // ★ 追加
import { Button } from "@/components/ui/button";

// 名言の型を定義（TypeScriptの機能）
type Quote = {
  text: string;
  author: string;
};

export default function Home() {
  const [count, setCount] = useState(0);
  const [quote, setQuote] = useState<Quote | null>(null); // ★ 名言を保存
  const [loading, setLoading] = useState(false); // ★ 読み込み中かどうか

  

  // ★ Supabaseからカウントを読み込む
  useEffect(() => {
    const fetchCount = async () => {
      const { data, error } = await supabase
        .from("clicks")
        .select("count")
        .eq("id", 1)
        .single();

      if (data) {
        setCount(data.count);
      } else if (error?.code === "PGRST116") {
        // レコードがなければ作成
        await supabase.from("clicks").insert({ id: 1, count: 0 });
      }
    };
    fetchCount();
  }, []);

  // ★ カウントが変わったらSupabaseに保存
  const updateCount = async (newCount: number) => {
    setCount(newCount);
    await supabase
      .from("clicks")
      .update({ count: newCount })
      .eq("id", 1);
  };

  // ★ APIから名言を取得する関数
  const fetchQuote = async () => {
    setLoading(true); // 読み込み開始
    try {
      const response = await fetch("/api/quote"); // APIを呼び出し
      const data = await response.json(); // JSONをパース
      setQuote(data); // 状態を更新
    } catch (error) {
      console.error("エラー:", error);
    } finally {
      setLoading(false); // 読み込み終了
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <nav className="mb-8 flex gap-4 justify-center">
          <Link
            href="/about"
            className="text-blue-400 hover:text-blue-300 underline transition"
          >
            About →
          </Link>
          <Link
            href="/todo"
            className="text-green-400 hover:text-green-300 underline transition"
          >
            ToDo →
          </Link>
          <Link
            href="/login"
            className="text-yellow-400 hover:text-yellow-300 underline transition"
          >
            ログイン
          </Link>
        </nav>

        <h1 className="text-4xl font-bold text-white mb-4">
          Hello, Next.js! 🚀
        </h1>

        <p className="text-gray-400 text-lg mb-8">
          私の最初のReactアプリケーション
        </p>

        <div className="bg-zinc-900 rounded-2xl p-8 mb-6">
          <p className="text-6xl font-bold text-white mb-4">{count}</p>
          <p className="text-gray-500">クリック数（Supabaseに保存）</p>
        </div>

        <div className="flex gap-4 justify-center mb-8">
          {/* -1 ボタン */}
          <button
            onClick={() => updateCount(count - 1)}
            className="
              bg-gradient-to-b from-red-500 to-red-700
              hover:from-red-400 hover:to-red-600
              active:from-red-600 active:to-red-800
              text-white font-bold py-3 px-6 rounded-full
              shadow-lg shadow-red-500/30
              hover:shadow-xl hover:shadow-red-500/40
              hover:-translate-y-0.5
              active:translate-y-0 active:scale-95
              transition-all duration-200
            "
          >
            -1 減らす
          </button>

          {/* +1 ボタン */}
          <Button
            onClick={() => updateCount(count + 1)}
            variant="default"
            size="lg"
          >
            +1 増やす
          </Button>

          {/* リセットボタン */}
          <button
            onClick={() => updateCount(0)}
            className="
              bg-gradient-to-b from-zinc-600 to-zinc-800
              hover:from-zinc-500 hover:to-zinc-700
              active:from-zinc-700 active:to-zinc-900
              text-white font-bold py-3 px-6 rounded-full
              shadow-lg shadow-zinc-500/20
              hover:shadow-xl hover:shadow-zinc-500/30
              hover:-translate-y-0.5
              active:translate-y-0 active:scale-95
              transition-all duration-200
            "
          >
            リセット
          </button>
        </div>

        {/* 名言セクション */}
        <div className="bg-zinc-900 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">💡 今日の名言</h2>
          
          {quote ? (
            <div className="mb-4">
              <p className="text-lg text-gray-300 italic mb-2">"{quote.text}"</p>
              <p className="text-gray-500">— {quote.author}</p>
            </div>
          ) : (
            <p className="text-gray-500 mb-4">ボタンを押して名言を取得しよう！</p>
          )}

          {/* 名言取得ボタン */}
          <button
            onClick={fetchQuote}
            disabled={loading}
            className="
              bg-gradient-to-b from-green-500 to-green-700
              hover:from-green-400 hover:to-green-600
              active:from-green-600 active:to-green-800
              disabled:from-gray-500 disabled:to-gray-700
              text-white font-bold py-3 px-6 rounded-full
              shadow-lg shadow-green-500/30
              hover:shadow-xl hover:shadow-green-500/40
              disabled:shadow-none
              hover:-translate-y-0.5
              active:translate-y-0 active:scale-95
              disabled:translate-y-0 disabled:scale-100
              transition-all duration-200
            "
          >
            {loading ? "読み込み中..." : "🎲 名言を取得"}
          </button>
        </div>
      </div>
    </div>
  );
}
