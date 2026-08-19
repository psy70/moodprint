import { useCallback, useRef, useState } from 'react'
import { DownloadIcon, LockIcon, ShuffleIcon, SparkIcon } from './components/Icons'
import { MoodCanvas, type MoodCanvasHandle } from './components/MoodCanvas'
import { seedLabel } from './lib/random'

const DEFAULT_TEXT = '今天像一场缓慢落下的蓝色雨。'

function initialText() {
  const parameter = new URLSearchParams(window.location.search).get('text')
  return parameter?.slice(0, 60) || DEFAULT_TEXT
}

function App() {
  const [draft, setDraft] = useState(initialText)
  const [generatedText, setGeneratedText] = useState(initialText)
  const [variant, setVariant] = useState(0)
  const [isEntering, setIsEntering] = useState(false)
  const [exportStatus, setExportStatus] = useState('')
  const canvasRef = useRef<MoodCanvasHandle>(null)

  const announceExport = useCallback(() => {
    setExportStatus('海报已生成，下载已开始')
  }, [])

  const generate = () => {
    const nextText = draft.trim() || DEFAULT_TEXT
    setDraft(nextText)
    setGeneratedText(nextText)
    setVariant(0)
    setIsEntering(true)
    const url = new URL(window.location.href)
    url.searchParams.set('text', nextText)
    window.history.replaceState({}, '', url)
    window.setTimeout(() => setIsEntering(false), 520)
  }

  const regenerate = () => {
    setVariant((current) => current + 1)
    setIsEntering(true)
    window.setTimeout(() => setIsEntering(false), 520)
  }

  return (
    <main className="app-shell">
      <header className="brand" aria-label="Moodprint 心情制图机">
        <SparkIcon size={30} />
        <div>
          <div className="brand-name">Moodprint</div>
          <div className="brand-subtitle">心情制图机</div>
        </div>
      </header>

      <div className="workspace">
        <section className="composer" aria-labelledby="prompt-heading">
          <div className="composer-inner">
            <h1 id="prompt-heading">把此刻，写成一句话。</h1>

            <label className="sr-only" htmlFor="mood-input">
              描述你此刻的心情
            </label>
            <textarea
              id="mood-input"
              value={draft}
              maxLength={60}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') generate()
              }}
              placeholder="例如：今天像一阵经过窗边的风。"
            />
            <div className="character-count" aria-live="polite">
              {draft.length} / 60
            </div>

            <button className="primary-button" type="button" onClick={generate}>
              <SparkIcon size={18} />
              生成我的天气
            </button>

            <p className="privacy-note">
              <LockIcon />
              文字只留在你的浏览器里
            </p>
          </div>
        </section>

        <section className="artwork" aria-labelledby="artwork-heading">
          <div className="artwork-meta">
            <h2 id="artwork-heading">你的情绪天气</h2>
            <span>SEED {seedLabel(generatedText, variant)}</span>
          </div>

          <div className={`canvas-frame${isEntering ? ' is-entering' : ''}`}>
            <MoodCanvas
              ref={canvasRef}
              text={generatedText}
              variant={variant}
              onExported={announceExport}
            />
          </div>

          <div className="secondary-actions">
            <button type="button" onClick={regenerate}>
              <ShuffleIcon />
              换一个宇宙
            </button>
            <button type="button" onClick={() => canvasRef.current?.exportPoster()}>
              <DownloadIcon />
              导出海报
            </button>
          </div>
          <div className="sr-only" aria-live="polite">
            {exportStatus}
          </div>
        </section>
      </div>

      <footer>
        <span />
        <SparkIcon size={15} />
        <p>输入一句话 · 生成 · 保存</p>
        <span />
      </footer>
    </main>
  )
}

export default App
