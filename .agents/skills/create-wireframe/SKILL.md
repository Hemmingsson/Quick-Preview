---
name: create-wireframe
description: Create or refine UI wireframes and visual feature documentation for this repository. Use for window layouts, controls, and comparisons of visible UI states.
---

# Create a documentation wireframe

Use this project copy in preference to the global skill of the same name.
For behaviour, dependencies or message order, use
[create-diagram](../create-diagram/SKILL.md).

1. Read [the shared visual style](../../visual-style.md) and inspect the current
   exports under `assets/diagrams/` before adding a sheet.
2. Check the actual popup in `entrypoints/popup/Popup.svelte` and the injected
   UI in `lib/indicators.js`, `lib/indicators.css`, and `lib/highlights.css`.
   Verify when each state occurs against `entrypoints/content.js`.
3. Extend `demo/diagrams/build-wireframes.py`. Reuse the generator’s drawing
   primitives and shared theme. Keep editable geometry in the generator.
4. Draw the popup and hover states using their real labels and controls.
   Use one representative track. Show the loading, active-sample, or cleanup
   state only when it answers the reader’s question.
5. Keep callouts short. Draw the visible play shape, progress ring, waveform
   and sample markers as vector geometry. Describe motion with a still that
   makes the active sample identifiable without animation.
6. Run from the repository root:

   ```sh
   python3 demo/diagrams/build-wireframes.py
   python3 demo/diagrams/style-diagrams.py
   ```

   The second command needs `resvg` and refreshes PNGs. Inspect the generated
   SVG/HTML as well as the PNG: a PNG alone cannot prove theme support.
7. Apply the shared delivery and verification checks. Regeneration may touch
   unrelated exports; inspect the diff and retain only intended changes. The
   result is complete when the relevant document embeds the SVG and the
   source reproduces it without reintroducing titles or redundant annotations.
