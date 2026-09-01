import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* プライベートモード等では黙って諦める */
    }
  }, [key, value])

  return [value, setValue] as const
}

/** お気に入り（フレーズID の集合）を localStorage に保存する */
export function useFavorites() {
  const [ids, setIds] = useLocalStorage<string[]>('kw.favorites', [])
  const has = useCallback((id: string) => ids.includes(id), [ids])
  const toggle = useCallback(
    (id: string) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [setIds],
  )
  return { ids, has, toggle }
}
