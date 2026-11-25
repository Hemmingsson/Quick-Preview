import { browser } from 'wxt/browser'
import { sampleRanges } from '../lib/samples.js'
import { defineContentScript } from 'wxt/utils/define-content-script'
import { connectWidget } from '../lib/widget.js'
import { defaultSettings, getSettings, watchSettings } from '../lib/settings.js'
import { indicators } from '../lib/indicators.js'
import '../lib/indicators.css'

const cards = '.fullListenHero, .soundBadge, .sound__body, .chartTrack, .audibleTile, .trackItem'
const titles = 'a.soundTitle__title, a.audibleTile__heading, .chartTrack__title a, a.soundBadge__titleLink, a.trackItem__trackTitle'
let active
let lastTrack

function preview(button, card, title, url, { samples, seconds }) {
  active?.stop()
  const frame = document.createElement('iframe')
  frame.title = 'SoundCloud preview'
  frame.allow = 'autoplay; encrypted-media'
  frame.className = 'qp-player'
  frame.tabIndex = -1
  frame.setAttribute('aria-hidden', 'true')
  const display = indicators(button, card, title, samples)
  frame.src = 'https://w.soundcloud.com/player/?single_active=false&url=' + encodeURIComponent(url)
  const session = { stop }
  active = session
  const controller = new AbortController()
  const options = { signal: controller.signal }
  let pausedTrack
  let started = false
  let positionPoll
  let sampleIndex = 0
  let ranges
  let trackDuration
  let lastSeek = 0
  const originalTitle = button.getAttribute('title')
  // An empty title also suppresses the native tooltip inherited from the track card.
  button.title = ''
  const observer = new MutationObserver(() => {
    if (!button.isConnected) stop()
  })
  observer.observe(document.body, { subtree: true, childList: true })
  let timer = setTimeout(failed, 15000)

  function failed() {
    if (active !== session) return
    stop()
    if (!title || title.nextElementSibling?.classList.contains('qp-error')) return
    const label = document.createElement('span')
    label.className = 'qp-error'
    label.textContent = '😵 No preview available'
    const previousDisplay = title.style.display
    title.style.display = 'none'
    title.after(label)
    setTimeout(() => {
      label.remove()
      title.style.display = previousDisplay
    }, 2000)
  }

  function stop() {
    if (active !== session) return
    active = null
    controller.abort()
    clearTimeout(timer)
    clearInterval(positionPoll)
    observer.disconnect()
    if (button.title === '') {
      if (originalTitle === null) button.removeAttribute('title')
      else button.title = originalTitle
    }
    display.remove()
    frame.remove()
    if (pausedTrack && pausedTrack === document.querySelector('.playbackSoundBadge__titleLink')?.href) {
      document.querySelector('.playControl:not(.playing)')?.click()
    }
  }

  button.addEventListener('pointerleave', stop, options)
  // A click hands playback to SoundCloud; resuming the old track here starts it a second time.
  button.addEventListener('click', () => {
    pausedTrack = null
    stop()
  }, { ...options, capture: true })
  window.addEventListener('pagehide', stop, options)
  document.body.append(frame)
  const widget = connectWidget(frame, {
    error: failed,
    finish: stop,
    getDuration(duration) {
      if (ranges || !Number.isFinite(duration) || duration <= 0) return
      trackDuration = duration
      lastTrack = { page: location.href, duration }
      ranges = sampleRanges(samples, seconds, duration)
      display.setSamples(ranges)
      widget.seekTo(ranges[0].start)
      widget.play()
      positionPoll = setInterval(widget.getPosition, 250)
    },
    getPosition(currentPosition) {
      if (!ranges || !Number.isFinite(currentPosition)) return
      // The widget can reset a seek made before its media starts playing.
      const { start: target, length } = ranges[sampleIndex]
      if (currentPosition < target - 100) {
        if (performance.now() - lastSeek > 500) {
          widget.seekTo(target)
          lastSeek = performance.now()
        }
        return
      }
      const fraction = Math.max(0, Math.min(1, (currentPosition - target) / length))
      // A blocked widget can report a seek position before audio actually advances.
      if (!started) {
        if (currentPosition <= target + 10) return
        started = true
        clearTimeout(timer)
        timer = setTimeout(stop, samples * seconds * 1000 + 20000)
        const main = document.querySelector('.playControl.playing')
        if (main) {
          pausedTrack = document.querySelector('.playbackSoundBadge__titleLink')?.href
          if (pausedTrack) main.click()
        }
      }
      display.update((sampleIndex + fraction) / samples, currentPosition / trackDuration, sampleIndex)
      if (currentPosition < target + length) return
      sampleIndex++
      if (sampleIndex === ranges.length) return stop()
      lastSeek = performance.now()
      widget.seekTo(ranges[sampleIndex].start)
    },
  }, controller.signal)
}

export default defineContentScript({
  matches: ['https://soundcloud.com/*'],
  async main(ctx) {
    function reportDuration(message, sender, respond) {
      if (message?.type === 'quick-preview-duration') {
        respond(lastTrack?.page === location.href ? lastTrack.duration : null)
      }
    }
    browser.runtime.onMessage.addListener(reportDuration)
    let settings = defaultSettings
    const unwatch = watchSettings(value => { settings = value })
    ctx.onInvalidated(() => {
      browser.runtime.onMessage.removeListener(reportDuration)
      unwatch()
      active?.stop()
    })
    settings = await getSettings()
    ctx.addEventListener(document, 'pointerover', event => {
      const button = event.target.closest?.('.sc-button-play:not(.sc-button-pause)')
      if (!button || button.contains(event.relatedTarget)) return
      const card = button.closest(cards)
      if (!card) return
      const title = card.querySelector(titles) ?? card.querySelector('h1')
      const url = card.matches('.fullListenHero') ? location.href : title?.href
      if (url && new URL(url).origin === location.origin) preview(button, card, title, url, settings)
    }, { capture: true })
  },
})
