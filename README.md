# MIMIさん全曲紹介 フロントエンド

## 仕様技術
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [Cloudflare Workers](https://www.cloudflare.com/ja-jp/developer-platform/products/workers/)

など。ライセンスなどは [クレジット](public/docsFiles/credits.md) を参照してください。

## 開発のしかた
0. `yarn install`で必要なパッケージをインストール。
1. [バックエンド](https://github.com/takechi-scratch/songs_introduction_backend) でAPIサーバーを起動。
2. `yarn dev`で開発用サーバーを起動。

## デプロイ
1. `yarn preview`で、Cloudflare Workersのプレビューを確認。（やらないことも多い）
2. `yarn deploy`で、ビルド・デプロイ。

初期設定で必要なことなどは、[Cloudflare Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)のページを参照してください。

## クレジット
本当にありがとうございます。

https://mimi.takechi.f5.si/docs/credits
