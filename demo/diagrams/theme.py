"""Shared light and dark palettes for documentation SVGs."""
import re

LIGHT = {
    'paper': '#ffffff', 'paper-2': '#f3f3f3', 'ink': '#050505',
    'ink-strong': '#030303', 'muted': '#626262', 'soft': '#878787',
    'fill': '#f3f3f3', 'fill2': '#e8e8e8', 'skeleton': '#d5d5d5',
    'border': '#c4c4c4', 'rule-solid': '#bebebe', 'rule': '#dedede',
    'accent': '#050505', 'accent-tint': '#e8e8e8', 'link': '#050505',
    'node': '#ffffff', 'store': '#f3f3f3', 'external': '#f8f8f8',
}
DARK = {
    'paper': '#17191d', 'paper-2': '#22252b', 'ink': '#eeeeef',
    'ink-strong': '#ffffff', 'muted': '#b6bac3', 'soft': '#8c929e',
    'fill': '#22252b', 'fill2': '#30343c', 'skeleton': '#555c69',
    'border': '#626a79', 'rule-solid': '#626a79', 'rule': '#3d434e',
    'accent': '#eeeeef', 'accent-tint': '#30343c', 'link': '#eeeeef',
    'node': '#22252b', 'store': '#22252b', 'external': '#1d2025',
}


def declarations(palette):
    return ';'.join(f'--sc-{key}:{value}' for key, value in palette.items()) + ';'


def theme_css(selector='svg:root'):
    return (f'{selector}{{{declarations(LIGHT)}color-scheme:light dark}}'
            f'@media (prefers-color-scheme:dark){{{selector}{{{declarations(DARK)}}}}}')


def static_svg(svg, dark=False):
    """Resolve theme variables for resvg, which does not evaluate CSS variables."""
    svg = re.sub(r'@media \(prefers-color-scheme:dark\)\{[^{}]*\{[^{}]*\}\}', '', svg)
    variables = dict(re.findall(r'(--sc-[\w-]+):([^;}]+)', svg))
    variables.update({f'--sc-{k}': v for k, v in (DARK if dark else LIGHT).items()})
    return re.sub(r'var\((--sc-[\w-]+)\)', lambda m: variables.get(m[1], m[0]), svg)
