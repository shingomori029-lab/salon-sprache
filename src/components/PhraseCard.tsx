import type { Phrase } from '../data/types'
import type { Lang } from '../hooks/useSpeech'

export type ShowLang = 'de' | 'en' | 'both'

type Props = {
  phrase: Phrase
  show: ShowLang
  /** 日本語だけ見せて外国語を隠す「練習モード」 */
  masked?: boolean
  onReveal?: () => void
  favorite: boolean
  onToggleFavorite: () => void
  onSpeak: (text: string, lang: Lang, id: string) => void
  speakingId: string | null
  hasVoice: (lang: Lang) => boolean
}

export function PhraseCard({
  phrase, show, masked, onReveal, favorite, onToggleFavorite, onSpeak, speakingId, hasVoice,
}: Props) {
  const showDe = show === 'de' || show === 'both'
  const showEn = show === 'en' || show === 'both'

  return (
    <article className="card">
      <div className="card-head">
        <p className="ja">{phrase.ja}</p>
        <button
          className={'fav' + (favorite ? ' on' : '')}
          onClick={onToggleFavorite}
          aria-label={favorite ? 'お気に入りから外す' : 'お気に入りに追加'}
          aria-pressed={favorite}
        >
          {favorite ? '★' : '☆'}
        </button>
      </div>

      {masked ? (
        <button className="reveal" onClick={onReveal}>
          タップして答えを見る
        </button>
      ) : (
        <div className="langs">
          {showDe && (
            <div className="line de">
              <span className="tag">DE</span>
              <div className="text">
                <p className="target">{phrase.de}</p>
                <p className="kana">{phrase.kana}</p>
              </div>
              {hasVoice('de') && (
                <button
                  className={'play' + (speakingId === phrase.id + ':de' ? ' playing' : '')}
                  onClick={() => onSpeak(phrase.de, 'de', phrase.id + ':de')}
                  aria-label="ドイツ語を再生"
                >
                  🔊
                </button>
              )}
            </div>
          )}
          {showEn && (
            <div className="line en">
              <span className="tag">EN</span>
              <div className="text">
                <p className="target">{phrase.en}</p>
              </div>
              {hasVoice('en') && (
                <button
                  className={'play' + (speakingId === phrase.id + ':en' ? ' playing' : '')}
                  onClick={() => onSpeak(phrase.en, 'en', phrase.id + ':en')}
                  aria-label="英語を再生"
                >
                  🔊
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {phrase.note && !masked && <p className="note">💡 {phrase.note}</p>}
    </article>
  )
}
