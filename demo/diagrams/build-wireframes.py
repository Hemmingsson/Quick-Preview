#!/usr/bin/env python3
"""Draw the popup and hover state from entrypoints/popup/Popup.svelte and lib/indicators.js."""
from html import escape
from math import cos, sin
from pathlib import Path

from theme import theme_css


OUTPUT = Path(__file__).resolve().parents[2] / "assets" / "diagrams"
SLUG = "preview-controls"
TITLE = "Quick Preview controls"
DESCRIPTION = ("The Preference popup sets four six-second samples. On the SoundCloud "
               "track, four underlines mark their start points; sample two is active. "
               "The play-button ring shows progress across all four samples.")
CSS = """
svg{display:block;background:var(--sc-paper);font-family:'SF Mono',ui-monospace,Menlo,monospace}
text{fill:var(--sc-ink);font-size:14px}
.heading{font-size:18px;font-weight:600}
.detail{font-size:13px;fill:var(--sc-muted)}
.panel{fill:var(--sc-paper);stroke:var(--sc-ink);stroke-width:1.3}
.card{fill:var(--sc-fill);stroke:var(--sc-border);stroke-width:1}
.bar{fill:var(--sc-soft)}.mark{fill:var(--sc-muted)}.active{fill:var(--sc-ink)}
.pale{fill:var(--sc-fill2)}.knob{fill:var(--sc-paper);stroke:var(--sc-ink);stroke-width:1.2}
.line,.leader,.progress{fill:none;stroke:var(--sc-ink);stroke-linecap:round;stroke-linejoin:round}
.leader{stroke:var(--sc-soft);stroke-width:.8}.progress{stroke:var(--sc-paper);stroke-width:3.5}
"""


class Sheet:
    def __init__(self):
        self.parts = []

    def rect(self, x, y, width, height, style, radius=0):
        self.parts.append(f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="{radius}" class="{style}"/>')

    def text(self, x, y, value, style="", anchor="start"):
        self.parts.append(f'<text x="{x}" y="{y}" class="{style}" text-anchor="{anchor}">{escape(value)}</text>')

    def path(self, data, style="line"):
        self.parts.append(f'<path d="{data}" class="{style}"/>')

    def circle(self, x, y, radius, style):
        self.parts.append(f'<circle cx="{x}" cy="{y}" r="{radius}" class="{style}"/>')

    def save(self):
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="920" height="364" '
               f'viewBox="0 0 920 364" role="img" aria-labelledby="title desc">'
               f'<title id="title">{TITLE}</title><desc id="desc">{DESCRIPTION}</desc>'
               f'<style>{CSS}{theme_css("svg")}</style><rect width="100%" height="100%" '
               'fill="var(--sc-paper)"/>' + ''.join(self.parts) + '</svg>\n')
        OUTPUT.mkdir(parents=True, exist_ok=True)
        (OUTPUT / f"{SLUG}.svg").write_text(svg)
        (OUTPUT / f"{SLUG}.html").write_text(
            '<!doctype html><html lang="en"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<title>{TITLE}</title><style>body{{margin:0}}svg{{max-width:100%;height:auto}}</style>'
            f'</head><body><main>{svg}</main></body></html>\n')


def wave(s, x, y, width, height, reflected=False):
    # Flickermood runs 213.89 seconds. Both views impose
    # the extension's 20px visual minimum, scaled to this 80% popup drawing.
    for i in range(width // 4):
        h = max(2, round(height * (.14 + .5 * abs(sin(i / 6.8) * cos(i / 20))
                                   + .28 * abs(sin(i * 2.2)))))
        s.rect(x + 4 * i, y - h, 3, h, "bar")
        if reflected:
            s.rect(x + 4 * i, y + 1, 3, max(1, int(h / 3)), "pale")
    for i in range(1, 5):
        start = x + width * i / 5
        size = max(16, width * 6 / 213.89)
        if reflected and i == 2:
            s.parts.append(f'<rect x="{start}" y="{y-height}" width="{size}" height="{height}" fill="url(#fade)"/>')
        s.rect(start, y + 1, size, 4, "active" if reflected and i == 2 else "mark", 1)


def slider(s, y, name, value, maximum):
    s.text(45, y, name)
    s.text(241, y, str(value), anchor="end")
    s.rect(45, y + 14, 196, 3, "bar", 1.5)
    s.circle(round(45 + 196 * (value - 1) / (maximum - 1)), y + 15, 8, "knob")


def draw():
    s = Sheet()
    s.parts.append('<defs><linearGradient id="fade" x2="0" y2="1" gradientUnits="objectBoundingBox">'
                   '<stop stop-color="var(--sc-ink)" stop-opacity="0"/>'
                   '<stop offset="1" stop-color="var(--sc-ink)" stop-opacity=".48"/></linearGradient></defs>')
    s.text(20, 32, "Toolbar popup", "heading")
    s.rect(20, 52, 246, 294, "panel", 15)
    s.text(152, 87, "Preference", anchor="middle")
    # The two-slider preference glyph from the Svelte popup.
    s.path("M72 78h9m4 0h5m-18 7h3m5 0h10")
    s.circle(83, 78, 2, "knob")
    s.circle(78, 85, 2, "knob")
    s.path("M32 101H254", "leader")
    s.rect(32, 111, 222, 90, "card", 10)
    wave(s, 41, 162, 204, 23)
    slider(s, 237, "Samples", 4, 12)
    slider(s, 294, "Seconds", 6, 10)

    s.text(304, 32, "Hover on SoundCloud", "heading")
    s.rect(304, 52, 596, 190, "panel", 8)
    s.rect(324, 75, 79, 79, "card")
    s.path("M327 78L400 151M400 78L327 151", "leader")
    s.circle(444, 101, 22, "active")
    s.path("M444 81 A20 20 0 0 1 458.14 115.14", "progress")
    s.parts.append('<path d="M439 91l14 10-14 10z" fill="var(--sc-paper)"/>')
    s.text(481, 94, "Forss", "detail")
    s.text(481, 117, "Flickermood")
    wave(s, 425, 190, 450, 42, reflected=True)
    s.path("M444 125V139H414V255H324", "leader")
    s.text(324, 276, "Ring tracks total preview time", "detail")
    s.path("M614 201V254H659", "leader")
    s.text(659, 276, "Active sample pulses", "detail")
    s.text(304, 332, "Move away to stop. Click to play the track.", "detail")
    s.save()


if __name__ == '__main__':
    draw()
