// Duration and playback positions use the widget's millisecond timebase.
export function sampleRanges(count, seconds, duration) {
  const interval = duration / (count + 1)
  const length = Math.min(seconds * 1000, interval)
  return Array.from({ length: count }, (_, index) => ({
    start: interval * (index + 1),
    length,
    left: (index + 1) / (count + 1),
    width: length / duration,
  }))
}
