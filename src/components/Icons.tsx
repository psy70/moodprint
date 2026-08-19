type IconProps = {
  size?: number
}

export function SparkIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 1.8c.85 6.42 3.78 9.35 10.2 10.2-6.42.85-9.35 3.78-10.2 10.2C11.15 15.78 8.22 12.85 1.8 12 8.22 11.15 11.15 8.22 12 1.8Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ShuffleIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h2.6c4.8 0 5.4 10 10.2 10H20M17 14l3 3-3 3M4 17h2.6c1.6 0 2.7-1.1 3.7-2.7M14.1 9.6c.8-1.5 1.6-2.6 2.7-2.6H20M17 4l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function DownloadIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v11m0 0 4-4m-4 4-4-4M5 15.5V20h14v-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function LockIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10M6 10h12v10H6z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
