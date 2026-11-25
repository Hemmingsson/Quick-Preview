# Development

[← README](../README.md) · [Architecture](architecture.md)

## Build and load

Use a Node.js version supported by WXT; CI runs Node.js 22. Install the locked dependencies with `npm ci`.

| Command | Result |
| --- | --- |
| `npm run dev` | Start WXT development mode; load the output directory printed by WXT. |
| `npm run build` | Build the production Chrome extension in `.output/chrome-mv3/`. |
| `npm test` | Build the production extension, then run the Node test suite. |
| `npm audit --audit-level=low` | Run the dependency audit used by CI. |

Load the build through **Developer mode → Load unpacked** at `chrome://extensions`. After a production rebuild, reload the extension and refresh SoundCloud. The `src` symlink points to the production output for compatibility; edit the source files below.

## Source map

| Path | Purpose |
| --- | --- |
| [`entrypoints/content.js`](../entrypoints/content.js) | Hover detection, preview lifecycle and main-player handoff |
| [`entrypoints/popup/Popup.svelte`](../entrypoints/popup/Popup.svelte) | Preferences and sample-range illustration |
| [`lib/settings.js`](../lib/settings.js) | Defaults, limits and local browser storage |
| [`lib/samples.js`](../lib/samples.js) | Shared sample timing and visual ranges |
| [`lib/widget.js`](../lib/widget.js) | Embedded-player commands and validated messages |
| [`lib/indicators.js`](../lib/indicators.js) | Progress ring, waveform mask and sample markers |
| [`lib/indicators.css`](../lib/indicators.css) · [`lib/highlights.css`](../lib/highlights.css) | Page overlays and shared sample styling |
| [`wxt.config.js`](../wxt.config.js) | Manifest configuration and extension assets |
| [`test/`](../test/) | Build, sample timing and message isolation tests |

## Theme colors

Page overlays inherit SoundCloud’s CSS custom properties. Use `--special-color` for the accent, `--primary-color` and `--secondary-color` for theme-aware foregrounds, and the `--button-special-*` tokens for the play-button overlay. Derive translucent or darker variants with `color-mix()` instead of introducing unrelated fixed colors.

The played waveform uses a canvas-derived alpha mask with a CSS background color, so changing the page theme also changes an active overlay. If the canvas cannot be exported, the sample markers still work. The popup is a separate extension document and does not inherit SoundCloud’s page variables.

## Verify a change

Run `npm test` and the dependency audit. CI runs both after installing dependencies on Node.js 22.

For changes to playback or indicators, also check these behaviors on SoundCloud:

- Preview a track and a long mix; confirm the markers and ring follow the excerpts.
- Leave during loading and during playback; confirm the preview stops.
- Move between tracks quickly; confirm an older preview cannot take over.
- Preview while the main player is playing, then leave; confirm the same track resumes.
- Click the hovered button; confirm SoundCloud starts the selected track.
- Change preferences and preview again, including a short track.
- Switch between SoundCloud’s light and dark themes while a preview is active.

See the [architecture guide](architecture.md#rebuild-the-figures) for diagram sources and export commands.
