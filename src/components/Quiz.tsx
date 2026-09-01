import { useMemo, useState } from 'react'
import { phrases, categories } from '../data/phrases'
import type { CategoryId, Phrase } from '../data/types'
import type { Lang } from '../hooks/useSpeech'
import { MASTER_STREAK, type Progress } from '../hooks/useProgress'

type Props = {
  lang: Lang
  onSpeak: (text: string, lang: Lang, id: string) => void
  hasVoice: (lang: Lang) => boolean
  progress: Progress
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

/**
 * questions から出題し、選択肢のダミーは distractors から取る。
 * 苦手だけを出題する時も、選択肢は同じシーンの他フレーズから選ばれる。
 */
function buildQuiz(questions: Phrase[], distractors: Phrase[], lang: Lang) {
  return shuffle(questions)
    .slice(0, QUESTIONS)
    .map((correct) => {
      const others = shuffle(distractors.filter((p) => p.id !== correct.id)).slice(0, 3)
      return {
        phrase: correct,
        options: shuffle([correct, ...others]).map((p) => ({
          id: p.id,
          text: lang === 'de' ? p.de : p.en,
        })),
      }
    })
}

export function Quiz({ lang, onSpeak, hasVoice, progress }: Props) {
  const [cat, setCat] = useState<CategoryId | 'all'>('all')
  const [weakOnly, setWeakOnly] = useState(false)

  const inCat = useMemo(
    () => (cat === 'all' ? phrases : phrases.filter((p) => p.cat === cat)),
    [cat],
  )
  const questions = useMemo(
    () => (weakOnly ? inCat.filter((p) => progress.isWeak(p.id)) : inCat),
    [inCat, weakOnly, progress],
  )
  // 選択肢のダミーは、範囲が狭いときは全体から補う
  const distractors = inCat.length >= 4 ? inCat : phrases

  const pct = Math.round((progress.masteredCount / progress.total) * 100)

  return (
    <div className="quiz">
      <div className="mastery">
        <div className="mastery-head">
          <span>習得したフレーズ</span>
          <strong>{progress.masteredCount} <em>/ {progress.total}</em></strong>
        </div>
        <div className="bar"><i style={{ width: `${pct}%` }} /></div>
        <p className="mastery-note">
          {progress.answeredCount === 0
            ? `クイズに答えると記録が残ります。${MASTER_STREAK}回連続で正解すると「習得」です。`
            : `苦手なフレーズ ${progress.weakIds.length}件・出題済み ${progress.answeredCount}件`}
        </p>
      </div>

      <div className="quiz-bar">
        <select value={cat} onChange={(e) => setCat(e.target.value as CategoryId | 'all')}>
          <option value="all">すべてのシーンから出題</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.ja}</option>
          ))}
        </select>
        <label className="weak-toggle">
          <input type="checkbox" checked={weakOnly} onChange={(e) => setWeakOnly(e.target.checked)} />
          苦手だけ
        </label>
      </div>

      {questions.length === 0 ? (
        <p className="empty">
          {weakOnly
            ? 'この範囲に苦手なフレーズはありません。\nよくできています。'
            : 'このシーンには出題できるフレーズがありません。'}
        </p>
      ) : (
        // key を変えることで、条件を変えたら丸ごとやり直しになる
        <Round
          key={`${cat}:${lang}:${weakOnly}`}
          questions={questions}
          distractors={distractors}
          lang={lang}
          onSpeak={onSpeak}
          hasVoice={hasVoice}
          progress={progress}
        />
      )}
    </div>
  )
}

function Round({
  questions, distractors, lang, onSpeak, hasVoice, progress,
}: Props & { questions: Phrase[]; distractors: Phrase[] }) {
  // key で remount されるので、初期化は条件ごとに一度きり
  const [quiz, setQuiz] = useState(() => buildQuiz(questions, distractors, lang))
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [missed, setMissed] = useState<Phrase[]>([])

  const restart = () => {
    setQuiz(buildQuiz(questions, distractors, lang))
    setIndex(0)
    setPicked(null)
    setScore(0)
    setMissed([])
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

        {missed.length > 0 && (
          <div className="missed">
            <h3>間違えたフレーズ</h3>
            <ul>
              {missed.map((p) => (
                <li key={p.id}>
                  <span className="m-ja">{p.ja}</span>
                  <span className="m-target">{lang === 'de' ? p.de : p.en}</span>
                  {lang === 'de' && <span className="m-kana">{p.kana}</span>}
                </li>
              ))}
            </ul>
            <p className="missed-note">これらは「苦手だけ」で再出題されます。</p>
          </div>
        )}

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
                progress.record(q.phrase.id, isCorrect)
                if (isCorrect) setScore((s) => s + 1)
                else setMissed((m) => [...m, q.phrase])
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
