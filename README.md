# Quick Preview for SoundCloud

Quickly check out tracks and mixes before you hit play.
Hover a play button to hear a few samples. Pick how many and how long in the preferences.

![Quick Preview for SoundCloud](https://i.imgur.com/YFPk7VO.jpg)

## Install

<a href="https://chromewebstore.google.com/detail/lghceigagnfccdnkpdfbbhjjegijbjmp"><img src="assets/badges/chrome-web-store.png" width="206" alt="Available in the Chrome Web Store"></a>

| Browser | Store | Direct download |
| --- | --- | --- |
| Chrome | [Chrome Web Store](https://chromewebstore.google.com/detail/lghceigagnfccdnkpdfbbhjjegijbjmp) | [ZIP](releases/quick-preview-2.0.2-chrome.zip) — unzip and load unpacked |
| Firefox | Coming soon | [ZIP](releases/quick-preview-2.0.2-firefox.zip) — temporary install for testing |
| Safari | Coming soon | [Mac app](releases/quick-preview-2.0.2-safari-macos.zip) — Developer ID signed; not notarized |

[Install downloaded builds](docs/install.md).

## Development

```sh
npm ci
npm run build
```

Open `chrome://extensions`, turn on **Developer mode**, and **Load unpacked** → `.output/chrome-mv3/`. Refresh SoundCloud and you're ready.

`npm run dev` for development, `npm test` to run the tests.

[Usage](docs/usage.md) · [How it works](docs/architecture.md) · [Development notes](docs/development.md)
