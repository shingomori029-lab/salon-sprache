import type { Vocab } from './types'

/** 現場で耳から飛び込んでくる単語。名詞は冠詞つきで覚えるのが近道。 */
export const vocab: Vocab[] = [
  // 髪の部位
  { group: '髪の部位', ja: '髪',           art: 'das', de: 'Haar',         kana: 'ハール',             en: 'hair' },
  { group: '髪の部位', ja: '毛先',         art: 'die', de: 'Spitzen',      kana: 'シュピッツェン',     en: 'ends' },
  { group: '髪の部位', ja: '根元',         art: 'der', de: 'Ansatz',       kana: 'アンザッツ',         en: 'roots' },
  { group: '髪の部位', ja: '前髪',         art: 'der', de: 'Pony',         kana: 'ポニー',             en: 'fringe / bangs' },
  { group: '髪の部位', ja: '分け目',       art: 'der', de: 'Scheitel',     kana: 'シャイテル',         en: 'parting' },
  { group: '髪の部位', ja: '襟足・うなじ', art: 'der', de: 'Nacken',       kana: 'ナッケン',           en: 'nape' },
  { group: '髪の部位', ja: 'サイド',       art: 'die', de: 'Seiten',       kana: 'ザイテン',           en: 'sides' },
  { group: '髪の部位', ja: '後頭部',       art: 'der', de: 'Hinterkopf',   kana: 'ヒンターコップフ',   en: 'back of the head' },
  { group: '髪の部位', ja: 'つむじ',       art: 'der', de: 'Wirbel',       kana: 'ヴィルベル',         en: 'crown / cowlick' },
  { group: '髪の部位', ja: '頭皮',         art: 'die', de: 'Kopfhaut',     kana: 'コップハウト',       en: 'scalp' },
  { group: '髪の部位', ja: '生え際',       art: 'der', de: 'Haaransatz',   kana: 'ハーアンザッツ',     en: 'hairline' },

  // 技術
  { group: '技術',   ja: 'カット',         art: 'der', de: 'Haarschnitt',      kana: 'ハールシュニット',       en: 'haircut' },
  { group: '技術',   ja: '毛先を整える',   art: '',    de: 'nachschneiden',    kana: 'ナーハシュナイデン',     en: 'to trim' },
  { group: '技術',   ja: 'すく・軽くする', art: '',    de: 'ausdünnen',        kana: 'アウスデュンネン',       en: 'to thin out' },
  { group: '技術',   ja: 'レイヤー・段',   art: 'die', de: 'Stufen',           kana: 'シュトゥーフェン',       en: 'layers' },
  { group: '技術',   ja: 'カラー',         art: 'die', de: 'Färbung',          kana: 'フェルブング',           en: 'colouring' },
  { group: '技術',   ja: '根元染め',       art: 'die', de: 'Ansatzfärbung',    kana: 'アンザッツフェルブング', en: 'root touch-up' },
  { group: '技術',   ja: 'ブリーチ',       art: 'die', de: 'Blondierung',      kana: 'ブロンディールング',     en: 'bleaching' },
  { group: '技術',   ja: 'ハイライト',     art: 'die', de: 'Strähnen',         kana: 'シュトレーネン',         en: 'highlights' },
  { group: '技術',   ja: 'パーマ',         art: 'die', de: 'Dauerwelle',       kana: 'ダウアーヴェレ',         en: 'perm' },
  { group: '技術',   ja: '縮毛矯正',       art: 'die', de: 'Glättung',         kana: 'グレットゥング',         en: 'straightening' },
  { group: '技術',   ja: 'シャンプー(施術)', art: 'die', de: 'Haarwäsche',     kana: 'ハールヴェッシェ',       en: 'hair wash' },
  { group: '技術',   ja: 'トリートメント', art: 'die', de: 'Kur',              kana: 'クーア',                 en: 'treatment' },
  { group: '技術',   ja: 'ブロー',         art: '',    de: 'föhnen',           kana: 'フェーネン',             en: 'to blow-dry' },
  { group: '技術',   ja: 'ヘアセット',     art: 'das', de: 'Styling',          kana: 'シュタイリング',         en: 'styling' },
  { group: '技術',   ja: 'ひげ剃り',       art: 'die', de: 'Rasur',            kana: 'ラズーア',               en: 'shave' },

  // 道具・商品
  { group: '道具',   ja: 'はさみ',         art: 'die', de: 'Schere',       kana: 'シェーレ',           en: 'scissors' },
  { group: '道具',   ja: 'バリカン',       art: 'die', de: 'Maschine',     kana: 'マシーネ',           en: 'clippers' },
  { group: '道具',   ja: 'くし',           art: 'der', de: 'Kamm',         kana: 'カム',               en: 'comb' },
  { group: '道具',   ja: 'ブラシ',         art: 'die', de: 'Bürste',       kana: 'ビュルステ',         en: 'brush' },
  { group: '道具',   ja: 'ドライヤー',     art: 'der', de: 'Föhn',         kana: 'フェーン',           en: 'hairdryer' },
  { group: '道具',   ja: 'アイロン',       art: 'das', de: 'Glätteisen',   kana: 'グレットアイゼン',   en: 'straightener' },
  { group: '道具',   ja: 'ロッド',         art: 'die', de: 'Wickler',      kana: 'ヴィックラー',       en: 'perm rods' },
  { group: '道具',   ja: 'ケープ',         art: 'der', de: 'Umhang',       kana: 'ウムハング',         en: 'cape' },
  { group: '道具',   ja: 'タオル',         art: 'das', de: 'Handtuch',     kana: 'ハントトゥーフ',     en: 'towel' },
  { group: '道具',   ja: 'シャンプー台',   art: 'das', de: 'Waschbecken',  kana: 'ヴァッシュベッケン', en: 'basin' },
  { group: '道具',   ja: '鏡',             art: 'der', de: 'Spiegel',      kana: 'シュピーゲル',       en: 'mirror' },
  { group: '道具',   ja: 'ワックス',       art: 'das', de: 'Wachs',        kana: 'ヴァックス',         en: 'wax' },
  { group: '道具',   ja: 'ヘアスプレー',   art: 'das', de: 'Haarspray',    kana: 'ハールシュプレイ',   en: 'hairspray' },
  { group: '道具',   ja: '熱から守る剤',   art: 'der', de: 'Hitzeschutz',  kana: 'ヒッツェシュッツ',   en: 'heat protectant' },

  // 髪質・状態
  { group: '髪質',   ja: '直毛',           art: '',    de: 'glatt',        kana: 'グラット',           en: 'straight' },
  { group: '髪質',   ja: 'ウェーブ',       art: '',    de: 'wellig',       kana: 'ヴェリッヒ',         en: 'wavy' },
  { group: '髪質',   ja: 'カール・巻き毛', art: '',    de: 'lockig',       kana: 'ロッキッヒ',         en: 'curly' },
  { group: '髪質',   ja: '細い髪',         art: '',    de: 'fein',         kana: 'ファイン',           en: 'fine' },
  { group: '髪質',   ja: '硬い・しっかり', art: '',    de: 'kräftig',      kana: 'クレフティヒ',       en: 'thick / strong' },
  { group: '髪質',   ja: '傷んだ',         art: '',    de: 'strapaziert',  kana: 'シュトラパツィーアト', en: 'damaged' },
  { group: '髪質',   ja: '乾燥した',       art: '',    de: 'trocken',      kana: 'トロッケン',         en: 'dry' },
  { group: '髪質',   ja: '脂性の',         art: '',    de: 'fettig',       kana: 'フェッティヒ',       en: 'oily' },
  { group: '髪質',   ja: '枝毛',           art: 'der', de: 'Spliss',       kana: 'シュプリス',         en: 'split ends' },
  { group: '髪質',   ja: 'フケ',           art: 'die', de: 'Schuppen',     kana: 'シュッペン',         en: 'dandruff' },
  { group: '髪質',   ja: '白髪',           art: 'die', de: 'grauen Haare', kana: 'グラウエン ハーレ',  en: 'grey hair' },
  { group: '髪質',   ja: '抜け毛',         art: 'der', de: 'Haarausfall',  kana: 'ハーアウスファル',   en: 'hair loss' },

  // 色
  { group: '色',     ja: '金髪',           art: '',    de: 'blond',        kana: 'ブロント',           en: 'blonde' },
  { group: '色',     ja: '茶色',           art: '',    de: 'braun',        kana: 'ブラウン',           en: 'brown' },
  { group: '色',     ja: '黒',             art: '',    de: 'schwarz',      kana: 'シュヴァルツ',       en: 'black' },
  { group: '色',     ja: '赤',             art: '',    de: 'rot',          kana: 'ロート',             en: 'red' },
  { group: '色',     ja: '明るい',         art: '',    de: 'hell',         kana: 'ヘル',               en: 'light' },
  { group: '色',     ja: '暗い',           art: '',    de: 'dunkel',       kana: 'ドゥンケル',         en: 'dark' },
  { group: '色',     ja: '暖色系',         art: '',    de: 'warm',         kana: 'ヴァルム',           en: 'warm tone' },
  { group: '色',     ja: '寒色系',         art: '',    de: 'kühl / aschig', kana: 'キュール／アッシヒ', en: 'cool / ashy' },

  // 長さ・程度
  { group: '長さ',   ja: '短い',           art: '',    de: 'kurz',             kana: 'クルツ',                 en: 'short' },
  { group: '長さ',   ja: '長い',           art: '',    de: 'lang',             kana: 'ラング',                 en: 'long' },
  { group: '長さ',   ja: '肩までの長さ',   art: '',    de: 'schulterlang',     kana: 'シュルターラング',       en: 'shoulder-length' },
  { group: '長さ',   ja: '顎までの長さ',   art: '',    de: 'kinnlang',         kana: 'キンラング',             en: 'chin-length' },
  { group: '長さ',   ja: '少しだけ',       art: '',    de: 'nur ein bisschen', kana: 'ヌア アイン ビスヒェン', en: 'just a little' },
  { group: '長さ',   ja: 'たくさん',       art: '',    de: 'viel',             kana: 'フィール',               en: 'a lot' },
  { group: '長さ',   ja: '指2本分',        art: '',    de: 'zwei Finger breit', kana: 'ツヴァイ フィンガー ブライト', en: 'two fingers’ width' },
  { group: '長さ',   ja: 'センチ',         art: 'der', de: 'Zentimeter',       kana: 'ツェンティメーター',     en: 'centimetre' },

  // 店・予約
  { group: '店',     ja: '美容師',         art: 'der', de: 'Friseur / die Friseurin', kana: 'フリズーア／フリズーリン', en: 'hairdresser' },
  { group: '店',     ja: 'お客様',         art: 'der', de: 'Kunde / die Kundin',      kana: 'クンデ／クンディン',       en: 'customer' },
  { group: '店',     ja: '予約',           art: 'der', de: 'Termin',                  kana: 'テルミーン',               en: 'appointment' },
  { group: '店',     ja: '会計・レジ',     art: 'die', de: 'Kasse',                   kana: 'カッセ',                   en: 'till / checkout' },
  { group: '店',     ja: 'チップ',         art: 'das', de: 'Trinkgeld',               kana: 'トリンクゲルト',           en: 'tip' },
  { group: '店',     ja: '値段',           art: 'der', de: 'Preis',                   kana: 'プライス',                 en: 'price' },
  { group: '店',     ja: '同僚',           art: 'die', de: 'Kollegin / der Kollege',  kana: 'コレギン／コレーゲ',       en: 'colleague' },
]
