import { useMemo, useState } from 'react'
import { phrases, categories } from '../data/phrases'
import type { CategoryId, Phrase } from '../data/types'
import type { Lang } from '../hooks/useSpeech'

type Props = {
  lang: Lang
  onSpeak: (text: string, lang: Lang, id: string) => void
  hasVoice: (lang: Lang) => boolean
}

const QUESTIONS = 8

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuiz(pool: Phrase[], lang: Lang) {
  return shuffle(pool)
    .slice(0, QUESTIONS)
    .map((correct) => {
      const distractors = shuffle(pool.filter((p) => p.id !== correct.id)).slice(0, 3)
      return {
        phrase: correct,
        options: shuffle([correct, ...distractors]).map((p) => ({
          id: p.id,
          text: lang === 'de' ? p.de : p.en,
        })),
      }
    })
}

export function Quiz({ lang, onSpeak, hasVoice }: Props) {
  const [cat, setCat] = useState<CategoryId | 'all'>('all')
  const pool = useMemo(
    () => (cat === 'all' ? phrases : phrases.filter((p) => p.cat === cat)),
    [cat],
  )

  return (
    <div className="quiz">
      <div className="quiz-bar">
        <select value={cat} onChange={(e) => setCat(e.target.value as CategoryId | 'all')}>
          <option value="all">すべてのシーンから出題</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.ja}</option>
          ))}
        </select>
      </div>

      {pool.length < 4 ? (
        <p className="empty">このシーンは問題数が足りません。</p>
      ) : (
        // key を変えることで、出題範囲や言語を変えたら丸ごとやり直しになる
        <Round key={`${cat}:${lang}`} pool={pool} lang={lang} onSpeak={onSpeak} hasVoice={hasVoice} />
      )}
    </div>
  )
}

function Round({ pool, lang, onSpeak, hasVoice }: Props & { pool: Phrase[] }) {
  // key で remount されるので、出題範囲・言語ごとに初期化は一度きり
  const [quiz, setQuiz] = useState(() => buildQuiz(pool, lang))
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)

  const restart = () => {
    setQuiz(buildQuiz(pool, lang))
    setIndex(0)
    setPicked(null)
    setScore(0)
  }

  if (index >= quiz.length) {
    return (
      <div className="result">
        <p className="score">{score} <span>/ {quiz.length} 問正解</span></p>
        <p className="comment">
          {score === quiz.length ? '完璧です。明日そのまま現場で使えます。'
            : score >= quiz.length * 0.7 ? 'いい調子。間違えた分だけ復習しましょう。'
            : 'まずはフレーズ集で、声に出して読むところから。'}
        </p>
        <button className="primary" onClick={restart}>もう一度</button>
      </div>
    )
  }

  const q = quiz[index]

  return (
    <>
      <p className="progress center">{index + 1} / {quiz.length}</p>
      <p className="question">{q.phrase.ja}</p>
      <p className="question-hint">{lang === 'de' ? 'ドイツ語では？' : '英語では？'}</p>

      <div className="options">
        {q.options.map((o) => {
          const isCorrect = o.id === q.phrase.id
          const state = picked === null ? '' : isCorrect ? ' correct' : o.id === picked ? ' wrong' : ' dim'
          return (
            <button
              key={o.id}
              className={'option' + state}
              disabled={picked !== null}
              onClick={() => {
                setPicked(o.id)
                if (isCorrect) setScore((s) => s + 1)
              }}
            >
              {o.text}
            </button>
          )
        })}
      </div>

      {picked !== null && (
        <div className="answer">
          <p className="kana">{lang === 'de' ? q.phrase.kana : ''}</p>
          <div className="answer-actions">
            {hasVoice(lang) && (
              <button
                className="ghost"
                onClick={() => onSpeak(lang === 'de' ? q.phrase.de : q.phrase.en, lang, 'quiz')}
              >
                🔊 発音を聞く
              </button>
            )}
            <button className="primary" onClick={() => { setIndex((i) => i + 1); setPicked(null) }}>
              次へ
            </button>
          </div>
        </div>
      )}
    </>
  )
}
