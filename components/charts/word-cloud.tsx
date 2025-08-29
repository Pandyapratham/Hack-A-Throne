"use client"

type Props = { words: Record<string, number> }

export function WordCloud({ words }: Props) {
  const entries = Object.entries(words)
  const max = Math.max(...entries.map(([, v]) => v))
  const min = Math.min(...entries.map(([, v]) => v))
  const scale = (v: number) => {
    if (max === min) return 1
    return 0.7 + ((v - min) / (max - min)) * 1.1 // font scale 0.7x..1.8x
  }
  return (
    <div className="p-4 border rounded-xl bg-card">
      <div className="flex flex-wrap gap-3">
        {entries.map(([word, count]) => (
          <span
            key={word}
            className="select-none"
            style={{ fontSize: `${Math.round(scale(count) * 1.0 * 16)}px`, color: "var(--muted-foreground)" }}
            aria-label={`${word} (${count})`}
            title={`${word} (${count})`}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  )
}
