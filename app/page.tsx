"use client"; // ← クライアントコンポーネントにする宣言

import { useState, useEffect } from "react"; // ← useEffectを追加！
import Link from "next/link";

export default function Home() {
  const [count, setCount] = useState(0);

  // ページ読み込み時にlocalStorageから値を取得
  useEffect(() => {
    const savedCount = localStorage.getItem("count");
    if (savedCount !== null) {
      setCount(Number(savedCount)); // 文字列→数値に変換
    }
  }, []); // ← 空の配列 = 最初の1回だけ実行

  // countが変わるたびにlocalStorageに保存
  useEffect(() => {
    localStorage.setItem("count", String(count)); // 数値→文字列に変換
  }, [count]); // ← countが変わったら実行

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <nav className="mb-8">
          <Link
            href="/about"
            className="text-blue-400 hover:text-blue-300 underline transition"
          >
            About →
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
          <p className="text-gray-500">クリック数</p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setCount(count - 1)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition"
          >
            -1 減らす
          </button>
          <button
            onClick={() => setCount(count + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition"
          >
            +1 増やす
          </button>
          <button
            onClick={() => setCount(0)}
            className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 px-6 rounded-full transition"
          >
            リセット
          </button>
        </div>
      </div>
    </div>
  );
}
