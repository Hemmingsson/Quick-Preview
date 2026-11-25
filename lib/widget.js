// The message format used by https://w.soundcloud.com/player/api.js.
// Scope the listener to one hover so cancelled frames and their callbacks are released.
export function connectWidget(frame, handlers, signal) {
  const origin = 'https://w.soundcloud.com'
  function send(method, value) {
    frame.contentWindow?.postMessage(JSON.stringify({ method, value }), origin)
  }
  window.addEventListener('message', event => {
    if (event.origin !== origin || event.source !== frame.contentWindow) return
    let message
    try {
      message = JSON.parse(event.data)
    } catch {
      return
    }
    if (message?.method === 'ready') {
      for (const eventName of ['finish', 'error']) {
        send('addEventListener', eventName)
      }
      send('getDuration')
    } else if (message && Object.hasOwn(handlers, message.method)) {
      handlers[message.method](message.value)
    }
  }, { signal })
  return {
    seekTo: position => send('seekTo', position),
    play: () => send('play'),
    getPosition: () => send('getPosition'),
  }
}
