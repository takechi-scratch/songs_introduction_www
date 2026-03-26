"use client";

import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white">
            {/* ===== Hero Section ===== */}
            <section className="text-center px-6 py-24">
                <h1 className="text-5xl font-bold mb-6">MIMIさんの全曲を、まとめて。</h1>
                <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
                    すべての楽曲を一覧・検索・再生。 あなたのお気に入りの1曲を見つけよう。
                </p>
                <p className="text-lg text-gray-300 mb-10 mx-auto">
                    ※このページはテスト用として生成AIによって作成されました。
                </p>

                <div className="flex justify-center gap-4 flex-wrap">
                    <Link
                        href="/songs"
                        className="bg-pink-500 hover:bg-pink-600 px-8 py-3 rounded-full text-lg font-semibold transition"
                    >
                        全曲を見る
                    </Link>

                    <Link
                        href="/playlist"
                        className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full text-lg font-semibold transition"
                    >
                        再生リストへ
                    </Link>

                    <Link
                        href="/random"
                        className="border border-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-black transition"
                    >
                        ランダム再生
                    </Link>
                </div>
            </section>

            {/* ===== Popular Songs ===== */}
            <section className="px-6 py-16 bg-black/30 backdrop-blur">
                <h2 className="text-3xl font-bold text-center mb-10">人気曲ピックアップ</h2>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        { title: "春を待つ", url: "https://youtu.be/xxxxx" },
                        { title: "花に風", url: "https://youtu.be/yyyyy" },
                        { title: "君の夜をくれ", url: "https://youtu.be/zzzzz" },
                    ].map((song, i) => (
                        <a
                            key={i}
                            href={song.url}
                            target="_blank"
                            className="bg-white/10 rounded-2xl p-6 hover:bg-white/20 transition shadow-lg"
                        >
                            <div className="h-40 bg-gray-700 rounded-xl mb-4"></div>
                            <h3 className="text-xl font-semibold">{song.title}</h3>
                            <p className="text-sm text-gray-400 mt-2">YouTubeで再生 →</p>
                        </a>
                    ))}
                </div>
            </section>

            {/* ===== Features ===== */}
            <section className="px-6 py-20 text-center">
                <h2 className="text-3xl font-bold mb-10">このサイトでできること</h2>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
                    <div className="bg-white/5 p-6 rounded-2xl">
                        <h3 className="text-xl font-semibold mb-3">🔎 曲を検索</h3>
                        <p className="text-gray-400">タイトル・タグ・ボーカルで絞り込み可能。</p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl">
                        <h3 className="text-xl font-semibold mb-3">🎵 似ている曲を探す</h3>
                        <p className="text-gray-400">類似度ベースで新しい発見を。</p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl">
                        <h3 className="text-xl font-semibold mb-3">▶ サビだけ再生</h3>
                        <p className="text-gray-400">印象的な部分だけ連続再生。</p>
                    </div>
                </div>
            </section>

            {/* ===== Footer ===== */}
            <footer className="text-center text-gray-500 py-10 border-t border-white/10">
                <p>© 2026 MIMI Songs Introduction</p>
                <p className="mt-2">非公式ファンサイト</p>
            </footer>
        </main>
    );
}
