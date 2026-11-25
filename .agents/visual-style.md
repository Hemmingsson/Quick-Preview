# Documentation visuals

Read this when creating or changing a documentation diagram or wireframe.
The project skills use this shared style instead of the global house defaults.

## Composition

Start with the drawing. Keep the canvas close to its content, with enough margin
for labels. No visible sheet title, eyebrow, ID, page counter, title block,
watermark, footer legend or decorative frame. An actual window border belongs
in a UI wireframe. Keep SVG `title` and `desc` for accessibility; they are not
visible headings. Short headings distinguish states in a comparison sheet.

Use monospace for **every** text role: `'SF Mono', ui-monospace, Menlo, monospace`.
Use monochrome fills, line weight and spacing to establish hierarchy. Light
appearance has an explicit white canvas, ink `#050505`, muted text `#626262`,
soft lines `#878787`, fills `#f3f3f3` and `#e8e8e8`. SVG and HTML should also
respond to `prefers-color-scheme: dark`, with coordinated paper, ink, fills,
icons and lines. PNG is the static light export. Keep dark colours in shared
CSS variables; test both appearances rather than inverting a finished image.

Typical wireframe weights: outer/structural lines 1–1.4 px, leaders 0.7–0.8 px,
slot outlines 0.8 px. Use rounded dash caps with `3 4` spacing for slots and
lifelines. Preserve purposeful differences such as empty-state outlines.
Use the existing generator's proportions when extending a figure.

## Words carry one job

Label a concept once, where the reader needs it. Use the real control label or
one callout; do not repeat it inside the region, outside it, in a caption and
in a tooltip. A slider labelled “Samples” needs no separate “Sample count” callout.
Use one representative track and show the active sample clearly.

Keep implementation labels such as FLEX, HUG and FILL out of the drawing.
Omit tooltips that repeat visible labels. If hover adds necessary information,
make that fact available in the static diagram or nearby documentation too.
An accessible description may explain the visual without adding visible copy.
Use short, direct wording and the repository's terms. A node subtitle, branch
label or state note must add a fact that its main label does not already convey.

## Files and delivery

- Editable specs, generators and configuration: `demo/diagrams/`.
- Matching SVG, HTML and PNG exports: `assets/diagrams/<slug>.*`.
- Inline SVG where it explains the section, e.g.
  `![Hover playback sequence](../assets/diagrams/preview-sequence.svg)` in `docs/`.
  README paths start with `assets/`. Use concise, meaningful alt text.
- Retain HTML for viewing and PNG for static sharing. Do not add “The diagram
  shows…” link paragraphs or separate interactive-view links to the docs.

Before completion, inspect the output at its documentation size, check light
and dark SVG/HTML, parse the SVG, and check all affected relative links and
`git diff --check`. Confirm there is no clipped text, overlapping leader or
unexplained arrow. Keep edits in generators/specs so regeneration preserves them.
