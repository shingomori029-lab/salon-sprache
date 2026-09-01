import { useCallback, useEffect, useState } from 'react'

export type Lang = 'de' | 'en'

const LANG_TAG: Record<Lang, string> = { de: 'de-DE', en: 'en-GB' }

/**
 * 端末内蔵の音声合成で読み上げる。ドイツ語音声が無い端末では
 * supported が false になり、UI 側で再生ボタンを隠す。
 */
export function useSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const [rate, setRate] = useState(0.85)

  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  const hasVoice = useCallback(
    (lang: Lang) => voices.some((v) => v.lang.toLowerCase().startsWith(lang)),
    [voices],
  )

  const speak = useCallback(
    (text: string, lang: Lang, id?: string) => {
      if (!('speechSynthesis' in window)) return
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = LANG_TAG[lang]
      u.rate = rate
      const voice =
        voices.find((v) => v.lang.replace('_', '-') === LANG_TAG[lang]) ??
        voices.find((v) => v.lang.toLowerCase().startsWith(lang))
      if (voice) u.voice = voice
      const key = id ?? text
      u.onstart = () => setSpeakingId(key)
      u.onend = () => setSpeakingId(null)
      u.onerror = () => setSpeakingId(null)
      window.speechSynthesis.speak(u)
    },
    [voices, rate],
  )

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setSpeakingId(null)
  }, [])

  return { speak, stop, speakingId, hasVoice, rate, setRate }
}
