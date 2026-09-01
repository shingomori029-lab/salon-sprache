export type CategoryId =
  | 'greeting'
  | 'counseling'
  | 'diagnosis'
  | 'cut'
  | 'color'
  | 'perm'
  | 'shampoo'
  | 'finish'
  | 'homecare'
  | 'payment'
  | 'smalltalk'
  | 'trouble'

export type Category = {
  id: CategoryId
  ja: string
  de: string
  en: string
  icon: string
  desc: string
}

export type Phrase = {
  id: string
  cat: CategoryId
  /** 日本語の意味 */
  ja: string
  /** ドイツ語（Sie＝敬称形） */
  de: string
  /** ドイツ語のカタカナ読み（目安） */
  kana: string
  /** 英語 */
  en: string
  /** 使い方・文法メモ（任意） */
  note?: string
}

export type Vocab = {
  ja: string
  de: string
  /** der / die / das */
  art?: 'der' | 'die' | 'das' | ''
  kana: string
  en: string
  group: string
}
