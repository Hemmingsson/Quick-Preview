# Using Quick Preview

[← README](../README.md)

## Preview a track

Hover a SoundCloud play button on a track page or supported track card. Keep the pointer over the button while the excerpts play. Leaving the button stops the preview; clicking it starts normal SoundCloud playback.

![The popup controls sample count and duration; waveform markers locate the excerpts and the ring shows total preview progress.](../assets/diagrams/preview-controls.svg)

The ring pulses while playback starts. Once audio advances, it shows progress through all excerpts. Waveform markers identify the selected ranges; the active marker uses SoundCloud’s accent color. Cards without a waveform show a compact strip near the title.

## Change the excerpts

Open Quick Preview from the browser toolbar. **Samples** sets the number of evenly spaced excerpts; **Seconds** sets their requested length. Changes save automatically and apply to the next preview.

The popup uses the most recently previewed track’s duration on the current page when available. Before that, it illustrates the ranges on a 90-second example. Markers have a minimum visible width, so very short excerpts on a long mix remain easy to find.

## Main player behavior

| Action | Result |
| --- | --- |
| Hover while another track is playing | Once the preview starts advancing, pause the main player. |
| Leave the button or finish the final excerpt | Resume the same main track if Quick Preview paused it. |
| Click the hovered button | Stop the preview and let SoundCloud handle the click. |
| Start another preview | Remove the previous preview before starting the next one. |

## Troubleshooting

| Symptom | Try |
| --- | --- |
| Hovering does nothing after installing or reloading | Refresh the SoundCloud tab so the content script can load. |
| “No preview available” appears | Try another track. The widget may fail, playback may be blocked, or the track may not be available to the embedded player. A preview that does not start within 15 seconds is removed. |
| A particular play button does nothing | The extension targets specific SoundCloud track layouts. Site changes or other card types may need an update to the selectors. |
| Preferences cannot be saved | Reload the extension at `chrome://extensions`, then reopen its popup. |
| A source change is missing | Rebuild, reload the extension, then refresh SoundCloud. |

The extension uses SoundCloud’s embedded player and needs a network connection. The automated tests cover build output, sample timing and widget message isolation; they do not verify live playback on SoundCloud.
