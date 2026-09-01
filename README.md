# Salon Sprache

海外で働く日本人美容師のための、接客シーン別 **ドイツ語・英語フレーズ帳**（PWA）。

**公開URL: https://shingomori029-lab.github.io/salon-sprache/**

- 12シーン・135フレーズ（受付／カウンセリング／髪の診断／カット／カラー／パーマ／シャンプー／仕上げ／ホームケア／会計／雑談／聞き返し）
- 全ドイツ語フレーズに **カタカナ読み** つき
- 端末内蔵の音声合成で **発音再生**（速度調整あり）
- **単語帳** 75語（名詞は der / die / das つき）
- **4択クイズ**（シーン別に出題範囲を絞れる）
- **お気に入り**（明日使う分だけ集めておける）
- **隠して練習**モード（日本語だけ見て外国語を思い出す）
- **学習記録**（2回連続正解で「習得」。シーンごとの習熟度を表示）
- **復習モード**（「苦手だけ」で、間違えたフレーズだけを再出題）
- **オフライン対応**。ホーム画面に追加すればアプリのように使えます

表示言語は「ドイツ語 / 英語 / 両方」で切り替えます。クイズは選択中の言語で出題されます。

## 開発

```bash
npm run dev
```

```bash
npm run build
```

ビルド結果は `dist/` に出ます。`npm run preview` でビルド版をローカル確認できます。

## スマホにインストールする

1. スマホのブラウザで https://shingomori029-lab.github.io/salon-sprache/ を開く
2. **iPhone**: Safari で開き、下の共有ボタン → 「ホーム画面に追加」
   **Android**: Chrome で開き、右上のメニュー → 「アプリをインストール」
3. 以後はホーム画面のアイコンから起動。**機内モードでも動きます**

### 従業員に配るとき

印刷用の案内ページを用意してあります（QRコード・iPhone / Android 別の手順・使い方）。
休憩室に貼るか、印刷して配ってください。

**https://shingomori029-lab.github.io/salon-sprache/poster.html**

なお、学習記録は各自の端末内（localStorage）にのみ保存されます。**サーバーを持たない構成のため、管理者が従業員の進捗を確認することはできません。**

## デプロイ

`main` に push すると GitHub Actions（[deploy.yml](.github/workflows/deploy.yml)）が自動でビルドして GitHub Pages に反映します。数十秒後にスマホ側も更新されます（アプリを一度閉じて開き直すと確実）。

`vite.config.ts` の `base` は `'./'` なので、別のホスティングにそのまま置き換えても動きます。

### 音声について

読み上げは端末内蔵の音声合成（Web Speech API）を使っています。ドイツ語音声が入っていない端末では 🔊 ボタンは表示されません。iOS は標準でドイツ語音声を持っていますが、無い場合は「設定 → アクセシビリティ → 読み上げコンテンツ → 声 → ドイツ語」から追加してください。

## フレーズを増やす

`src/data/phrases.ts` の配列に追記するだけです。

```ts
{
  id: 'c23',            // 重複しない ID
  cat: 'counseling',    // src/data/types.ts の CategoryId
  ja: '日本語の意味',
  de: 'Der deutsche Satz.',
  kana: 'カタカナ読み',
  en: 'The English sentence.',
  note: '使い方メモ（任意）',
}
```

単語は `src/data/vocab.ts`、シーンの追加は `src/data/types.ts` の `CategoryId` と `phrases.ts` の `categories` を両方編集します。

## 構成

```
src/
  data/       phrases.ts / vocab.ts / types.ts   ← コンテンツはすべてここ
  components/ PhraseCard / VocabList / Quiz
  hooks/      useSpeech（音声合成） / useLocalStorage（お気に入り）
  App.tsx     タブ・検索・絞り込み
```

React + TypeScript + Vite、`vite-plugin-pwa` でオフライン対応。外部 API・サーバーは不要です。
