"use client"; // ← クライアントコンポーネントにする宣言

import { useState } from "react"; // ← Reactの状態管理機能をインポート
import Link from "next/link"; // ← ★ この行を追加！

export default function Home() {
  // useState: 状態（変わる値）を管理する
  // count = 現在の値
  // setCount = 値を更新する関数
  // useState(0) = 初期値は0
  const [count, setCount] = useState(0);

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
        {/* 見出し */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Hello, Next.js! 🚀
        </h1>

        {/* 説明文 */}
        <p className="text-gray-400 text-lg mb-8">
          私の最初のReactアプリケーション
        </p>

        {/* カウンター表示 */}
        <div className="bg-zinc-900 rounded-2xl p-8 mb-6">
          <p className="text-6xl font-bold text-white mb-4">{count}</p>
          <p className="text-gray-500">クリック数</p>
        </div>

        {/* ボタン */}
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
