function overlay(className) {
  const element = document.createElement('span')
  element.className = className
  element.setAttribute('aria-hidden', 'true')
  return element
}

export function indicators(button, card, title, count) {
  const ring = overlay('qp-ring qp-loading')
  const anchorButton = getComputedStyle(button).position === 'static'
  if (anchorButton) button.classList.add('qp-button-anchor')
  button.append(ring)

  const scene = card.querySelector('.waveform__scene, .waveformWrapper__waveform')
    ?? card.querySelector('.sound__waveform, .fullHero__waveform')
  const host = scene ?? title?.parentElement
  const wave = overlay(scene ? 'qp-wave' : 'qp-wave qp-compact')
  const source = scene?.querySelector('canvas')
  const playedWave = source?.width && source.height ? overlay('qp-played-wave') : null
  const mask = playedWave ? document.createElement('canvas') : null
  if (mask) {
    mask.width = source.width
    mask.height = source.height
  }
  const context = mask?.getContext('2d')
  if (context) {
    // Keep only the waveform's alpha; CSS supplies the live theme color.
    context.drawImage(source, 0, 0)
    try {
      playedWave.style.setProperty('--qp-wave-mask', `url("${mask.toDataURL()}")`)
    } catch {
      // A cross-origin canvas cannot be exported; sample markers still work.
      playedWave.hidden = true
    }
    wave.append(playedWave)
  }
  const needsAnchor = host && getComputedStyle(host).position === 'static'
  if (needsAnchor) host.classList.add('qp-wave-anchor')
  host?.append(wave)

  const segments = []
  let playing
  wave.classList.add('qp-buffering')
  for (let i = 0; i < count; i++) {
    const segment = overlay('qp-segment')
    segment.style.setProperty('--qp-order', i)
    segment.style.left = (100 * (i + 1) / (count + 1)) + '%'
    segments.push(segment)
    wave.append(segment)
  }

  return {
    setSamples(ranges) {
      ranges.forEach((range, i) => {
        segments[i].style.width = range.width * 100 + '%'
      })
    },
    update(progress, position, index) {
      if (playing !== segments[index]) {
        wave.classList.remove('qp-buffering')
        playing?.classList.remove('qp-playing')
        playing = segments[index]
        playing?.classList.add('qp-playing')
      }
      ring.classList.remove('qp-loading')
      ring.style.setProperty('--qp-sweep', progress + 'turn')
      if (context) playedWave.style.clipPath = 'inset(0 ' + (100 * (1 - position)) + '% 0 0)'
    },
    remove() {
      ring.remove()
      if (anchorButton) button.classList.remove('qp-button-anchor')
      wave.remove()
      if (needsAnchor) host.classList.remove('qp-wave-anchor')
    },
  }
}
