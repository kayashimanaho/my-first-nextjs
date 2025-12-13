import Link from "next/link"; // ← Next.jsのリンクコンポーネント

export default function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        {/* 見出し */}
        <h1 className="text-4xl font-bold text-white mb-4">
          About Me 👋
        </h1>

        {/* 自己紹介 */}
        <p className="text-gray-400 text-lg mb-8 max-w-md">
          Next.jsを学んでいるエンジニアです。
          <br />
          このアプリは学習のために作りました。
        </p>

        {/* スキルカード */}
        <div className="bg-zinc-900 rounded-2xl p-8 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">🛠️ 学習中のスキル</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-full">Next.js</span>
            <span className="bg-cyan-600 text-white px-4 py-2 rounded-full">React</span>
            <span className="bg-blue-500 text-white px-4 py-2 rounded-full">TypeScript</span>
            <span className="bg-teal-600 text-white px-4 py-2 rounded-full">Tailwind CSS</span>
          </div>
        </div>

        {/* ホームに戻るリンク */}
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 underline transition"
        >
          ← ホームに戻る
        </Link>
      </div>
    </div>
  );
}
