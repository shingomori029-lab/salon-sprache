import { useLocalStorage } from '../hooks/useLocalStorage'

function detect() {
  const ua = navigator.userAgent
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari 独自プロパティ
    (navigator as unknown as { standalone?: boolean }).standalone === true
  const isIOS = /iphone|ipad|ipod/i.test(ua)
  // iOS では Chrome/Firefox からホーム画面に追加できない
  const iosNonSafari = isIOS && /crios|fxios|edgios/i.test(ua)
  return { standalone, isIOS, iosNonSafari }
}

/** ホーム画面への追加手順。インストール済み・閉じた後は出さない */
export function InstallHint() {
  const [dismissed, setDismissed] = useLocalStorage('kw.installHintClosed', false)
  const { standalone, isIOS, iosNonSafari } = detect()

  if (standalone || dismissed) return null

  return (
    <aside className="install">
      <button className="install-close" onClick={() => setDismissed(true)} aria-label="閉じる">×</button>
      <strong>📲 ホーム画面に追加すると、電波がなくても使えます</strong>
      {iosNonSafari ? (
        <p>
          このブラウザからは追加できません。<b>Safari</b> でこのページを開き直してから、
          下の共有ボタン <b>􀈂</b> →「ホーム画面に追加」を選んでください。
        </p>
      ) : isIOS ? (
        <p>
          画面下の共有ボタン（□に↑）をタップ → メニューを下にスクロール →
          <b>「ホーム画面に追加」</b> → 右上の「追加」
        </p>
      ) : (
        <p>
          ブラウザのメニュー（⋮）を開いて <b>「アプリをインストール」</b>
          または「ホーム画面に追加」を選んでください。
        </p>
      )}
    </aside>
  )
}
