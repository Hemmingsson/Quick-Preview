# Quick Preview architecture

[← README](../README.md) · [Usage](usage.md) · [Development](development.md)

Hovering a SoundCloud play button auditions a track in a separate embedded player. The page’s own player keeps its place in the queue.

## What the listener sees

![The Preference popup sets four six-second samples. The track waveform marks all four excerpts and the ring shows overall progress.](../assets/diagrams/preview-controls.svg)

The popup saves **Samples** and **Seconds** in browser storage. Both views calculate the same ranges. For example, four six-second samples on a five-minute track start at **1:00, 2:00, 3:00 and 4:00**. On short tracks, each excerpt ends before the next one begins. A 20 px minimum keeps a long mix’s markers visible without changing the audio timing.

## Where the work happens

![The popup and hover controller use shared settings and sample ranges. The controller draws the indicators and talks to the embedded SoundCloud widget.](../assets/diagrams/extension-map.svg)

Follow an arrow to the component it uses. The widget handles audio from the track’s public URL. The extension needs no API key or backend. Each hover gets its own frame, and messages must match both that frame and the widget’s origin.

## What happens on hover

![A hover creates the markers and widget. After the duration arrives, Quick Preview seeks, plays and polls until playback advances. It can then pause the main track and update the preview.](../assets/diagrams/preview-sequence.svg)

| When the preview ends | What happens to the main player |
|---|---|
| Pointer leaves or the last sample finishes | Resume the same track if Quick Preview paused it. |
| Listener clicks the hovered play button | SoundCloud handles the click and starts the selected track. |
| Widget fails or takes 15 seconds to start | Remove the preview and briefly show “No preview available”. |

Stopping removes the iframe, indicators, timers and message listener. A late reply from a previous hover cannot take control of the current preview.

## Where to make a change

| Change | Source |
|---|---|
| Popup controls or saved preferences | [Popup.svelte](../entrypoints/popup/Popup.svelte) · [settings.js](../lib/settings.js) |
| Sample timing in both views | [samples.js](../lib/samples.js) |
| Waveform highlights or progress ring | [indicators.js](../lib/indicators.js) · [highlights.css](../lib/highlights.css) · [indicators.css](../lib/indicators.css) |
| Playback, cancellation or widget messages | [content.js](../entrypoints/content.js) · [widget.js](../lib/widget.js) |

<details>
<summary id="rebuild-the-figures">Rebuild the figures</summary>

The [diagram sources](../demo/diagrams/) use SeeCode for technical diagrams and Python for the wireframe. Install `resvg`, then set `SEECODE_CLI` to your SeeCode skill’s `scripts/seecode.mjs` and run these commands from the repository root.

```sh
cd demo/diagrams
for diagram in extension-map preview-sequence; do
  node "$SEECODE_CLI" render "$diagram.json"
  node "$SEECODE_CLI" export "../../assets/diagrams/$diagram.html" --formats svg
done
python3 build-wireframes.py
python3 style-diagrams.py
```

The [export directory](../assets/diagrams/) contains adaptive SVG and HTML figures plus light-mode PNGs.

</details>
