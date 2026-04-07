# TERAKOYA

TERAKOYA は、公開 Google スプレッドシートをもとに日本語学習向けの印刷用ワークシートを作る Web アプリです。  
問題をカテゴリや直近結果で絞り込み、最大 20 問をランダムに選んで、A4 で印刷できるプリントを生成します。

## 主な機能

- Google スプレッドシートから問題データを読み込む
- カテゴリと直近結果で出題候補を絞り込む
- 最大 20 問をランダムに選ぶ
- 読み / 書きモードを切り替える
- 答えを「なし / 表 / 裏 / QR コード」で出し分ける
- タイトル、日付、名前、点数欄の表示を切り替える

## 開発

```bash
npm install
npm run dev
```

利用できる主なコマンド:

- `npm run dev` - 開発サーバーを起動
- `npm run build` - TypeScript ビルドと本番ビルドを実行
- `npm run lint` - ESLint を実行
- `npm run test -- --run` - テストを 1 回実行
- `npm run preview` - ビルド済み成果物をローカル確認

## データ形式

Google スプレッドシートの各行は、次の列順で読み込みます。

1. `id`
2. `question`
3. `answer`
4. `category`
5. `lastDate`
6. `results`

メモ:

- `question` が空の行は無視されます
- 1 列目が `#` で始まる行はコメント行として無視されます
- `results` では `o` を正解、それ以外を不正解として扱います

問題文では次のような記法が使えます。

- ルビ: `((漢字::かんじ))`
- 穴埋め: `[[漢字]]`
- ヒント付き穴埋め: `[[漢字::よみ]]`

## ドキュメント

- 仕様: [docs/SPEC.md](docs/SPEC.md)
- 既知の問題: [docs/known-issues.md](docs/known-issues.md)
