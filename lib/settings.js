import { browser } from 'wxt/browser'

export const defaultSettings = { samples: 4, seconds: 6 }
export const limits = {
  samples: { min: 1, max: 12 },
  seconds: { min: 1, max: 10 },
}

function normalize(key, value) {
  const { min, max } = limits[key]
  return Number.isInteger(value) && value >= min && value <= max ? value : defaultSettings[key]
}

export function hasSettingsStorage() {
  return Boolean(browser.storage?.local)
}

export async function getSettings() {
  if (!hasSettingsStorage()) return { ...defaultSettings }
  const stored = await browser.storage.local.get(defaultSettings)
  return {
    samples: normalize('samples', stored.samples),
    seconds: normalize('seconds', stored.seconds),
  }
}

export function saveSetting(key, value) {
  return browser.storage?.local?.set({ [key]: normalize(key, value) })
}

export function watchSettings(callback) {
  if (!hasSettingsStorage()) return () => {}
  const onChange = (changes, area) => {
    if (area === 'local' && ('samples' in changes || 'seconds' in changes)) {
      getSettings().then(callback)
    }
  }
  browser.storage.onChanged.addListener(onChange)
  return () => browser.storage.onChanged.removeListener(onChange)
}
