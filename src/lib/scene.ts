import { hashText, mulberry32 } from './random'

type Palette = {
  skyTop: string
  skyBottom: string
  horizon: string
  mist: string
  spark: string
  mountain: string
}

type Particle = {
  x: number
  y: number
  size: number
  alpha: number
  speed: number
  drift: number
}

type Mist = {
  x: number
  y: number
  radius: number
  alpha: number
  speed: number
}

type Scene = {
  palette: Palette
  rain: Particle[]
  sparks: Particle[]
  mist: Mist[]
  ridge: number[]
  mood: number
}

const PALETTES: Palette[] = [
  {
    skyTop: '#050d18',
    skyBottom: '#142d45',
    horizon: '#df7662',
    mist: '#a7b7c6',
    spark: '#f1b46f',
    mountain: '#071321',
  },
  {
    skyTop: '#100d1e',
    skyBottom: '#3a2542',
    horizon: '#f29c73',
    mist: '#c3afc9',
    spark: '#f7d08a',
    mountain: '#170f24',
  },
  {
    skyTop: '#071418',
    skyBottom: '#183e3b',
    horizon: '#c89066',
    mist: '#aac6bd',
    spark: '#efc37c',
    mountain: '#081a1c',
  },
  {
    skyTop: '#111218',
    skyBottom: '#403632',
    horizon: '#e87f61',
    mist: '#c6beb5',
    spark: '#f2bd6f',
    mountain: '#15151a',
  },
]

function choosePalette(text: string, seed: number) {
  if (/蓝|雨|海|冷/.test(text)) return PALETTES[0]
  if (/紫|梦|夜/.test(text)) return PALETTES[1]
  if (/绿|风|树|安静/.test(text)) return PALETTES[2]
  if (/火|暖|太阳|橙/.test(text)) return PALETTES[3]
  return PALETTES[seed % PALETTES.length]
}

export function createScene(text: string, variant: number): Scene {
  const seed = hashText(`${text}:${variant}`)
  const random = mulberry32(seed)
  const mood = random()
  const rainCount = /雨|难过|累|慢/.test(text) ? 105 : 62
  const sparkCount = /暖|开心|光|好/.test(text) ? 76 : 42

  const particle = (): Particle => ({
    x: random(),
    y: random(),
    size: 0.4 + random() * 1.8,
    alpha: 0.18 + random() * 0.58,
    speed: 0.12 + random() * 0.42,
    drift: random() * 2 - 1,
  })

  return {
    palette: choosePalette(text, seed),
    rain: Array.from({ length: rainCount }, particle),
    sparks: Array.from({ length: sparkCount }, particle),
    mist: Array.from({ length: 7 }, () => ({
      x: random(),
      y: 0.22 + random() * 0.52,
      radius: 0.18 + random() * 0.32,
      alpha: 0.035 + random() * 0.055,
      speed: 0.005 + random() * 0.012,
    })),
    ridge: Array.from({ length: 14 }, () => 0.62 + random() * 0.07),
    mood,
  }
}

function drawRidge(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: Scene,
) {
  const { ridge, palette } = scene
  context.beginPath()
  context.moveTo(0, height)
  context.lineTo(0, ridge[0] * height)
  ridge.forEach((point, index) => {
    context.lineTo((index / (ridge.length - 1)) * width, point * height)
  })
  context.lineTo(width, height)
  context.closePath()

  const mountainGradient = context.createLinearGradient(0, height * 0.56, 0, height)
  mountainGradient.addColorStop(0, `${palette.mountain}e8`)
  mountainGradient.addColorStop(1, '#030912')
  context.fillStyle = mountainGradient
  context.fill()
}

function drawWater(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: Scene,
  time: number,
) {
  const start = height * 0.7
  context.save()
  context.globalAlpha = 0.22
  context.strokeStyle = scene.palette.horizon
  context.lineWidth = 1

  for (let row = 0; row < 18; row += 1) {
    const y = start + row * (height * 0.017)
    const offset = Math.sin(time * 0.0003 + row) * 14
    context.beginPath()
    context.moveTo(width * 0.14 + offset, y)
    context.lineTo(width * (0.46 + (row % 3) * 0.08) + offset, y)
    context.stroke()
  }
  context.restore()
}

export function drawScene(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: Scene,
  time = 0,
) {
  const { palette, mood } = scene
  context.clearRect(0, 0, width, height)

  const sky = context.createLinearGradient(0, 0, 0, height)
  sky.addColorStop(0, palette.skyTop)
  sky.addColorStop(0.7, palette.skyBottom)
  sky.addColorStop(1, '#050c14')
  context.fillStyle = sky
  context.fillRect(0, 0, width, height)

  const horizon = context.createLinearGradient(0, height * 0.48, 0, height * 0.78)
  horizon.addColorStop(0, 'transparent')
  horizon.addColorStop(0.48, `${palette.horizon}b8`)
  horizon.addColorStop(0.7, `${palette.horizon}68`)
  horizon.addColorStop(1, 'transparent')
  context.fillStyle = horizon
  context.fillRect(0, height * 0.42, width, height * 0.4)

  scene.mist.forEach((mist, index) => {
    const x = ((mist.x + time * mist.speed * 0.0001 + index * 0.04) % 1.4 - 0.2) * width
    const radius = mist.radius * width
    const fog = context.createRadialGradient(x, mist.y * height, 0, x, mist.y * height, radius)
    fog.addColorStop(0, `${palette.mist}${Math.round(mist.alpha * 255).toString(16).padStart(2, '0')}`)
    fog.addColorStop(1, 'transparent')
    context.fillStyle = fog
    context.fillRect(x - radius, mist.y * height - radius, radius * 2, radius * 2)
  })

  context.save()
  context.strokeStyle = `${palette.mist}9c`
  context.lineCap = 'round'
  scene.rain.forEach((drop) => {
    const y = ((drop.y + time * drop.speed * 0.00007) % 1.18) * height
    const x = (drop.x + Math.sin(time * 0.0002 + drop.drift) * 0.008) * width
    context.globalAlpha = drop.alpha * (0.65 + mood * 0.35)
    context.lineWidth = Math.max(0.6, width / 900)
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x + drop.drift * 1.8, y + height * (0.022 + drop.size * 0.006))
    context.stroke()
  })
  context.restore()

  context.save()
  scene.sparks.forEach((spark) => {
    const pulse = 0.68 + Math.sin(time * 0.0015 + spark.x * 20) * 0.28
    context.globalAlpha = spark.alpha * pulse
    context.fillStyle = palette.spark
    context.beginPath()
    context.arc(spark.x * width, spark.y * height * 0.72, spark.size * Math.max(0.8, width / 760), 0, Math.PI * 2)
    context.fill()
  })
  context.restore()

  drawRidge(context, width, height, scene)
  drawWater(context, width, height, scene, time)

  const vignette = context.createRadialGradient(
    width * 0.5,
    height * 0.46,
    width * 0.12,
    width * 0.5,
    height * 0.5,
    width * 0.75,
  )
  vignette.addColorStop(0, 'transparent')
  vignette.addColorStop(1, 'rgba(0, 5, 12, 0.62)')
  context.fillStyle = vignette
  context.fillRect(0, 0, width, height)
}
