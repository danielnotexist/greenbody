// The GreenBody brand: the leaf-and-dumbbell mark from the app icon (resources/icon.svg,
// minus its background tile) and the two-tone green wordmark. Both stay green whatever
// accent colour a profile picks — the accent is the user's, the brand is ours.

export function BrandMark({ size = 56 }) {
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="70 120 372 260" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="bm-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--brand-hi)" />
          <stop offset="1" stopColor="var(--brand-lo)" />
        </linearGradient>
        <linearGradient id="bm-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--brand-leaf)" />
          <stop offset="1" stopColor="var(--brand-hi)" />
        </linearGradient>
      </defs>
      <path d="M256 238c-2-46 22-86 74-104 6 52-20 92-74 104z" fill="url(#bm-leaf)" />
      <g fill="url(#bm-g)">
        <rect x="96" y="243" width="320" height="26" rx="13" />
        <rect x="86" y="206" width="34" height="100" rx="14" />
        <rect x="128" y="178" width="44" height="156" rx="16" />
        <rect x="340" y="178" width="44" height="156" rx="16" />
        <rect x="392" y="206" width="34" height="100" rx="14" />
      </g>
    </svg>
  )
}

// A Latin name inside right-to-left text: dir="ltr" keeps "Green" before "Body".
export function Wordmark({ size }) {
  return <span className="brand" dir="ltr" style={size ? { fontSize: size } : null}>
    <span className="brand-a">Green</span><span className="brand-b">Body</span>
  </span>
}
