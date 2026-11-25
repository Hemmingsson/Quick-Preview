---
name: create-diagram
description: Create or refine technical documentation diagrams for this repository. Use for module dependencies, refresh sequences, decisions, state transitions and other explanations of system behaviour.
---

# Create a documentation diagram

Use this project copy in preference to the global skill of the same name.
For UI layouts and visible feature states, use
[create-wireframe](../create-wireframe/SKILL.md).

1. Read [the shared visual style](../../visual-style.md). Write down the one
   reader question and the document section where the answer belongs. Reuse a
   current diagram when it already answers that question.
2. Verify each arrow against the extension source. Use the extension map and
   playback sequence in `demo/diagrams/` as templates. Check browser boundaries
   against `wxt.config.js`, hover and cancellation against
   `entrypoints/content.js`, and player messages against `lib/widget.js`.
   A dependency arrow means “depends on”; a sequence arrow means a message or
   action. Preserve the distinction between the host page's player and the
   embedded preview player.
3. Locate the installed `seecode` skill and read its spec and selected type
   reference. Use its `scripts/seecode.mjs` CLI for layout, not Mermaid or
   manually positioned technical SVG. The engine is an external dependency;
   do not pretend this repository bundles it. If unavailable, report that
   rendering is blocked and preserve the editable JSON work.
4. Save the JSON under `demo/diagrams/`. Keep the existing project config:
   watermark and controls off. Use monospace styling from the shared guide.
   Keep a meaningful metadata title for accessibility, with empty eyebrow
   and no visible header in the delivered figure. Short node names and
   purposeful branch labels should explain the path without hover. Use
   subtitles only for additional facts. Static exports must show the complete
   diagram, with animation and moving tokens disabled.
5. From `demo/diagrams/`, run the installed CLI (replace `<seecode>` with its
   discovered directory):

   ```sh
   node <seecode>/scripts/seecode.mjs render <slug>.json
   node <seecode>/scripts/seecode.mjs export ../../assets/diagrams/<slug>.html --formats svg
   ```

   Inspect the returned paths. Export the diagram itself, excluding the
   generated page header. Fix source layout warnings and inspect arrow routing,
   label spacing and canvas bounds. Read the CLI help when its interface differs.
6. Run `python3 demo/diagrams/style-diagrams.py` from the repository root to
   apply the documentation style and regenerate HTML/PNG. This script currently
   lists the technical diagram slugs explicitly: add a new slug when adding a
   diagram. It needs `resvg`. Extend its shared CSS for adaptive appearance;
   do not let its fixed light colours overwrite dark-theme support. Keep
   styling changes in this repeatable step rather than editing exports alone.
7. Apply the shared delivery and verification checks. Done means the correct
   SVG is embedded beside the relevant explanation, sources regenerate the
   exports, and the visible diagram is understandable without tooltips or
   duplicate prose. Report what changed and any unverified rendering step.
