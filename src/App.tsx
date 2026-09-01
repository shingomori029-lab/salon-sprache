import { useMemo, useState } from 'react'
import { categories, phrases } from './data/phrases'
import type { CategoryId } from './data/types'
import { PhraseCard, type ShowLang } from './components/PhraseCard'
import { VocabList } from './components/VocabList'
import { Quiz } from './components/Quiz'
import { InstallHint } from './components/InstallHint'
import { useSpeech } from './hooks/useSpeech'
import { useFavorites, useLocalStorage } from './hooks/useLocalStorage'
import { useProgress } from './hooks/useProgress'
import './App.css'

type Tab = 'phrases' | 'vocab' | 'quiz' | 'favorites'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'phrases', label: 'フレーズ', icon: '💬' },
  { id: 'vocab', label: '単語', icon: '📖' },
  { id: 'quiz', label: '練習', icon: '🎯' },
  { id: 'favorites', label: 'お気に入り', icon: '★' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('phrases')
  const [show, setShow] = useLocalStorage<ShowLang>('kw.show', 'de')
  const [cat, setCat] = useState<CategoryId | null>(null)
  const [query, setQuery] = useState('')
  const [practice, setPractice] = useLocalStorage('kw.practice', false)
  const [revealed, setRevealed] = useState<string[]>([])

  const { speak, speakingId, hasVoice, rate, setRate } = useSpeech()
  const fav = useFavorites()
  const progress = useProgress()

  const q = query.trim().toLowerCase()
  const visible = useMemo(() => {
    let list = phrases
    if (tab === 'favorites') list = list.filter((p) => fav.ids.includes(p.id))
    else if (cat) list = list.filter((p) => p.cat === cat)
    if (q) {
      list = list.filter((p) =>
        [p.ja, p.de, p.en, p.kana].some((s) => s.toLowerCase().includes(q)),
      )
    }
    return list
  }, [tab, cat, q, fav.ids])

  const current = categories.find((c) => c.id === cat)
  const searching = q.length > 0

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="logo">✂️</span>
          <div>
            <h1>Salon Sprache</h1>
            <p>海外で働く日本人美容師のための接客フレーズ帳</p>
          </div>
        </div>

        <div className="controls">
          <div className="seg" role="group" aria-label="表示言語">
            {(['de', 'en', 'both'] as ShowLang[]).map((v) => (
              <button
                key={v}
                className={show === v ? 'on' : ''}
                onClick={() => setShow(v)}
              >
                {v === 'de' ? 'ドイツ語' : v === 'en' ? '英語' : '両方'}
              </button>
            ))}
          </div>
          {'speechSynthesis' in window && (
            <label className="rate">
              読み上げ速度
              <input
                type="range" min="0.5" max="1.1" step="0.05"
                value={rate} onChange={(e) => setRate(Number(e.target.value))}
              />
            </label>
          )}
        </div>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? 'on' : ''}
            onClick={() => { setTab(t.id); setCat(null); setQuery('') }}
          >
            <span aria-hidden="true">{t.icon}</span>
            {t.label}
            {t.id === 'favorites' && fav.ids.length > 0 && <b className="count">{fav.ids.length}</b>}
          </button>
        ))}
      </nav>

      <main className="main">
        <InstallHint />

        {tab !== 'quiz' && (
          <div className="searchbar">
            <input
              type="search"
              value={query}
              placeholder={tab === 'vocab' ? '単語を検索（日本語・独・英）' : 'フレーズを検索（日本語・独・英）'}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}

        {tab === 'phrases' && (
          <>
            {!cat && !searching ? (
              <div className="cats">
                {categories.map((c) => {
                  const { mastered, total } = progress.byCategory(c.id)
                  return (
                    <button key={c.id} className="cat" onClick={() => setCat(c.id)}>
                      <span className="cat-icon" aria-hidden="true">{c.icon}</span>
                      <span className="cat-body">
                        <strong>{c.ja}</strong>
                        <em>{c.de}</em>
                        <small>{c.desc}</small>
                        {mastered > 0 && (
                          <span className="cat-bar" title={`${total}件中 ${mastered}件を習得`}>
                            <i style={{ width: `${(mastered / total) * 100}%` }} />
                          </span>
                        )}
                      </span>
                      <span className="cat-n">{mastered > 0 ? `${mastered}/${total}` : total}</span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <>
                <div className="crumb">
                  {cat && !searching && (
                    <button className="back" onClick={() => setCat(null)}>← シーン一覧</button>
                  )}
                  <h2>
                    {searching ? `「${query}」の検索結果 ${visible.length}件`
                      : `${current?.icon} ${current?.ja}`}
                  </h2>
                  <label className="practice">
                    <input
                      type="checkbox"
                      checked={practice}
                      onChange={(e) => { setPractice(e.target.checked); setRevealed([]) }}
                    />
                    隠して練習
                  </label>
                </div>
                <PhraseGrid />
              </>
            )}
          </>
        )}

        {tab === 'favorites' && (
          visible.length ? (
            <>
              <div className="crumb"><h2>★ お気に入り {visible.length}件</h2></div>
              <PhraseGrid />
            </>
          ) : (
            <p className="empty">
              まだお気に入りがありません。<br />
              フレーズの ☆ を押すと、明日使う分だけここに集められます。
            </p>
          )
        )}

        {tab === 'vocab' && (
          <VocabList query={query} show={show} onSpeak={speak} hasVoice={hasVoice} />
        )}

        {tab === 'quiz' && (
          <Quiz lang={show === 'en' ? 'en' : 'de'} onSpeak={speak} hasVoice={hasVoice} progress={progress} />
        )}
      </main>

      <footer className="footer">
        <p>収録：フレーズ {phrases.length}件 / {categories.length}シーン ・ オフラインでも使えます</p>
        {progress.answeredCount > 0 && (
          <button
            className="reset"
            onClick={() => {
              if (confirm('クイズの成績と習得状況をすべて消します。お気に入りは残ります。よろしいですか？')) {
                progress.reset()
              }
            }}
          >
            学習記録をリセット
          </button>
        )}
      </footer>
    </div>
  )

  function PhraseGrid() {
    if (!visible.length) return <p className="empty">該当するフレーズがありません。</p>
    return (
      <div className="list">
        {visible.map((p) => (
          <PhraseCard
            key={p.id}
            phrase={p}
            show={show}
            masked={practice && tab === 'phrases' && !revealed.includes(p.id)}
            onReveal={() => setRevealed((r) => [...r, p.id])}
            favorite={fav.has(p.id)}
            onToggleFavorite={() => fav.toggle(p.id)}
            onSpeak={speak}
            speakingId={speakingId}
            hasVoice={hasVoice}
          />
        ))}
      </div>
    )
  }
}
