import { useMemo } from 'react'
import { vocab } from '../data/vocab'
import type { Lang } from '../hooks/useSpeech'
import type { ShowLang } from './PhraseCard'

type Props = {
  query: string
  show: ShowLang
  onSpeak: (text: string, lang: Lang, id: string) => void
  hasVoice: (lang: Lang) => boolean
}

export function VocabList({ query, show, onSpeak, hasVoice }: Props) {
  const q = query.trim().toLowerCase()
  const filtered = useMemo(
    () =>
      q
        ? vocab.filter((v) =>
            [v.ja, v.de, v.en, v.kana].some((s) => s.toLowerCase().includes(q)),
          )
        : vocab,
    [q],
  )

  const groups = useMemo(() => {
    const map = new Map<string, typeof vocab>()
    for (const v of filtered) {
      const list = map.get(v.group) ?? []
      list.push(v)
      map.set(v.group, list)
    }
    return [...map.entries()]
  }, [filtered])

  if (!filtered.length) return <p className="empty">「{query}」に一致する単語はありません。</p>

  return (
    <div className="vocab">
      {groups.map(([group, items]) => (
        <section key={group}>
          <h3 className="group-title">{group}</h3>
          <ul className="vocab-list">
            {items.map((v) => (
              <li key={v.de + v.ja}>
                <span className="v-ja">{v.ja}</span>
                <span className="v-target">
                  {(show === 'de' || show === 'both') && (
                    <span className="v-de">
                      {v.art && <em>{v.art} </em>}
                      {v.de}
                      <span className="v-kana">{v.kana}</span>
                    </span>
                  )}
                  {(show === 'en' || show === 'both') && <span className="v-en">{v.en}</span>}
                </span>
                {hasVoice('de') && (show === 'de' || show === 'both') && (
                  <button
                    className="play small"
                    aria-label={`${v.de} を再生`}
                    onClick={() => onSpeak(`${v.art ? v.art + ' ' : ''}${v.de}`, 'de', v.de)}
                  >
                    🔊
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
