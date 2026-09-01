# Salon Sprache

海外で働く日本人美容師のための、接客シーン別 **ドイツ語・英語フレーズ帳**（PWA）。

- 12シーン・135フレーズ（受付／カウンセリング／髪の診断／カット／カラー／パーマ／シャンプー／仕上げ／ホームケア／会計／雑談／聞き返し）
- 全ドイツ語フレーズに **カタカナ読み** つき
- 端末内蔵の音声合成で **発音再生**（速度調整あり）
- **単語帳** 75語（名詞は der / die / das つき）
- **4択クイズ**（シーン別に出題範囲を絞れる）
- **お気に入り**（明日使う分だけ集めておける）
- **隠して練習**モード（日本語だけ見て外国語を思い出す）
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

## スマホで使う

1. `npm run build` → `dist/` を任意の静的ホスティング（Netlify / Vercel / Cloudflare Pages / GitHub Pages）に置く
2. スマホのブラウザで開く
3. iPhone は Safari の共有ボタン →「ホーム画面に追加」、Android は Chrome のメニュー →「アプリをインストール」

`vite.config.ts` の `base` は `'./'` にしてあるのでサブディレクトリ配信でもそのまま動きます。

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
