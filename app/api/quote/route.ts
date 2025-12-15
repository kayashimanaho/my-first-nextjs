// Next.jsのAPIルート（サーバーサイドで実行される）

import { NextResponse } from "next/server";

// 名言のデータ（実際はデータベースから取得することが多い）
const quotes = [
  { text: "シンプルであることは、複雑であることよりも難しい。", author: "スティーブ・ジョブズ" },
  { text: "失敗は成功のもと。", author: "日本のことわざ" },
  { text: "千里の道も一歩から。", author: "老子" },
  { text: "継続は力なり。", author: "日本のことわざ" },
  { text: "Done is better than perfect.", author: "マーク・ザッカーバーグ" },
  { text: "Stay hungry, stay foolish.", author: "スティーブ・ジョブズ" },
  { text: "コードは書くより読む時間のほうが長い。", author: "ロバート・C・マーティン" },
];

// GET リクエストを処理する関数
export async function GET() {
  // ランダムに1つ選ぶ
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // JSONで返す
  return NextResponse.json(quote);
}