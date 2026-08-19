import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { createScene, drawScene } from '../lib/scene'

export type MoodCanvasHandle = {
  exportPoster: () => void
}

type MoodCanvasProps = {
  text: string
  variant: number
  onExported: () => void
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const lines: string[] = []
  let current = ''

  for (const character of text) {
    const next = current + character
    if (context.measureText(next).width > maxWidth && current) {
      lines.push(current)
      current = character
    } else {
      current = next
    }
  }

  if (current) lines.push(current)
  return lines.slice(0, 3)
}

export const MoodCanvas = forwardRef<MoodCanvasHandle, MoodCanvasProps>(
  function MoodCanvas({ text, variant, onExported }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const scene = useMemo(() => createScene(text, variant), [text, variant])

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const context = canvas.getContext('2d')
      if (!context) return

      let animationFrame = 0
      let width = 0
      let height = 0
      let ratio = 1

      const resize = () => {
        const bounds = canvas.getBoundingClientRect()
        width = Math.max(1, bounds.width)
        height = Math.max(1, bounds.height)
        ratio = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = Math.round(width * ratio)
        canvas.height = Math.round(height * ratio)
      }

      const render = (time: number) => {
        context.setTransform(ratio, 0, 0, ratio, 0, 0)
        drawScene(context, width, height, scene, time)
        animationFrame = window.requestAnimationFrame(render)
      }

      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(canvas)
      resize()
      animationFrame = window.requestAnimationFrame(render)

      return () => {
        resizeObserver.disconnect()
        window.cancelAnimationFrame(animationFrame)
      }
    }, [scene])

    useImperativeHandle(ref, () => ({
      exportPoster() {
        const exportCanvas = document.createElement('canvas')
        exportCanvas.width = 1080
        exportCanvas.height = 1080
        const context = exportCanvas.getContext('2d')
        if (!context) return

        drawScene(context, 1080, 1080, scene, 6800)

        const shade = context.createLinearGradient(0, 620, 0, 1080)
        shade.addColorStop(0, 'transparent')
        shade.addColorStop(0.46, 'rgba(3, 9, 17, 0.74)')
        shade.addColorStop(1, 'rgba(3, 9, 17, 0.96)')
        context.fillStyle = shade
        context.fillRect(0, 560, 1080, 520)

        context.fillStyle = '#f1d6b5'
        context.font = '500 50px "Songti SC", "STSong", Georgia, serif'
        const lines = wrapText(context, text, 830)
        lines.forEach((line, index) => {
          context.fillText(line, 92, 800 + index * 70)
        })

        context.fillStyle = 'rgba(241, 214, 181, 0.68)'
        context.font = '500 23px Arial, sans-serif'
        context.letterSpacing = '3px'
        context.fillText('MOODPRINT  ·  心情制图机', 92, 1000)

        exportCanvas.toBlob((blob) => {
          if (!blob) return

          const link = document.createElement('a')
          const objectUrl = URL.createObjectURL(blob)
          link.download = `moodprint-${Date.now()}.png`
          link.href = objectUrl
          link.hidden = true
          document.body.append(link)
          link.click()
          link.remove()
          onExported()
          window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
        }, 'image/png')
      },
    }), [onExported, scene, text])

    return (
      <canvas
        ref={canvasRef}
        className="mood-canvas"
        aria-label={`根据“${text}”生成的情绪天气动画`}
      />
    )
  },
)
