<script>
  import { browser } from 'wxt/browser'
  import { sampleRanges } from '../../lib/samples.js'
  import '../../lib/highlights.css'
  import { onMount } from 'svelte'
  import { defaultSettings, getSettings, hasSettingsStorage, limits, saveSetting } from '../../lib/settings.js'
  import waveform from './waveform.png'

  let settings = $state({ ...defaultSettings })
  const storageAvailable = hasSettingsStorage()
  let duration = $state(90000)
  let ready = $state(false)
  const controls = [
    { key: 'samples', label: 'Samples' },
    { key: 'seconds', label: 'Seconds' },
  ]

  onMount(async () => {
    settings = await getSettings()
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true }).catch(() => [])
    if (tab?.id != null) {
      // Other pages and tabs opened before extension reload have no receiver.
      const value = await browser.tabs.sendMessage(tab.id, { type: 'quick-preview-duration' }).catch(() => null)
      if (Number.isFinite(value) && value > 0) duration = value
    }
    ready = true
  })

  function update(key, event) {
    const value = event.currentTarget.valueAsNumber
    settings[key] = value
    saveSetting(key, value)
  }
</script>

<main>
  <h1>
    <svg aria-hidden="true" viewBox="0 0 24 16" fill="none" stroke="currentColor" stroke-width="1.6">
      <path d="M0 4h14m5 0h5M0 12h4m5 0h15" />
      <circle cx="16.5" cy="4" r="2.4" /><circle cx="6.5" cy="12" r="2.4" />
    </svg>
    Preference
  </h1>

  <div class="preview" aria-hidden="true">
    <div class="wave">
      <img src={waveform} alt="" />
      {#each ready ? sampleRanges(settings.samples, settings.seconds, duration) : [] as range}
        <i class="qp-segment" style:left={range.left * 100 + '%'} style:width={range.width * 100 + '%'}></i>
      {/each}
    </div>
  </div>

  {#if !storageAvailable}
    <p>Reload Quick Preview in Chrome’s extensions page to enable saved preferences.</p>
  {/if}
  <section aria-label="Preview settings">
    {#each controls as { key, label }}
      <div class="control">
        <label for={key}>{label}</label><output for={key}>{settings[key]}</output>
        <input id={key} type="range" min={limits[key].min} max={limits[key].max}
               value={settings[key]} disabled={!ready || !storageAvailable}
               oninput={(event) => update(key, event)} />
      </div>
    {/each}
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    width: 290px;
    font-family: Arial, sans-serif;
    color: white;
    background: transparent;
  }
  main {
    border-radius: 18px;
    corner-shape: superellipse(2);
    overflow: clip;
    padding: 0 9px 25px;
    background: linear-gradient(153deg, #ff914e, #ff5909);
  }
  h1 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 0 0 8px;
    height: 58px;
    font-size: 16px;
    font-weight: 500;
    border-bottom: 1px solid rgb(255 255 255 / 28%);
  }
  h1 svg { width: 19px; }
  .preview {
    display: grid;
    align-items: center;
    padding: 0 9px;
    height: 131px;
    background: #ffa879;
    border-radius: 12px;
    corner-shape: superellipse(2);
    box-shadow: 0 7px 14px rgb(157 59 10 / 22%);
  }
  .wave { position: relative; }
  img { display: block; width: 100%; }
  section { display: grid; gap: 16px; margin: 26px 19px 0; }
  .control {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    font: 14px/1.3 ui-monospace, monospace;
  }
  output { font-weight: bold; }
  input {
    appearance: none;
    border: 0;
    grid-column: 1 / -1;
    width: 100%;
    height: 24px;
    margin: 2px 0 0;
    cursor: pointer;
    background: transparent;
  }
  input:focus-visible { outline: 2px solid #592000; outline-offset: 3px; }
  input::-webkit-slider-runnable-track { height: 4px; background: #ffaa79; border-radius: 2px; }
  input::-moz-range-track { height: 4px; background: #ffaa79; border-radius: 2px; }
  input::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    margin-top: -8px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 3px 6px rgb(142 53 14 / 30%);
  }
  input::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border: 0;
    border-radius: 50%;
    background: white;
    box-shadow: 0 3px 6px rgb(142 53 14 / 30%);
  }
  @media (prefers-contrast: more) and (forced-colors: none) {
    main { color: #321100; }
    input::-webkit-slider-runnable-track { background: #592000; }
    input::-moz-range-track { background: #592000; }
  }
  @media (forced-colors: active) {
    input { appearance: auto; }
    input:focus-visible { outline-color: Highlight; }
    input::-webkit-slider-thumb { appearance: auto; }
  }
</style>
