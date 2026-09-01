import { useCallback, useMemo } from 'react'
import { phrases } from '../data/phrases'
import type { CategoryId } from '../data/types'
import { useLocalStorage } from './useLocalStorage'

/** 1フレーズあたりの成績。端末内にのみ保存される */
export type Stat = {
  /** 正解回数 */
  c: number
  /** 不正解回数 */
  w: number
  /** 現在の連続正解数 */
  s: number
  /** 最後に解いた時刻 */
  t: number
}

/** 連続これだけ正解したら「習得」とみなす */
export const MASTER_STREAK = 2

export type Progress = ReturnType<typeof useProgress>

export function useProgress() {
  const [stats, setStats] = useLocalStorage<Record<string, Stat>>('kw.stats', {})

  const record = useCallback(
    (id: string, ok: boolean) =>
      setStats((prev) => {
        const s = prev[id] ?? { c: 0, w: 0, s: 0, t: 0 }
        return {
          ...prev,
          [id]: {
            c: s.c + (ok ? 1 : 0),
            w: s.w + (ok ? 0 : 1),
            s: ok ? s.s + 1 : 0,
            t: Date.now(),
          },
        }
      }),
    [setStats],
  )

  const reset = useCallback(() => setStats({}), [setStats])

  const isMastered = useCallback((id: string) => (stats[id]?.s ?? 0) >= MASTER_STREAK, [stats])

  /** 一度でも間違えていて、まだ習得しきれていないもの */
  const isWeak = useCallback(
    (id: string) => {
      const s = stats[id]
      return !!s && s.w > 0 && s.s < MASTER_STREAK
    },
    [stats],
  )

  const weakIds = useMemo(
    () => phrases.filter((p) => isWeak(p.id)).map((p) => p.id),
    [isWeak],
  )

  const masteredCount = useMemo(
    () => phrases.filter((p) => isMastered(p.id)).length,
    [isMastered],
  )

  const answeredCount = useMemo(() => Object.keys(stats).length, [stats])

  /** シーンごとの習得数 */
  const byCategory = useCallback(
    (cat: CategoryId) => {
      const list = phrases.filter((p) => p.cat === cat)
      return { mastered: list.filter((p) => isMastered(p.id)).length, total: list.length }
    },
    [isMastered],
  )

  return { stats, record, reset, isMastered, isWeak, weakIds, masteredCount, answeredCount, byCategory, total: phrases.length }
}
