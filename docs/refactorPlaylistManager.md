# 再生リスト管理

[createPlaylist](../src/lib/youtube.ts) は直接的なリクエストの部分。タイトル・説明も入れられる。
[usePlaylistManager](../src/hooks/songs.ts) でいろいろやってほしい。
引数: 曲（songs, songsWithScore, nullのリスト）
返す関数: 再生リストの作成
検索条件から説明を自動生成して再生リスト作成っていうのも関数として作る！！
loadingはこっちのstateとして持っておく。
