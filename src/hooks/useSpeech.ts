import { useCallback, useEffect, useRef, useState } from 'react'

export type Lang = 'de' | 'en'

const LANG_TAG: Record<Lang, string> = { de: 'de-DE', en: 'en-GB' }

/** iPadOS は Mac を名乗るため、タッチ有無も見る */
const IS_IOS =
  typeof navigator !== 'undefined' &&
  (/iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

export function useSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const [rate, setRate] = useState(0.85)
  /** 再生が始まらなかった＝端末側で鳴らせていない可能性 */
  const [soundFailed, setSoundFailed] = useState(false)
  const primed = useRef(false)
  const timer = useRef<number | undefined>(undefined)

  // iOS は音声一覧の読み込みが遅れ、voiceschanged が来ないこともあるので数秒だけ追いかける
  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    const load = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length) setVoices(v)
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    const poll = window.setInterval(() => {
      if (window.speechSynthesis.getVoices().length) {
        load()
        window.clearInterval(poll)
      }
    }, 300)
    const giveUp = window.setTimeout(() => window.clearInterval(poll), 5000)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      window.clearInterval(poll)
      window.clearTimeout(giveUp)
      window.clearTimeout(timer.current)
    }
  }, [])

  /** 音声一覧が未取得でも、端末に読み上げ機能があればボタンは出す */
  const canSpeak = useCallback(() => 'speechSynthesis' in window, [])

  const speak = useCallback(
    (text: string, lang: Lang, id?: string) => {
      const synth = window.speechSynthesis
      if (!synth) return
      const key = id ?? text
      window.clearTimeout(timer.current)

      const run = () => {
        const u = new SpeechSynthesisUtterance(text)
        u.lang = LANG_TAG[lang]
        u.rate = rate
        u.pitch = 1
        u.volume = 1

        // iOS は voice を明示的に差し替えると無音になることがあるため、lang だけ指定して端末に任せる
        if (!IS_IOS) {
          const voice =
            voices.find((v) => v.lang.replace('_', '-') === LANG_TAG[lang]) ??
            voices.find((v) => v.lang.toLowerCase().startsWith(lang))
          if (voice) u.voice = voice
        }

        let started = false
        u.onstart = () => {
          started = true
          setSoundFailed(false)
          setSpeakingId(key)
        }
        u.onend = () => setSpeakingId(null)
        u.onerror = () => {
          setSpeakingId(null)
          setSoundFailed(true)
        }

        synth.speak(u)
        // 一時停止状態のまま詰まることがあるので起こす
        if (synth.paused) synth.resume()

        timer.current = window.setTimeout(() => {
          if (!started) setSoundFailed(true)
        }, 1500)
      }

      // iOS は最初の speak() がタップと同じ処理の中にないとブロックされる。初回は必ず同期で呼ぶ
      if (!primed.current) {
        primed.current = true
        run()
        return
      }

      // iOS では cancel() の直後に speak() すると無音になるため、鳴っている時だけ止めて間を置く
      if (synth.speaking || synth.pending) {
        synth.cancel()
        window.setTimeout(run, IS_IOS ? 150 : 0)
      } else {
        run()
      }
    },
    [voices, rate],
  )

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setSpeakingId(null)
  }, [])

  return { speak, stop, speakingId, canSpeak, rate, setRate, soundFailed, setSoundFailed, isIOS: IS_IOS }
}
