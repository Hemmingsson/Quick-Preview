import assert from 'node:assert/strict'
import test from 'node:test'
import { sampleRanges } from '../lib/samples.js'
import { connectWidget } from '../lib/widget.js'

test('start points and visual ranges agree for an eight-second excerpt on a two-hour mix', () => {
  const duration = 2 * 60 * 60 * 1000
  const ranges = sampleRanges(4, 8, duration)
  assert.deepEqual(ranges.map(range => range.left), [0.2, 0.4, 0.6, 0.8])
  for (const range of ranges) {
    assert.equal(range.start, range.left * duration)
    assert.equal(range.length, 8000)
    assert.equal(range.width, range.length / duration)
  }
})

test('samples on a short track stay within the playable duration', () => {
  const ranges = sampleRanges(4, 6, 5000)
  assert.deepEqual(ranges.map(range => range.length), [1000, 1000, 1000, 1000])
  assert.equal(ranges.at(-1).start + ranges.at(-1).length, 5000)
})

test('only the active widget frame can advance the preview', t => {
  const origin = 'https://w.soundcloud.com'
  const events = new EventTarget()
  globalThis.window = events
  t.after(() => { delete globalThis.window })

  function reportPosition(source, value, senderOrigin = origin) {
    const event = Object.assign(new Event('message'), {
      origin: senderOrigin, source, data: JSON.stringify({ method: 'getPosition', value }),
    })
    events.dispatchEvent(event)
  }

  const positions = []
  const handlers = { getPosition: value => positions.push(value) }
  const first = { contentWindow: {} }
  const next = { contentWindow: {} }
  const firstHover = new AbortController()
  const nextHover = new AbortController()

  connectWidget(first, handlers, firstHover.signal)
  reportPosition(first.contentWindow, 100)
  firstHover.abort()

  connectWidget(next, handlers, nextHover.signal)
  reportPosition(first.contentWindow, 200)
  reportPosition(next.contentWindow, 300, 'https://soundcloud.com')
  reportPosition(next.contentWindow, 400)
  nextHover.abort()
  reportPosition(next.contentWindow, 500)

  assert.deepEqual(positions, [100, 400])
})
